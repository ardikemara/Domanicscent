"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { rupiah } from "@/lib/products";
import {
  getOrderDetail,
  markShippedFromDrawer,
  markCompletedFromDrawer,
  cancelOrderFromDrawer,
} from "@/app/admin/actions";

const PAY_LABEL = {
  paid: "Lunas", pending: "Menunggu", unpaid: "Belum bayar",
  expired: "Kedaluwarsa", failed: "Gagal", refunded: "Refund",
};
const STATUS_LABEL = {
  pending: "Baru", paid: "Siap kirim", shipped: "Dikirim",
  completed: "Selesai", cancelled: "Dibatalkan",
};

function payKind(s) {
  if (s === "paid") return "paid";
  if (s === "pending" || s === "unpaid") return "pending";
  return "failed";
}

function fmt(d) {
  if (!d) return "-";
  return new Date(d).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" });
}

function tgl(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", timeZone: "Asia/Jakarta" });
}

export default function OrdersTable({ orders }) {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resi, setResi] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function open(orderNumber) {
    setSelected(orderNumber);
    setDetail(null);
    setErr("");
    setLoading(true);
    const d = await getOrderDetail(orderNumber);
    setDetail(d);
    setResi(d?.order?.tracking_number || "");
    setLoading(false);
  }

  function close() {
    setSelected(null);
    setDetail(null);
    setErr("");
  }

  async function reload() {
    const d = await getOrderDetail(selected);
    setDetail(d);
    router.refresh(); // segarin tabel di server component
  }

  async function run(fn, ...args) {
    setBusy(true);
    setErr("");
    const res = await fn(...args);
    setBusy(false);
    if (!res?.ok) { setErr(res?.error || "Gagal."); return; }
    await reload();
  }

  // Tutup drawer dengan Escape.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const o = detail?.order;
  const waNumber = o ? (o.phone || "").replace(/[^0-9]/g, "").replace(/^0/, "62") : "";

  return (
    <>
      <div className="adm__tablewrap">
        <table className="adm__table adm__table--clickable">
          <thead>
            <tr>
              <th>Order</th><th>Nama</th><th>Total</th><th>Pembayaran</th><th>Status</th><th>Resi</th><th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={7} className="adm__empty">Nggak ada order yang cocok.</td></tr>
            )}
            {orders.map((row) => (
              <tr key={row.order_number} onClick={() => open(row.order_number)}>
                <td><b>{row.order_number}</b></td>
                <td>{row.name}</td>
                <td>{rupiah(row.total)}</td>
                <td><span className={`paybadge paybadge--${payKind(row.payment_status)}`}>{PAY_LABEL[row.payment_status] || row.payment_status}</span></td>
                <td>{STATUS_LABEL[row.status] || row.status}</td>
                <td>{row.tracking_number || "-"}</td>
                <td>{tgl(row.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="drawer" role="dialog" aria-modal="true" aria-label="Detail order">
          <div className="drawer__overlay" onClick={close} />
          <aside className="drawer__panel">
            <button className="drawer__close" type="button" onClick={close} aria-label="Tutup">×</button>

            {loading && <p className="drawer__loading">Memuat…</p>}
            {!loading && detail?.error && <p className="adm__err">Gagal memuat order.</p>}

            {o && (
              <>
                <p className="eyebrow">Detail order</p>
                <h2>{o.order_number}</h2>

                <section className="adm__card">
                  <h3>Item</h3>
                  {detail.items.map((it, i) => (
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
                  <div className="adm__kv"><span>Metode</span><span>{o.payment_method || "-"}</span></div>
                  <div className="adm__kv"><span>Midtrans ID</span><span>{o.midtrans_transaction_id || "-"}</span></div>
                  <div className="adm__kv"><span>Dibayar</span><span>{fmt(o.paid_at)}</span></div>
                  <div className="adm__kv"><span>Order dibuat</span><span>{fmt(o.created_at)}</span></div>
                </section>

                <section className="adm__card">
                  <h3>Aksi</h3>
                  <div className="adm__kv"><span>Status order</span><span><b>{o.status}</b></span></div>
                  <div className="adm__kv"><span>Resi</span><span>{o.tracking_number || "-"}</span></div>
                  <div className="adm__kv"><span>Dikirim</span><span>{fmt(o.shipped_at)}</span></div>

                  {err && <p className="adm__err">{err}</p>}

                  {o.payment_status === "paid" && (o.status === "paid" || o.status === "pending") && (
                    <div className="adm__action">
                      <input value={resi} onChange={(e) => setResi(e.target.value)} placeholder="Nomor resi JNE" />
                      <button className="btn btn--solid" type="button" disabled={busy}
                        onClick={() => run(markShippedFromDrawer, o.order_number, resi)}>
                        {busy ? "Menyimpan…" : "Tandai dikirim"}
                      </button>
                    </div>
                  )}
                  {o.status === "shipped" && (
                    <div className="adm__action">
                      <button className="btn btn--solid" type="button" disabled={busy}
                        onClick={() => run(markCompletedFromDrawer, o.order_number)}>
                        {busy ? "Menyimpan…" : "Tandai selesai"}
                      </button>
                    </div>
                  )}
                  {(o.status === "pending" || o.status === "paid") && (
                    <div className="adm__action">
                      <button className="btn btn--ghost" type="button" disabled={busy}
                        onClick={() => run(cancelOrderFromDrawer, o.order_number)}>
                        Batalkan order
                      </button>
                    </div>
                  )}
                </section>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
