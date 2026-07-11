"use server";

import { getSql } from "@/lib/db";
import { products } from "@/lib/products";
import { createSnapTransaction } from "@/lib/midtrans";
import { searchDestination, quoteJne } from "@/lib/rajaongkir";
import { sendEmail, personaResultEmail } from "@/lib/email";

const SHIPPING_FALLBACK = 25000;   // dipakai kalau API ongkir gagal
const FREE_SHIP_MIN = 500000;
const GRAMS_PER_BOTTLE = 500;      // asumsi botol 50ml + packaging; update setelah ditimbang

function priceFor(slug) {
  const p = products.find((x) => x.slug === slug);
  return p ? p : null;
}

function weightFor(totalQty) {
  return Math.max(1, totalQty) * GRAMS_PER_BOTTLE;
}

// Hitung ongkir server-side. Gratis di atas FREE_SHIP_MIN, sisanya real-time JNE
// (origin gudang Bekasi) dengan fallback flat kalau API bermasalah.
async function shippingQuoteFor(subtotal, totalQty, destinationId) {
  if (subtotal >= FREE_SHIP_MIN) return { cost: 0, service: null, etd: null, free: true };
  if (destinationId) {
    const q = await quoteJne(destinationId, weightFor(totalQty));
    if (q) return { cost: q.cost, service: q.service, etd: q.etd, free: false };
  }
  return { cost: SHIPPING_FALLBACK, service: null, etd: null, free: false };
}

// Autocomplete tujuan pengiriman (dipakai checkout page).
export async function findDestinations(query) {
  try {
    return await searchDestination(query);
  } catch {
    return [];
  }
}

// Quote ongkir untuk ditampilkan di ringkasan checkout (sebelum order dibuat).
export async function quoteShipping(destinationId, items) {
  try {
    const list = Array.isArray(items) ? items : [];
    let subtotal = 0;
    let qty = 0;
    for (const it of list) {
      const p = priceFor(it.slug);
      const n = Math.max(1, parseInt(it.qty, 10) || 1);
      if (!p) continue;
      subtotal += p.price * n;
      qty += n;
    }
    const s = await shippingQuoteFor(subtotal, qty, destinationId);
    return { ok: true, ...s };
  } catch {
    return { ok: true, cost: SHIPPING_FALLBACK, service: null, etd: null, free: false };
  }
}

// Validate a promo code against the DB. Returns discount in rupiah.
// lines: [{ slug, lineTotal }] opsional, buat promo yang cuma berlaku ke produk tertentu.
export async function checkPromo(code, subtotal, lines) {
  const clean = (code || "").trim().toUpperCase();
  if (!clean) return { valid: false, discount: 0, freeship: false, message: "" };
  try {
    const sql = getSql();
    const rows = await sql`
      select code, type, value, min_spend, active, starts_at, ends_at, usage_limit, used_count, product_slugs
      from domanic.promo_codes
      where upper(code) = ${clean} limit 1`;
    if (rows.length === 0) return { valid: false, discount: 0, freeship: false, message: "Kode promo nggak ketemu." };
    const promo = rows[0];
    const now = new Date();
    if (!promo.active) return { valid: false, discount: 0, freeship: false, message: "Kode promo udah nggak aktif." };
    if (promo.starts_at && new Date(promo.starts_at) > now)
      return { valid: false, discount: 0, freeship: false, message: "Kode promo belum berlaku." };
    if (promo.ends_at && new Date(promo.ends_at) < now)
      return { valid: false, discount: 0, freeship: false, message: "Kode promo udah lewat." };
    if (promo.usage_limit != null && promo.used_count >= promo.usage_limit)
      return { valid: false, discount: 0, freeship: false, message: "Kuota promo udah habis." };
    if (subtotal < promo.min_spend)
      return { valid: false, discount: 0, freeship: false, message: `Minimal belanja Rp ${promo.min_spend.toLocaleString("id-ID")}.` };

    // Promo yang dibatasi ke produk tertentu: diskon dihitung dari harga produk itu aja.
    const slugs = Array.isArray(promo.product_slugs) ? promo.product_slugs : [];
    let base = subtotal;
    if (slugs.length > 0) {
      base = Array.isArray(lines)
        ? lines.filter((l) => slugs.includes(l.slug)).reduce((s, l) => s + (l.lineTotal || 0), 0)
        : 0;
      if (base <= 0)
        return { valid: false, discount: 0, freeship: false, message: "Promo ini cuma buat produk tertentu, nggak ada di keranjang." };
    }

    if (promo.type === "freeship") {
      return { valid: true, discount: 0, freeship: true, code: clean, message: `Promo ${clean} kepakai (gratis ongkir).` };
    }

    let discount = promo.type === "percent" ? Math.round((base * promo.value) / 100) : Math.min(promo.value, base);
    if (discount > subtotal) discount = subtotal;
    const label = promo.type === "percent" ? `${promo.value}% off` : `Rp ${promo.value.toLocaleString("id-ID")} off`;
    return { valid: true, discount, freeship: false, code: clean, message: `Promo ${clean} kepakai (${label}).` };
  } catch (e) {
    return { valid: false, discount: 0, freeship: false, message: "Gagal cek promo, coba lagi." };
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
    if (!c.email || !String(c.email).includes("@")) {
      return { ok: false, error: "Email wajib diisi dan harus valid." };
    }

    // recompute line items from server data
    const lines = [];
    let subtotal = 0;
    let totalQty = 0;
    for (const it of items) {
      const p = priceFor(it.slug);
      const qty = Math.max(1, parseInt(it.qty, 10) || 1);
      if (!p) continue;
      const lineTotal = p.price * qty;
      subtotal += lineTotal;
      totalQty += qty;
      lines.push({ slug: p.slug, name: p.name, unit: p.price, qty, lineTotal });
    }
    if (lines.length === 0) return { ok: false, error: "Produk nggak valid." };

    const promo = await checkPromo(payload?.promoCode, subtotal, lines);
    const discount = promo.valid ? promo.discount : 0;
    const promoApplied = promo.valid ? promo.code : null;
    const destinationId = payload?.destination?.id ? parseInt(payload.destination.id, 10) : null;
    const destinationLabel = (payload?.destination?.label || "").slice(0, 200) || null;
    const ship = await shippingQuoteFor(subtotal, totalQty, destinationId);
    const shipping = (promo.valid && promo.freeship) ? 0 : ship.cost;
    const total = subtotal - discount + shipping;

    const sql = getSql();
    let orderNumber = null;

    await sql.begin(async (tx) => {
      // Cari customer lama (dedup by email, fallback HP) biar 1 orang = 1 customer.
      // Kalau ketemu, reuse + update kontak ke yang terbaru; kalau nggak, insert baru.
      const emailKey = (c.email || "").trim().toLowerCase() || null;
      const phoneKey = (c.phone || "").trim() || null;
      const existing = await tx`
        select id from domanic.customers
        where (${emailKey}::text is not null and lower(trim(email)) = ${emailKey})
           or (${emailKey}::text is null and ${phoneKey}::text is not null and trim(phone) = ${phoneKey})
        order by created_at desc limit 1`;
      let custId;
      if (existing.length) {
        custId = existing[0].id;
        await tx`
          update domanic.customers
          set name = ${c.name}, phone = ${c.phone}, email = ${c.email || null},
              address = ${c.address}, city = ${c.city || null}, notes = ${c.note || null}
          where id = ${custId}`;
      } else {
        const [cust] = await tx`
          insert into domanic.customers (name, phone, email, address, city, notes)
          values (${c.name}, ${c.phone}, ${c.email || null}, ${c.address}, ${c.city || null}, ${c.note || null})
          returning id`;
        custId = cust.id;
      }

      const [order] = await tx`
        insert into domanic.orders
          (order_number, customer_id, status, payment_status, payment_method,
           subtotal, discount, shipping, total, promo_code,
           name, phone, shipping_address, shipping_city, note,
           shipping_destination_id, shipping_courier, shipping_etd)
        values
          ('DMN-' || to_char(now() at time zone 'Asia/Jakarta','YYYYMMDD') || '-' || lpad(nextval('domanic.order_seq')::text, 4, '0'),
           ${custId}, 'pending', 'unpaid', 'midtrans',
           ${subtotal}, ${discount}, ${shipping}, ${total}, ${promoApplied},
           ${c.name}, ${c.phone}, ${c.address}, ${destinationLabel || c.city || null}, ${c.note || null},
           ${destinationId}, ${ship.service ? 'jne' : null}, ${ship.etd || null})
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
export async function subscribeLead(email, persona, source, name, phone) {
  const clean = (email || "").trim();
  if (!clean || !clean.includes("@")) return { ok: false, error: "Email nggak valid." };
  const src = source === "persona" ? "persona" : "newsletter";
  const nm = (name || "").toString().trim().slice(0, 120) || null;
  const ph = (phone || "").toString().trim().slice(0, 40) || null;
  try {
    const sql = getSql();
    await sql`
      insert into domanic.leads (source, email, persona, name, phone)
      values (${src}, ${clean}, ${persona || null}, ${nm}, ${ph})`;
  } catch (e) {
    return { ok: false, error: "Gagal subscribe, coba lagi." };
  }

  // Kirim email hasil quiz (best-effort). Gagal kirim nggak bikin lead gagal.
  if (src === "persona" && persona) {
    try {
      const product = products.find((p) => p.slug === persona);
      if (product) {
        const { subject, html } = personaResultEmail(product, nm);
        await sendEmail({ to: clean, subject, html });
      }
    } catch (e) {
      // diamkan, lead tetap tersimpan
    }
  }
  return { ok: true };
}
