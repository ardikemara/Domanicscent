"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { rupiah } from "@/lib/products";
import { setParfumStock } from "@/app/admin/actions";

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

function stockLabel(stock) {
  if (stock === null) return "belum diatur";
  return `${stock} pcs`;
}

export default function ParfumTable({ items }) {
  const [rows, setRows] = useState(items);
  const [selected, setSelected] = useState(null); // slug
  const [stockInput, setStockInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const p = selected ? rows.find((x) => x.slug === selected) : null;

  function open(slug) {
    const it = rows.find((x) => x.slug === slug);
    setSelected(slug);
    setStockInput(it && it.baseStock !== null ? String(it.baseStock) : "");
    setErr("");
  }
  function close() { setSelected(null); setErr(""); }

  async function saveStock() {
    if (!p) return;
    setBusy(true);
    setErr("");
    const res = await setParfumStock(p.slug, stockInput === "" ? 0 : stockInput);
    setBusy(false);
    if (!res?.ok) { setErr(res?.error || "Gagal simpan."); return; }
    setRows((prev) => prev.map((r) => (
      r.slug === p.slug ? { ...r, baseStock: res.base_stock, stock: res.base_stock - r.units } : r
    )));
  }

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
          <h3>Penjualan</h3>
          <div className="adm__kv"><span>Terjual (lunas)</span><span>{p.units} pcs</span></div>
          <div className="adm__kv"><span>Revenue (lunas)</span><span>{rupiah(p.revenue)}</span></div>
          <div className="adm__kv"><span>Order lunas</span><span>{p.orderCount}</span></div>
          <div className="adm__kv"><span>Pending (belum bayar)</span><span>{p.pendingUnits} pcs · {rupiah(p.pendingRevenue)}</span></div>
        </section>

        <section className="adm__card">
          <h3>Stok</h3>
          <div className="adm__kv"><span>Terjual (lunas)</span><span>{p.units} pcs</span></div>
          <div className="adm__kv"><span>Sisa stok</span><span>{stockLabel(p.stock)}</span></div>
          {err && <p className="adm__err">{err}</p>}
          <div className="adm__action">
            <input type="number" min="0" value={stockInput}
              onChange={(e) => setStockInput(e.target.value)} placeholder="Stok awal (total masuk)" />
            <button className="btn btn--solid" type="button" disabled={busy} onClick={saveStock}>
              {busy ? "Menyimpan…" : "Simpan stok"}
            </button>
          </div>
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
              <th>Parfum</th><th>Terjual</th><th>Pending</th><th>Sisa stok</th><th>Revenue</th><th>Order</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
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
                <td>{row.units} pcs</td>
                <td>{row.pendingUnits} pcs</td>
                <td style={row.stock !== null && row.stock <= 5 ? { color: "#8a4636", fontWeight: 600 } : undefined}>{stockLabel(row.stock)}</td>
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
