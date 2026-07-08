import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { verifySignature, mapPaymentStatus } from "@/lib/midtrans";

export const dynamic = "force-dynamic";

// Payment Notification URL yang di-set di dashboard Midtrans:
// https://www.domanicscent.com/api/midtrans/notification
export async function POST(req) {
  let body = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Verifikasi signature. Tanpa ini siapa pun bisa nge-fake status "paid".
  if (!verifySignature(body)) {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 403 });
  }

  const orderNumber = body.order_id;
  const paymentStatus = mapPaymentStatus(body);
  const txId = body.transaction_id || null;

  try {
    const sql = getSql();
    const rows = await sql`
      select payment_status from domanic.orders where order_number = ${orderNumber} limit 1`;
    if (rows.length === 0) {
      // Order nggak ada di DB kita (misalnya test dari dashboard). Balas 200 biar Midtrans nggak retry terus.
      return NextResponse.json({ ok: true, note: "order not found" });
    }

    // Jangan turunkan status yang sudah paid (notifikasi bisa datang out-of-order).
    if (rows[0].payment_status === "paid" && paymentStatus !== "refunded") {
      return NextResponse.json({ ok: true, note: "already paid" });
    }

    if (paymentStatus === "paid") {
      await sql`
        update domanic.orders
        set payment_status = 'paid', status = 'paid',
            midtrans_transaction_id = ${txId}, paid_at = now()
        where order_number = ${orderNumber}`;
    } else {
      await sql`
        update domanic.orders
        set payment_status = ${paymentStatus}, midtrans_transaction_id = ${txId}
        where order_number = ${orderNumber}`;
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    // 500 supaya Midtrans retry notifikasinya.
    return NextResponse.json({ ok: false, error: "DB error" }, { status: 500 });
  }
}
