"use server";

import { getSql } from "@/lib/db";
import { products } from "@/lib/products";
import { createSnapTransaction } from "@/lib/midtrans";

const SHIPPING_FLAT = 25000;
const FREE_SHIP_MIN = 500000;

function priceFor(slug) {
  const p = products.find((x) => x.slug === slug);
  return p ? p : null;
}

function shippingFor(subtotal) {
  return subtotal >= FREE_SHIP_MIN ? 0 : SHIPPING_FLAT;
}

// Validate a promo code against the DB. Returns discount in rupiah.
export async function checkPromo(code, subtotal) {
  const clean = (code || "").trim().toUpperCase();
  if (!clean) return { valid: false, discount: 0, message: "" };
  try {
    const sql = getSql();
    const rows = await sql`
      select code, type, value, min_spend, active, starts_at, ends_at
      from domanic.promo_codes
      where upper(code) = ${clean} limit 1`;
    if (rows.length === 0) return { valid: false, discount: 0, message: "Kode promo nggak ketemu." };
    const promo = rows[0];
    const now = new Date();
    if (!promo.active) return { valid: false, discount: 0, message: "Kode promo udah nggak aktif." };
    if (promo.starts_at && new Date(promo.starts_at) > now)
      return { valid: false, discount: 0, message: "Kode promo belum berlaku." };
    if (promo.ends_at && new Date(promo.ends_at) < now)
      return { valid: false, discount: 0, message: "Kode promo udah lewat." };
    if (subtotal < promo.min_spend)
      return { valid: false, discount: 0, message: `Minimal belanja Rp ${promo.min_spend.toLocaleString("id-ID")}.` };

    let discount =
      promo.type === "percent" ? Math.round((subtotal * promo.value) / 100) : promo.value;
    if (discount > subtotal) discount = subtotal;
    const label = promo.type === "percent" ? `${promo.value}% off` : `Rp ${promo.value.toLocaleString("id-ID")} off`;
    return { valid: true, discount, code: clean, message: `Promo ${clean} kepakai (${label}).` };
  } catch (e) {
    return { valid: false, discount: 0, message: "Gagal cek promo, coba lagi." };
  }
}

// Create an order. Totals are recomputed server-side; client prices are ignored.
export async function createOrder(payload) {
  try {
    const items = Array.isArray(payload?.items) ? payload.items : [];
    const c = payload?.customer || {};
    if (items.length === 0) return { ok: false, error: "Keranjang kosong." };
    if (!c.name || !c.phone || !c.address) {
      return { ok: false, error: "Nama, nomor HP, dan alamat wajib diisi." };
    }

    // recompute line items from server data
    const lines = [];
    let subtotal = 0;
    for (const it of items) {
      const p = priceFor(it.slug);
      const qty = Math.max(1, parseInt(it.qty, 10) || 1);
      if (!p) continue;
      const lineTotal = p.price * qty;
      subtotal += lineTotal;
      lines.push({ slug: p.slug, name: p.name, unit: p.price, qty, lineTotal });
    }
    if (lines.length === 0) return { ok: false, error: "Produk nggak valid." };

    const promo = await checkPromo(payload?.promoCode, subtotal);
    const discount = promo.valid ? promo.discount : 0;
    const promoApplied = promo.valid ? promo.code : null;
    const shipping = shippingFor(subtotal);
    const total = subtotal - discount + shipping;

    const sql = getSql();
    let orderNumber = null;

    await sql.begin(async (tx) => {
      const [cust] = await tx`
        insert into domanic.customers (name, phone, email, address, city, notes)
        values (${c.name}, ${c.phone}, ${c.email || null}, ${c.address}, ${c.city || null}, ${c.note || null})
        returning id`;

      const [order] = await tx`
        insert into domanic.orders
          (order_number, customer_id, status, payment_status, payment_method,
           subtotal, discount, shipping, total, promo_code,
           name, phone, shipping_address, shipping_city, note)
        values
          ('DMN-' || to_char(now() at time zone 'Asia/Jakarta','YYYYMMDD') || '-' || lpad(nextval('domanic.order_seq')::text, 4, '0'),
           ${cust.id}, 'pending', 'unpaid', 'midtrans',
           ${subtotal}, ${discount}, ${shipping}, ${total}, ${promoApplied},
           ${c.name}, ${c.phone}, ${c.address}, ${c.city || null}, ${c.note || null})
        returning order_number`;
      orderNumber = order.order_number;

      for (const l of lines) {
        await tx`
          insert into domanic.order_items (order_id, product_slug, product_name, unit_price, qty, line_total)
          values (
            (select id from domanic.orders where order_number = ${orderNumber}),
            ${l.slug}, ${l.name}, ${l.unit}, ${l.qty}, ${l.lineTotal})`;
      }

      if (promoApplied) {
        await tx`update domanic.promo_codes set used_count = used_count + 1 where upper(code) = ${promoApplied}`;
      }

      // capture a lead from checkout (best effort)
      await tx`
        insert into domanic.leads (source, email, name, phone)
        values ('checkout', ${c.email || null}, ${c.name}, ${c.phone})`;
    });

    // Bikin transaksi Snap di Midtrans. Kalau gagal, order tetap tersimpan
    // (payment_status 'unpaid') dan customer bisa bayar ulang dari thank-you page.
    let snapToken = null;
    try {
      const snap = await createSnapTransaction({
        orderNumber,
        total,
        items: lines,
        discount,
        shipping,
        customer: c,
      });
      snapToken = snap.token;
      await sql`
        update domanic.orders
        set snap_token = ${snapToken}, payment_status = 'pending'
        where order_number = ${orderNumber}`;
    } catch (e) {
      // biarkan snapToken null; UI akan mengarahkan ke thank-you dengan opsi bayar ulang
    }

    return { ok: true, orderNumber, snapToken };
  } catch (e) {
    return { ok: false, error: "Gagal: " + (e?.message || String(e)) };
  }
}

// Ambil (atau bikin ulang) snap token untuk order yang belum dibayar.
// Dipakai tombol "Bayar sekarang" di thank-you page.
export async function getSnapToken(orderNumber) {
  const clean = (orderNumber || "").trim();
  if (!clean) return { ok: false, error: "Order nggak ketemu." };
  try {
    const sql = getSql();
    const rows = await sql`
      select o.order_number, o.total, o.discount, o.shipping, o.payment_status, o.snap_token,
             o.name, o.phone, o.shipping_address, o.shipping_city,
             c.email
      from domanic.orders o
      left join domanic.customers c on c.id = o.customer_id
      where o.order_number = ${clean} limit 1`;
    if (rows.length === 0) return { ok: false, error: "Order nggak ketemu." };
    const o = rows[0];
    if (o.payment_status === "paid") return { ok: false, error: "Order ini sudah dibayar." };
    if (o.snap_token) return { ok: true, snapToken: o.snap_token };

    const items = await sql`
      select product_slug, product_name, unit_price, qty
      from domanic.order_items
      where order_id = (select id from domanic.orders where order_number = ${clean})`;

    const snap = await createSnapTransaction({
      orderNumber: o.order_number,
      total: o.total,
      items: items.map((it) => ({ slug: it.product_slug, name: it.product_name, unit: it.unit_price, qty: it.qty })),
      discount: o.discount,
      shipping: o.shipping,
      customer: { name: o.name, phone: o.phone, email: o.email, address: o.shipping_address, city: o.shipping_city },
    });
    await sql`
      update domanic.orders set snap_token = ${snap.token}, payment_status = 'pending'
      where order_number = ${clean}`;
    return { ok: true, snapToken: snap.token };
  } catch (e) {
    return { ok: false, error: "Gagal menyiapkan pembayaran, coba lagi." };
  }
}

// Newsletter / lead capture
export async function subscribeLead(email, persona) {
  const clean = (email || "").trim();
  if (!clean || !clean.includes("@")) return { ok: false, error: "Email nggak valid." };
  try {
    const sql = getSql();
    await sql`insert into domanic.leads (source, email, persona) values ('newsletter', ${clean}, ${persona || null})`;
    return { ok: true };
  } catch (e) {
    return { ok: false, error: "Gagal subscribe, coba lagi." };
  }
}
