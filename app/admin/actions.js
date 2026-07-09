"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSql } from "@/lib/db";
import { products } from "@/lib/products";
import { checkPassword, createSessionCookie, clearSessionCookie, isAdmin } from "@/lib/adminAuth";

export async function loginAdmin(formData) {
  const pw = formData.get("password");
  if (!checkPassword(pw)) {
    redirect("/admin/login?e=1");
  }
  createSessionCookie();
  redirect("/admin/orders");
}

export async function logoutAdmin() {
  clearSessionCookie();
  redirect("/admin/login");
}

function guard() {
  if (!isAdmin()) redirect("/admin/login");
}

// Tandai dikirim + simpan nomor resi JNE.
export async function markShipped(formData) {
  guard();
  const orderNumber = (formData.get("orderNumber") || "").toString().trim();
  const resi = (formData.get("resi") || "").toString().trim();
  if (!orderNumber || !resi) redirect(`/admin/orders/${encodeURIComponent(orderNumber)}?e=resi`);
  const sql = getSql();
  await sql`
    update domanic.orders
    set status = 'shipped', tracking_number = ${resi}, shipped_at = now()
    where order_number = ${orderNumber} and payment_status = 'paid'`;
  revalidatePath(`/admin/orders/${orderNumber}`);
  revalidatePath("/admin/orders");
  redirect(`/admin/orders/${encodeURIComponent(orderNumber)}`);
}

export async function markCompleted(formData) {
  guard();
  const orderNumber = (formData.get("orderNumber") || "").toString().trim();
  const sql = getSql();
  await sql`
    update domanic.orders set status = 'completed'
    where order_number = ${orderNumber} and status = 'shipped'`;
  revalidatePath(`/admin/orders/${orderNumber}`);
  revalidatePath("/admin/orders");
  redirect(`/admin/orders/${encodeURIComponent(orderNumber)}`);
}

export async function cancelOrder(formData) {
  guard();
  const orderNumber = (formData.get("orderNumber") || "").toString().trim();
  const sql = getSql();
  // Batalkan hanya kalau belum dikirim.
  await sql`
    update domanic.orders set status = 'cancelled'
    where order_number = ${orderNumber} and status in ('pending','paid')`;
  revalidatePath(`/admin/orders/${orderNumber}`);
  revalidatePath("/admin/orders");
  redirect(`/admin/orders/${encodeURIComponent(orderNumber)}`);
}

// ---- Versi drawer: dipanggil dari client, return {ok, order} (bukan redirect). ----
// Sengaja TANPA revalidatePath: client update datanya sendiri dari `order` yang
// di-return, jadi halaman nggak ke-refresh (kalau refresh, drawer ketutup/bounce).

// Ambil satu order + item dalam bentuk plain object (buat di-return ke client).
async function fetchOrderPlain(sql, on) {
  const rows = await sql`
    select o.*, c.email
    from domanic.orders o
    left join domanic.customers c on c.id = o.customer_id
    where o.order_number = ${on} limit 1`;
  if (rows.length === 0) return null;
  const items = await sql`
    select product_name, qty, unit_price, line_total
    from domanic.order_items
    where order_id = (select id from domanic.orders where order_number = ${on})`;
  return { ...rows[0], items: items.map((it) => ({ ...it })) };
}

export async function markShippedFromDrawer(orderNumber, resi) {
  if (!isAdmin()) return { ok: false, error: "Sesi habis, login ulang." };
  const on = (orderNumber || "").toString().trim();
  const tn = (resi || "").toString().trim();
  if (!on || !tn) return { ok: false, error: "Nomor resi wajib diisi." };
  const sql = getSql();
  await sql`
    update domanic.orders
    set status = 'shipped', tracking_number = ${tn}, shipped_at = now()
    where order_number = ${on} and payment_status = 'paid'`;
  return { ok: true, order: await fetchOrderPlain(sql, on) };
}

export async function markCompletedFromDrawer(orderNumber) {
  if (!isAdmin()) return { ok: false, error: "Sesi habis, login ulang." };
  const on = (orderNumber || "").toString().trim();
  const sql = getSql();
  await sql`
    update domanic.orders set status = 'completed'
    where order_number = ${on} and status = 'shipped'`;
  return { ok: true, order: await fetchOrderPlain(sql, on) };
}

export async function cancelOrderFromDrawer(orderNumber) {
  if (!isAdmin()) return { ok: false, error: "Sesi habis, login ulang." };
  const on = (orderNumber || "").toString().trim();
  const sql = getSql();
  await sql`
    update domanic.orders set status = 'cancelled'
    where order_number = ${on} and status in ('pending','paid')`;
  return { ok: true, order: await fetchOrderPlain(sql, on) };
}

// Set stok awal parfum (dipanggil dari drawer Data Parfum). Return nilai baru.
export async function setParfumStock(slug, baseStock) {
  if (!isAdmin()) return { ok: false, error: "Sesi habis, login ulang." };
  const s = (slug || "").toString().trim();
  if (!products.some((p) => p.slug === s)) return { ok: false, error: "Parfum tidak dikenal." };
  const n = Math.max(0, parseInt(baseStock, 10) || 0);
  const sql = getSql();
  await sql`
    insert into domanic.product_stock (slug, base_stock, updated_at)
    values (${s}, ${n}, now())
    on conflict (slug) do update set base_stock = ${n}, updated_at = now()`;
  return { ok: true, base_stock: n };
}

// ---- Promo CRUD (drawer Data Promo). Return {ok, promo} biar client patch state. ----

export async function savePromo(input) {
  if (!isAdmin()) return { ok: false, error: "Sesi habis, login ulang." };
  const code = (input?.code || "").toString().trim().toUpperCase();
  if (!code) return { ok: false, error: "Kode wajib diisi." };
  const type = ["fixed", "freeship"].includes(input?.type) ? input.type : "percent";
  let value = parseInt(input?.value, 10);
  if (type === "freeship") {
    value = 0; // free ongkir nggak butuh nilai diskon subtotal
  } else {
    if (!Number.isFinite(value) || value <= 0) return { ok: false, error: "Nilai diskon harus lebih dari 0." };
    if (type === "percent" && value > 100) return { ok: false, error: "Diskon persen maksimal 100." };
  }
  const minSpend = Math.max(0, parseInt(input?.min_spend, 10) || 0);
  const active = !!input?.active;
  const startsAt = input?.starts_at ? input.starts_at : null;
  const endsAt = input?.ends_at ? input.ends_at : null;
  const usageLimit = input?.usage_limit ? Math.max(1, parseInt(input.usage_limit, 10)) : null;
  // Scope produk: cuma slug yang valid; kosong = berlaku semua produk (null).
  const slugs = Array.isArray(input?.product_slugs)
    ? input.product_slugs.filter((s) => products.some((p) => p.slug === s))
    : [];
  const productSlugs = slugs.length ? slugs : null;
  const id = input?.id || null;
  const sql = getSql();

  const dup = await sql`
    select id from domanic.promo_codes
    where upper(code) = ${code} and (${id}::uuid is null or id <> ${id}) limit 1`;
  if (dup.length) return { ok: false, error: "Kode itu udah dipakai promo lain." };

  let row;
  if (id) {
    [row] = await sql`
      update domanic.promo_codes set
        code = ${code}, type = ${type}, value = ${value}, min_spend = ${minSpend},
        active = ${active}, starts_at = ${startsAt}, ends_at = ${endsAt}, usage_limit = ${usageLimit},
        product_slugs = ${productSlugs}
      where id = ${id}
      returning id, code, type, value, min_spend, active, starts_at, ends_at, usage_limit, used_count, product_slugs`;
    if (!row) return { ok: false, error: "Promo nggak ketemu." };
  } else {
    [row] = await sql`
      insert into domanic.promo_codes (code, type, value, min_spend, active, starts_at, ends_at, usage_limit, product_slugs)
      values (${code}, ${type}, ${value}, ${minSpend}, ${active}, ${startsAt}, ${endsAt}, ${usageLimit}, ${productSlugs})
      returning id, code, type, value, min_spend, active, starts_at, ends_at, usage_limit, used_count, product_slugs`;
  }
  return { ok: true, promo: { ...row } };
}

export async function togglePromo(id, active) {
  if (!isAdmin()) return { ok: false, error: "Sesi habis, login ulang." };
  const sql = getSql();
  const [row] = await sql`
    update domanic.promo_codes set active = ${!!active} where id = ${id}
    returning id, code, type, value, min_spend, active, starts_at, ends_at, usage_limit, used_count, product_slugs`;
  if (!row) return { ok: false, error: "Promo nggak ketemu." };
  return { ok: true, promo: { ...row } };
}

export async function deletePromo(id) {
  if (!isAdmin()) return { ok: false, error: "Sesi habis, login ulang." };
  const sql = getSql();
  await sql`delete from domanic.promo_codes where id = ${id}`;
  return { ok: true, id };
}
