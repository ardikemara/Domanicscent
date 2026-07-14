import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

// Payload event purchase, server-authoritative.
// Return payload HANYA kalau payment_status = 'paid' DAN belum pernah di-track.
// Update + cek dilakukan dalam SATU statement (atomic), jadi dipanggil 100x
// pun purchase cuma bisa fire sekali per order.
export async function POST(req) {
  let body = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ track: false }, { status: 400 });
  }
  const orderId = (body?.orderId || "").toString().trim();
  if (!orderId) return NextResponse.json({ track: false }, { status: 400 });

  try {
    const sql = getSql();
    const rows = await sql`
      update domanic.orders
      set analytics_tracked_at = now()
      where order_number = ${orderId}
        and payment_status = 'paid'
        and analytics_tracked_at is null
      returning id, order_number, subtotal, discount, shipping`;
    if (rows.length === 0) return NextResponse.json({ track: false });

    const o = rows[0];
    const items = await sql`
      select product_slug, product_name, qty, unit_price
      from domanic.order_items where order_id = ${o.id}`;

    // value = subtotal produk setelah diskon promo, TANPA ongkir
    // (ongkir bukan revenue, dikirim terpisah di field shipping).
    return NextResponse.json({
      track: true,
      order: {
        orderNumber: o.order_number,
        value: Math.max(0, (o.subtotal || 0) - (o.discount || 0)),
        shipping: o.shipping || 0,
        items: items.map((it) => ({
          slug: it.product_slug,
          name: it.product_name,
          qty: it.qty,
          price: it.unit_price,
        })),
      },
    });
  } catch {
    return NextResponse.json({ track: false }, { status: 500 });
  }
}
