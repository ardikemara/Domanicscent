"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { rupiah } from "@/lib/products";

const STATUS_LABEL = {
  pending: "Baru", paid: "Siap kirim", shipped: "Dikirim",
  completed: "Selesai", cancelled: "Dibatalkan",
};

function fmt(d) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" });
}

export default function CustomersTable({ customers }) {
  const [selected, setSelected] = useState(null); // customer id
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const c = selected ? customers.find((x) => x.id === selected) : null;
  const waNumber = c ? (c.phone || "").replace(/[^0-9]/g, "").replace(/^0/, "62") : "";

  function open(id) { setSelected(id); }
  function close() { setSelected(null); }

  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const drawer = c && (
    <div className="odrawer" role="dialog" aria-modal="true" aria-label="Detail customer">
      <div className="odrawer__overlay" onClick={close} />
      <aside className="odrawer__panel">
        <button className="odrawer__close" type="button" onClick={close} aria-label="Tutup">×</button>

        <p className="eyebrow">Detail customer</p>
        <h2>{c.name}</h2>

        <section className="adm__card">
          <h3>Kontak</h3>
          <div className="adm__kv"><span>HP/WA</span><span>{c.phone} {waNumber && <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer">(chat)</a>}</span></div>
          <div className="adm__kv"><span>Email</span><span>{c.email || "-"}</span></div>
          <div className="adm__kv"><span>Alamat</span><span>{c.address || "-"}</span></div>
          <div className="adm__kv"><span>Kota</span><span>{c.city || "-"}</span></div>
          <div className="adm__kv"><span>Catatan</span><span>{c.notes || "-"}</span></div>
          <div className="adm__kv"><span>Gabung</span><span>{fmt(c.created_at)}</span></div>
        </section>

        <section className="adm__card">
          <h3>Ringkasan</h3>
          <div className="adm__kv"><span>Jumlah order</span><span>{c.order_count}</span></div>
          <div className="adm__kv"><span>Total belanja (lunas)</span><span>{rupiah(c.spent)}</span></div>
        </section>

        <section className="adm__card">
          <h3>Order</h3>
          {c.orders.length === 0 && <div className="adm__row"><span>Belum ada order.</span></div>}
          {c.orders.map((o) => (
            <div className="adm__row" key={o.order_number}>
              <span><Link href={`/admin/orders/${encodeURIComponent(o.order_number)}`}>{o.order_number}</Link> · {fmt(o.created_at)}</span>
              <span>{STATUS_LABEL[o.status] || o.status} · {rupiah(o.total)}</span>
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
              <th>Nama</th><th>HP/WA</th><th>Email</th><th>Kota</th><th>Order</th><th>Belanja</th><th>Gabung</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr><td colSpan={7} className="adm__empty">Nggak ada customer yang cocok.</td></tr>
            )}
            {customers.map((row) => (
              <tr key={row.id} onClick={() => open(row.id)}>
                <td><b>{row.name}</b></td>
                <td>{row.phone || "-"}</td>
                <td>{row.email || "-"}</td>
                <td>{row.city || "-"}</td>
                <td>{row.order_count}</td>
                <td>{rupiah(row.spent)}</td>
                <td>{fmt(row.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mounted && drawer ? createPortal(drawer, document.body) : null}
    </>
  );
}
