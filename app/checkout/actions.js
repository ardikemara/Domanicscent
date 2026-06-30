"use server";

import { getSql } from "@/lib/db";
import { products } from "@/lib/products";

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
           ${cust.id}, 'pending', 'bypass', 'bypass',
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

    return { ok: true, orderNumber };
  } catch (e) {
    return { ok: false, error: "Gagal: " + (e?.message || String(e)) };
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
