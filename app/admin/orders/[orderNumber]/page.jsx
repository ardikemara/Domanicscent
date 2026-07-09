import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getSql } from "@/lib/db";
import { rupiah } from "@/lib/products";
import { isAdmin } from "@/lib/adminAuth";
import { markShipped, markCompleted, cancelOrder } from "@/app/admin/actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Detail Order · Admin DOMANIC", robots: { index: false, follow: false } };

async function fetchOrder(orderNumber) {
  const sql = getSql();
  const rows = await sql`
    select o.*, c.email
    from domanic.orders o
    left join domanic.customers c on c.id = o.customer_id
    where o.order_number = ${orderNumber} limit 1`;
  if (rows.length === 0) return null;
  const items = await sql`
    select product_name, qty, unit_price, line_total
    from domanic.order_items
    where order_id = (select id from domanic.orders where order_number = ${orderNumber})`;
  return { order: rows[0], items };
}

function fmt(d) {
  if (!d) return "-";
  return new Date(d).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" });
}

export default async function AdminOrderDetail({ params, searchParams }) {
  if (!isAdmin()) redirect("/admin/login");
  const orderNumber = decodeURIComponent(params?.orderNumber || "");
  const data = await fetchOrder(orderNumber);
  if (!data) notFound();
  const o = data.order;
  const resiError = searchParams?.e === "resi";
  const waNumber = (o.phone || "").replace(/[^0-9]/g, "").replace(/^0/, "62");

  return (
    <div className="wrap adm">
      <p className="eyebrow"><Link href="/admin/orders">← Semua order</Link></p>
      <h1>{o.order_number}</h1>

      <div className="adm__detailgrid">
        <section className="adm__card">
          <h3>Item</h3>
          {data.items.map((it, i) => (
            <div className="adm__row" key={i}><span>{it.product_name} × {it.qty}</span><span>{rupiah(it.line_total)}</span></div>
          ))}
          <div className="adm__totals">
            <div><span>Subtotal</span><span>{rupiah(o.subtotal)}</span></div>
            {o.discount > 0 && <div><span>Diskon {o.promo_code ? `(${o.promo_code})` : ""}</span><span>-{rupiah(o.discount)}</span></div>}
            <div><span>Ongkir {o.shipping_etd ? `(JNE, est. ${o.shipping_etd} hari)` : ""}</span><span>{o.shipping === 0 ? "Gratis" : rupiah(o.shipping)}</span></div>
            <div className="grand"><span>Total</span><span>{rupiah(o.total)}</span></div>
          </div>
        </section>

        <section className="adm__card">
          <h3>Customer & pengiriman</h3>
          <div className="adm__kv"><span>Nama</span><span>{o.name}</span></div>
          <div className="adm__kv"><span>HP/WA</span><span>{o.phone} {waNumber && <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer">(chat)</a>}</span></div>
          <div className="adm__kv"><span>Email</span><span>{o.email || "-"}</span></div>
          <div className="adm__kv"><span>Alamat</span><span>{o.shipping_address}</span></div>
          <div className="adm__kv"><span>Tujuan</span><span>{o.shipping_city || "-"}</span></div>
          <div className="adm__kv"><span>Catatan</span><span>{o.note || "-"}</span></div>
        </section>

        <section className="adm__card">
          <h3>Pembayaran</h3>
          <div className="adm__kv"><span>Status</span><span>{o.payment_status}</span></div>
          <div className="adm__kv"><span>Metode</span><span>{o.payment_method}</span></div>
          <div className="adm__kv"><span>Midtrans ID</span><span>{o.midtrans_transaction_id || "-"}</span></div>
          <div className="adm__kv"><span>Dibayar</span><span>{fmt(o.paid_at)}</span></div>
          <div className="adm__kv"><span>Order dibuat</span><span>{fmt(o.created_at)}</span></div>
        </section>

        <section className="adm__card">
          <h3>Aksi</h3>
          <div className="adm__kv"><span>Status order</span><span><b>{o.status}</b></span></div>
          <div className="adm__kv"><span>Resi</span><span>{o.tracking_number || "-"}</span></div>
          <div className="adm__kv"><span>Dikirim</span><span>{fmt(o.shipped_at)}</span></div>

          {o.payment_status === "paid" && (o.status === "paid" || o.status === "pending") && (
            <form action={markShipped} className="adm__action">
              <input type="hidden" name="orderNumber" value={o.order_number} />
              <input name="resi" placeholder="Nomor resi JNE" defaultValue={o.tracking_number || ""} />
              {resiError && <p className="adm__err">Nomor resi wajib diisi.</p>}
              <button className="btn btn--solid" type="submit">Tandai dikirim</button>
            </form>
          )}
          {o.status === "shipped" && (
            <form action={markCompleted} className="adm__action">
              <input type="hidden" name="orderNumber" value={o.order_number} />
              <button className="btn btn--solid" type="submit">Tandai selesai</button>
            </form>
          )}
          {(o.status === "pending" || o.status === "paid") && (
            <form action={cancelOrder} className="adm__action">
              <input type="hidden" name="orderNumber" value={o.order_number} />
              <button className="btn btn--ghost" type="submit">Batalkan order</button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
