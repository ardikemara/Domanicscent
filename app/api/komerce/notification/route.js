import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { getStatus, mapStatus, verifyCallback } from "@/lib/komercePay";
import { sendEmail, paymentReceivedEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

// Callback/Webhook Komerce. URL yang di-set di dashboard Komerce (Developer > Webhook)
// dan/atau dikirim per-request saat create:
// https://www.domanicscent.com/api/komerce/notification
//
// Keputusan "paid" SELALU diambil dari getStatus() (authenticated pakai API key kita),
// bukan dari isi callback. Jadi callback palsu nggak bisa maksa order jadi paid;
// verifikasi signature dipakai sebagai lapis tambahan.
export async function POST(req) {
  const raw = await req.text();
  const sig =
    req.headers.get("x-callback-api-key") || req.headers.get("X-Callback-Api-Key") || "";

  let body = {};
  try {
    body = JSON.parse(raw || "{}");
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const verified = verifyCallback(raw, sig);
  const d = body?.data && typeof body.data === "object" ? body.data : body;
  const paymentId = d?.payment_id || body?.payment_id || null;
  const orderNumber = d?.order_id || body?.order_id || null;

  if (!paymentId && !orderNumber) {
    return NextResponse.json({ ok: false, error: "no identifier" }, { status: 400 });
  }

  try {
    const sql = getSql();

    let ord = null;
    if (orderNumber) {
      const r = await sql`
        select order_number, payment_status, komerce_payment_id
        from domanic.orders where order_number = ${orderNumber} limit 1`;
      ord = r[0] || null;
    }
    if (!ord && paymentId) {
      const r = await sql`
        select order_number, payment_status, komerce_payment_id
        from domanic.orders where komerce_payment_id = ${paymentId} limit 1`;
      ord = r[0] || null;
    }
    // Order nggak ada di DB kita (mis. test dari dashboard). Balas 200 biar nggak retry.
    if (!ord) return NextResponse.json({ ok: true, note: "order not found" });

    // Idempotent: jangan turunkan status yang sudah paid.
    if (ord.payment_status === "paid") {
      return NextResponse.json({ ok: true, note: "already paid", verified });
    }

    const statusPaymentId = paymentId || ord.komerce_payment_id;
    if (!statusPaymentId) return NextResponse.json({ ok: true, note: "no payment id" });

    // Sumber kebenaran: tanya status langsung ke Komerce.
    let s;
    try {
      s = await getStatus(statusPaymentId);
    } catch {
      // 500 supaya Komerce retry.
      return NextResponse.json({ ok: false, error: "status fetch failed" }, { status: 500 });
    }
    const paymentStatus = mapStatus(s.status);

    if (paymentStatus === "paid") {
      await sql`
        update domanic.orders
        set payment_status = 'paid', status = 'paid',
            komerce_payment_id = ${statusPaymentId}, paid_at = now()
        where order_number = ${ord.order_number}`;

      // Email "pembayaran diterima" (best-effort). Guard "already paid" di atas
      // mastiin ini cuma jalan sekali per order.
      try {
        const [o] = await sql`
          select o.order_number, o.name, o.subtotal, o.discount, o.shipping, o.total, o.promo_code, c.email
          from domanic.orders o
          left join domanic.customers c on c.id = o.customer_id
          where o.order_number = ${ord.order_number} limit 1`;
        if (o?.email) {
          const items = await sql`
            select product_name, qty, line_total from domanic.order_items
            where order_id = (select id from domanic.orders where order_number = ${ord.order_number})`;
          const { subject, html } = paymentReceivedEmail({
            orderNumber: o.order_number, name: o.name,
            items: items.map((i) => ({ name: i.product_name, qty: i.qty, lineTotal: i.line_total })),
            subtotal: o.subtotal, discount: o.discount, shipping: o.shipping, total: o.total, promoCode: o.promo_code,
          });
          await sendEmail({ to: o.email, subject, html });
        }
      } catch (e) {
        // diamkan; status paid udah kesimpen
      }
    } else {
      await sql`
        update domanic.orders
        set payment_status = ${paymentStatus}, komerce_payment_id = ${statusPaymentId}
        where order_number = ${ord.order_number}`;
    }

    return NextResponse.json({ ok: true, verified });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "DB error" }, { status: 500 });
  }
}
