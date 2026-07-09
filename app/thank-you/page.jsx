import Link from "next/link";
import { getSql } from "@/lib/db";
import { rupiah } from "@/lib/products";

function isPaid(s) {
  return s === "paid";
}
function paymentLabel(s) {
  if (s === "paid") return "Lunas";
  if (s === "pending") return "Menunggu pembayaran";
  if (s === "expired") return "Kedaluwarsa, silakan bayar ulang";
  if (s === "failed") return "Gagal, silakan coba lagi";
  if (s === "refunded") return "Di-refund";
  return "Belum dibayar";
}
function badgeKind(s) {
  if (s === "paid") return "paid";
  if (s === "pending" || s === "unpaid") return "pending";
  return "failed";
}

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Terima kasih · DOMANIC",
  robots: { index: false, follow: false },
};

async function fetchOrder(orderNumber) {
  if (!orderNumber) return null;
  try {
    const sql = getSql();
    const orders = await sql`
      select order_number, name, phone, shipping_address, shipping_city,
             subtotal, discount, shipping, total, promo_code, status, payment_status, created_at
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

export default async function ThankYou({ searchParams }) {
  const orderNumber = searchParams?.order || null;
  const data = await fetchOrder(orderNumber);

  return (
    <div className="wrap thanks">
      <p className="eyebrow">Order diterima</p>
      <h1>Terima kasih, pesananmu sudah masuk.</h1>

      {!data ? (
        <>
          <p className="thanks__lead">
            {orderNumber
              ? `Order ${orderNumber} sedang kami proses.`
              : "Pesananmu sedang kami proses."}{" "}
            Tim Domanic akan menghubungi kamu via WhatsApp untuk pengiriman.
          </p>
          <Link className="btn btn--solid" href="/#collection">Lanjut belanja</Link>
        </>
      ) : (
        <>
          <p className="thanks__lead">
            Order <b>{data.order.order_number}</b> atas nama {data.order.name}.{" "}
            {isPaid(data.order.payment_status)
              ? `Pembayaran sudah kami terima. Tim Domanic akan menghubungi kamu via WhatsApp (${data.order.phone}) untuk pengiriman.`
              : "Selesaikan pembayaran di bawah ini supaya pesananmu langsung kami proses."}
          </p>

          <div className="thanks__card">
            <div className="thanks__items">
              {data.items.map((it, i) => (
                <div className="thanks__row" key={i}>
                  <span>{it.product_name} × {it.qty}</span>
                  <span>{rupiah(it.line_total)}</span>
                </div>
              ))}
            </div>
            <div className="thanks__totals">
              <div><span>Subtotal</span><span>{rupiah(data.order.subtotal)}</span></div>
              {data.order.discount > 0 && (
                <div><span>Diskon {data.order.promo_code ? `(${data.order.promo_code})` : ""}</span><span>- {rupiah(data.order.discount)}</span></div>
              )}
              <div><span>Ongkir</span><span>{data.order.shipping === 0 ? "Gratis" : rupiah(data.order.shipping)}</span></div>
              <div className="grand"><span>Total</span><span>{rupiah(data.order.total)}</span></div>
            </div>
            <p className="thanks__addr">
              Kirim ke: {data.order.shipping_address}{data.order.shipping_city ? `, ${data.order.shipping_city}` : ""}
            </p>
            <p className="thanks__status">
              Pembayaran:{" "}
              <span className={`paybadge paybadge--${badgeKind(data.order.payment_status)}`}>
                {paymentLabel(data.order.payment_status)}
              </span>
            </p>
          </div>

          <div className="thanks__actions">
            {!isPaid(data.order.payment_status) && (
              <Link className="btn btn--solid" href={`/pay/${encodeURIComponent(data.order.order_number)}`}>
                Bayar sekarang
              </Link>
            )}
            <Link className={`btn ${isPaid(data.order.payment_status) ? "btn--solid" : "btn--ghost"}`} href="/#collection">
              Lanjut belanja
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
