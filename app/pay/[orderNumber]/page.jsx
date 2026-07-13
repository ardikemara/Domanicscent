import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getSql } from "@/lib/db";
import { rupiah } from "@/lib/products";
import { getMethods } from "@/lib/komercePay";
import KomercePicker from "@/components/payment/KomercePicker";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pembayaran · DOMANIC",
  robots: { index: false, follow: false },
};

async function fetchOrder(orderNumber) {
  if (!orderNumber) return null;
  try {
    const sql = getSql();
    const orders = await sql`
      select order_number, name, subtotal, discount, shipping, total, promo_code, payment_status
      from domanic.orders where order_number = ${orderNumber} limit 1`;
    if (orders.length === 0) return null;
    const items = await sql`
      select product_name, qty, unit_price, line_total
      from domanic.order_items
      where order_id = (select id from domanic.orders where order_number = ${orderNumber})`;
    return { order: orders[0], items };
  } catch (e) {
    return null;
  }
}

async function fetchMethods() {
  try {
    return await getMethods();
  } catch {
    return [];
  }
}

export default async function PayPage({ params }) {
  const orderNumber = decodeURIComponent(params?.orderNumber || "");
  const data = await fetchOrder(orderNumber);
  if (!data) notFound();
  if (data.order.payment_status === "paid") {
    redirect(`/thank-you?order=${encodeURIComponent(orderNumber)}`);
  }
  const methods = await fetchMethods();

  return (
    <div className="wrap pay">
      <p className="eyebrow">Pembayaran</p>
      <h1>Selesaikan pembayaranmu.</h1>
      <p className="pay__lead">
        Order <b>{data.order.order_number}</b> atas nama {data.order.name}. Pilih metode di bawah,
        pembayaran diproses aman oleh Komerce.
      </p>

      <div className="pay__grid">
        <aside className="pay__summary">
          <h3>Ringkasan order</h3>
          {data.items.map((it, i) => (
            <div className="pay__row" key={i}>
              <span>{it.product_name} × {it.qty}</span>
              <span>{rupiah(it.line_total)}</span>
            </div>
          ))}
          <div className="pay__totals">
            <div><span>Subtotal</span><span>{rupiah(data.order.subtotal)}</span></div>
            {data.order.discount > 0 && (
              <div><span>Diskon{data.order.promo_code ? ` (${data.order.promo_code})` : ""}</span><span>-{rupiah(data.order.discount)}</span></div>
            )}
            <div><span>Ongkir</span><span>{data.order.shipping === 0 ? "Gratis" : rupiah(data.order.shipping)}</span></div>
            <div className="grand"><span>Total</span><span>{rupiah(data.order.total)}</span></div>
          </div>
          <p className="pay__note">
            Simpan link halaman ini. Kalau kamu keluar sebelum bayar, buka lagi kapan pun untuk
            memilih metode dan melanjutkan pembayaran.
          </p>
          <Link className="pay__back" href="/#collection">Kembali ke koleksi</Link>
        </aside>

        <KomercePicker
          orderNumber={data.order.order_number}
          methods={methods}
          total={data.order.total}
        />
      </div>
    </div>
  );
}
