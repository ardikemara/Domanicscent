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

const thumb = { width: 38, height: 48, objectFit: "cover", borderRadius: 4, background: "var(--cream)" };
const thumbBig = { width: 84, height: 108, objectFit: "cover", borderRadius: 6, background: "var(--cream)" };

export default function ParfumTable({ items }) {
  const [selected, setSelected] = useState(null); // slug
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const p = selected ? items.find((x) => x.slug === selected) : null;

  function open(slug) { setSelected(slug); }
  function close() { setSelected(null); }

  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const drawer = p && (
    <div className="odrawer" role="dialog" aria-modal="true" aria-label="Detail parfum">
      <div className="odrawer__overlay" onClick={close} />
      <aside className="odrawer__panel">
        <button className="odrawer__close" type="button" onClick={close} aria-label="Tutup">×</button>

        <p className="eyebrow">Detail parfum</p>
        <h2>{p.name}</h2>

        <section className="adm__card">
          <div style={{ display: "flex", gap: 16 }}>
            <img src={p.image} alt={p.name} style={thumbBig} />
            <div style={{ flex: 1 }}>
              <div className="adm__kv"><span>Persona</span><span>{p.persona}</span></div>
              <div className="adm__kv"><span>Karakter</span><span>{p.character || "-"}</span></div>
              <div className="adm__kv"><span>Harga</span><span>{rupiah(p.price)}</span></div>
              <div className="adm__kv"><span>Ukuran</span><span>{p.size} · {p.concentration}</span></div>
              {p.bestWorn && <div className="adm__kv"><span>Best worn</span><span>{p.bestWorn}</span></div>}
            </div>
          </div>
        </section>

        {p.notes && (
          <section className="adm__card">
            <h3>Notes</h3>
            <div className="adm__kv"><span>Top</span><span>{(p.notes.top || []).join(", ") || "-"}</span></div>
            <div className="adm__kv"><span>Mid</span><span>{(p.notes.mid || []).join(", ") || "-"}</span></div>
            <div className="adm__kv"><span>Base</span><span>{(p.notes.base || []).join(", ") || "-"}</span></div>
          </section>
        )}

        <section className="adm__card">
          <h3>Penjualan (lunas)</h3>
          <div className="adm__kv"><span>Terjual</span><span>{p.units} pcs</span></div>
          <div className="adm__kv"><span>Revenue</span><span>{rupiah(p.revenue)}</span></div>
          <div className="adm__kv"><span>Order</span><span>{p.orderCount}</span></div>
        </section>

        <section className="adm__card">
          <h3>Order yang beli</h3>
          {p.orders.length === 0 && <div className="adm__row"><span>Belum ada order.</span></div>}
          {p.orders.map((o, i) => (
            <div className="adm__row" key={i}>
              <span><Link href={`/admin/orders/${encodeURIComponent(o.order_number)}`}>{o.order_number}</Link> · {fmt(o.created_at)} · {o.qty} pcs</span>
              <span>{STATUS_LABEL[o.status] || o.status} · {PAY_LABEL[o.payment_status] || o.payment_status}</span>
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
              <th>Parfum</th><th>Harga</th><th>Terjual</th><th>Revenue</th><th>Order</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.slug} onClick={() => open(row.slug)}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <img src={row.image} alt="" style={thumb} />
                    <div>
                      <b>{row.name}</b>
                      <div style={{ fontSize: ".78rem", color: "var(--taupe)" }}>{row.persona}</div>
                    </div>
                  </div>
                </td>
                <td>{rupiah(row.price)}</td>
                <td>{row.units} pcs</td>
                <td>{rupiah(row.revenue)}</td>
                <td>{row.orderCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mounted && drawer ? createPortal(drawer, document.body) : null}
    </>
  );
}
