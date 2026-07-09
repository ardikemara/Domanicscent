"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSql } from "@/lib/db";
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

// ---- Versi drawer: dipanggil dari client, return status (bukan redirect). ----

// Ambil detail satu order buat isi drawer (on-demand).
export async function getOrderDetail(orderNumber) {
  if (!isAdmin()) return { error: "unauthorized" };
  const on = (orderNumber || "").toString().trim();
  if (!on) return { error: "no-order" };
  const sql = getSql();
  const rows = await sql`
    select o.*, c.email
    from domanic.orders o
    left join domanic.customers c on c.id = o.customer_id
    where o.order_number = ${on} limit 1`;
  if (rows.length === 0) return { error: "not-found" };
  const items = await sql`
    select product_name, qty, unit_price, line_total
    from domanic.order_items
    where order_id = (select id from domanic.orders where order_number = ${on})`;
  return { order: rows[0], items };
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
  revalidatePath("/admin/orders");
  return { ok: true };
}

export async function markCompletedFromDrawer(orderNumber) {
  if (!isAdmin()) return { ok: false, error: "Sesi habis, login ulang." };
  const on = (orderNumber || "").toString().trim();
  const sql = getSql();
  await sql`
    update domanic.orders set status = 'completed'
    where order_number = ${on} and status = 'shipped'`;
  revalidatePath("/admin/orders");
  return { ok: true };
}

export async function cancelOrderFromDrawer(orderNumber) {
  if (!isAdmin()) return { ok: false, error: "Sesi habis, login ulang." };
  const on = (orderNumber || "").toString().trim();
  const sql = getSql();
  await sql`
    update domanic.orders set status = 'cancelled'
    where order_number = ${on} and status in ('pending','paid')`;
  revalidatePath("/admin/orders");
  return { ok: true };
}
