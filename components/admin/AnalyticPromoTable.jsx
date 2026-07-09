"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { rupiah } from "@/lib/products";

const STATUS_LABEL = {
  pending: "Baru", paid: "Siap kirim", shipped: "Dikirim",
  completed: "Selesai", cancelled: "Dibatalkan",
};
const PAY_LABEL = {
  paid: "Lunas", pending: "Menunggu", unpaid: "Belum bayar",
  expired: "Kedaluwarsa", failed: "Gagal", refunded: "Refund",
};

function fmt(d) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", timeZone: "Asia/Jakarta" });
}
function typeLabel(p) {
  if (p.deleted) return "Dihapus";
  if (p.type === "freeship") return "Gratis ongkir";
  if (p.type === "percent") return `${p.value}%`;
  if (p.type === "fixed") return rupiah(p.value);
  return "-";
}

export default function AnalyticPromoTable({ items }) {
  const [selected, setSelected] = useState(null); // code
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const p = selected ? items.find((x) => x.code === selected) : null;

  function open(code) { setSelected(code); }
  function close() { setSelected(null); }

  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const drawer = p && (
    <div className="odrawer" role="dialog" aria-modal="true" aria-label="Analitik promo">
      <div className="odrawer__overlay" onClick={close} />
      <aside className="odrawer__panel">
        <button className="odrawer__close" type="button" onClick={close} aria-label="Tutup">×</button>

        <p className="eyebrow">Analitik promo</p>
        <h2>{p.code}</h2>

        <section className="adm__card">
          <h3>Promo</h3>
          <div className="adm__kv"><span>Tipe</span><span>{typeLabel(p)}</span></div>
          {!p.deleted && (
            <>
              <div className="adm__kv"><span>Status</span><span>{p.active ? "Aktif" : "Nonaktif"}</span></div>
              <div className="adm__kv"><span>Batas pakai</span><span>{p.usage_limit != null ? p.usage_limit : "Tak terbatas"}</span></div>
            </>
          )}
          {p.deleted && <div className="adm__kv"><span>Catatan</span><span>Kode ini udah dihapus dari daftar promo, tapi pernah dipakai order.</span></div>}
        </section>

        <section className="adm__card">
          <h3>Performa</h3>
          <div className="adm__kv"><span>Dipakai (semua order)</span><span>{p.orders_all}</span></div>
          <div className="adm__kv"><span>Order lunas</span><span>{p.orders_paid}</span></div>
          <div className="adm__kv"><span>Total diskon dikasih</span><span>{rupiah(p.discount_paid)}</span></div>
          <div className="adm__kv"><span>Revenue dari promo (lunas)</span><span>{rupiah(p.revenue_paid)}</span></div>
        </section>

        <section className="adm__card">
          <h3>Order yang pakai</h3>
          {p.orders.length === 0 && <div className="adm__row"><span>Belum ada order.</span></div>}
          {p.orders.map((o, i) => (
            <div className="adm__row" key={i}>
              <span><Link href={`/admin/orders/${encodeURIComponent(o.order_number)}`}>{o.order_number}</Link> · {fmt(o.created_at)}</span>
              <span>-{rupiah(o.discount)} · {PAY_LABEL[o.payment_status] || o.payment_status}</span>
            </div>
          ))}
        </section>
      </aside>
    </div>
  );

  return (
    <>
      <div className="adm__tablewrap">
        <table className="adm__table adm__table--clickable">
          <thead>
            <tr>
              <th>Kode</th><th>Tipe</th><th>Dipakai</th><th>Lunas</th><th>Diskon</th><th>Revenue</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={7} className="adm__empty">Belum ada promo.</td></tr>
            )}
            {items.map((p) => (
              <tr key={p.code} onClick={() => open(p.code)}>
                <td><b>{p.code}</b></td>
                <td>{typeLabel(p)}</td>
                <td>{p.orders_all}</td>
                <td>{p.orders_paid}</td>
                <td>{rupiah(p.discount_paid)}</td>
                <td>{rupiah(p.revenue_paid)}</td>
                <td>
                  <span className={`paybadge paybadge--${p.deleted ? "failed" : p.active ? "paid" : "pending"}`}>
                    {p.deleted ? "Dihapus" : p.active ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mounted && drawer ? createPortal(drawer, document.body) : null}
    </>
  );
}
