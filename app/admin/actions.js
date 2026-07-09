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
