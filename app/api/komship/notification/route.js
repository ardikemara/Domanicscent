import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { mapKomshipStatus } from "@/lib/komship";

export const dynamic = "force-dynamic";

// Webhook Komship (Shipping Delivery). Payload: { order_no, cnote, status }.
// URL didaftarkan di dashboard Komerce (Developer > Webhook > Webhook Shipping Delivery):
// https://www.domanicscent.com/api/komship/notification?token=<KOMSHIP_WEBHOOK_TOKEN>
//
// Komship nggak pakai signature, jadi diamankan dengan token rahasia di query.
// Downgrade dicegah: completed nggak pernah balik ke shipped.
async function handle(req) {
  const token = process.env.KOMSHIP_WEBHOOK_TOKEN || "";
  if (token) {
    const got = new URL(req.url).searchParams.get("token") || "";
    if (got !== token) {
      return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 403 });
    }
  }

  let body = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const orderNo = body?.order_no || null;
  const awb = body?.cnote || "";
  const status = body?.status || "";
  if (!orderNo) return NextResponse.json({ ok: false, error: "no order_no" }, { status: 400 });

  try {
    const sql = getSql();
    const rows = await sql`
      select order_number, status from domanic.orders
      where komship_order_no = ${orderNo} limit 1`;
    // Bukan order kita: balas 200 biar Komship nggak retry terus.
    if (rows.length === 0) return NextResponse.json({ ok: true, note: "order not found" });
    const ord = rows[0];

    const mapped = mapKomshipStatus(status);
    if (mapped === "shipped" && ord.status !== "shipped" && ord.status !== "completed") {
      await sql`
        update domanic.orders
        set status = 'shipped', komship_status = ${status},
            tracking_number = coalesce(nullif(${awb}, ''), tracking_number),
            shipped_at = coalesce(shipped_at, now())
        where order_number = ${ord.order_number}`;
    } else if (mapped === "completed" && ord.status !== "completed") {
      await sql`
        update domanic.orders
        set status = 'completed', komship_status = ${status},
            tracking_number = coalesce(nullif(${awb}, ''), tracking_number)
        where order_number = ${ord.order_number}`;
    } else {
      await sql`
        update domanic.orders
        set komship_status = ${status},
            tracking_number = coalesce(nullif(${awb}, ''), tracking_number)
        where order_number = ${ord.order_number}`;
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "DB error" }, { status: 500 });
  }
}

// Docs bilang PUT, tapi terima POST juga buat jaga-jaga.
export async function PUT(req) {
  return handle(req);
}
export async function POST(req) {
  return handle(req);
}
