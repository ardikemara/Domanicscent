"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { rupiah } from "@/lib/products";
import { setAffiliateStatus } from "@/app/admin/actions";

const STATUS_LABEL = {
  pending: "Menunggu review",
  approved: "Aktif",
  rejected: "Ditolak",
  suspended: "Ditangguhkan",
};

function maskAccount(acc) {
  const s = String(acc || "");
  if (s.length <= 4) return s;
  return "****" + s.slice(-4);
}

function fmt(d) {
  if (!d) return "-";
  return new Date(d).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" });
}

export default function AffiliatesTable({ affiliates }) {
  const [rows, setRows] = useState(affiliates);
  const [selected, setSelected] = useState(null); // id
  const [showBank, setShowBank] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const a = selected ? rows.find((r) => r.id === selected) : null;
  const waNumber = a ? (a.phone || "").replace(/[^0-9]/g, "").replace(/^0/, "62") : "";

  function open(id) {
    setSelected(id);
    setShowBank(false);
    setErr("");
  }
  function close() {
    setSelected(null);
    setErr("");
  }

  async function setStatus(id, status) {
    setBusy(true);
    setErr("");
    const res = await setAffiliateStatus(id, status);
    setBusy(false);
    if (!res?.ok) { setErr(res?.error || "Gagal."); return; }
    if (res.affiliate) {
      setRows((prev) => prev.map((r) => (r.id === res.affiliate.id ? res.affiliate : r)));
    }
  }

  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const drawer = a && (
    <div className="odrawer" role="dialog" aria-modal="true" aria-label="Detail affiliate">
      <div className="odrawer__overlay" onClick={close} />
      <aside className="odrawer__panel">
        <button className="odrawer__close" type="button" onClick={close} aria-label="Tutup">×</button>

        <p className="eyebrow">Detail affiliate</p>
        <h2>{a.name}</h2>

        <section className="adm__card">
          <h3>Profil</h3>
          <div className="adm__kv"><span>Status</span><span><b>{STATUS_LABEL[a.status] || a.status}</b></span></div>
          <div className="adm__kv"><span>Link</span><span>domanicscent.com/r/{a.slug}</span></div>
          <div className="adm__kv"><span>Email</span><span>{a.email}</span></div>
          <div className="adm__kv"><span>HP/WA</span><span>{a.phone} {waNumber && <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer">(chat)</a>}</span></div>
          <div className="adm__kv"><span>Sosmed</span><span>{a.social_url ? <a href={a.social_url.startsWith("http") ? a.social_url : `https://${a.social_url}`} target="_blank" rel="noopener noreferrer">{a.social_url}</a> : "-"}</span></div>
          <div className="adm__kv"><span>Daftar</span><span>{fmt(a.created_at)}</span></div>
          <div className="adm__kv"><span>Di-approve</span><span>{fmt(a.approved_at)}</span></div>
        </section>

        <section className="adm__card">
          <h3>Rekening</h3>
          <div className="adm__kv"><span>Bank</span><span>{a.bank_name || "-"}</span></div>
          <div className="adm__kv"><span>No. rekening</span><span>{showBank ? (a.bank_account || "-") : maskAccount(a.bank_account)} <button className="adm__linkbtn" type="button" onClick={() => setShowBank(!showBank)}>{showBank ? "sembunyikan" : "lihat"}</button></span></div>
          <div className="adm__kv"><span>Atas nama</span><span>{a.bank_holder || "-"}</span></div>
        </section>

        <section className="adm__card">
          <h3>Performa</h3>
          <div className="adm__kv"><span>Klik masuk</span><span>{a.clicks}</span></div>
          <div className="adm__kv"><span>Order lunas</span><span>{a.orders_paid}</span></div>
          <div className="adm__kv"><span>Total penjualan</span><span>{rupiah(a.sales_total)}</span></div>
          <div className="adm__kv"><span>Total komisi</span><span>{rupiah(a.commission_total)}</span></div>
        </section>

        <section className="adm__card">
          <h3>Aksi</h3>
          {err && <p className="adm__err">{err}</p>}
          <div className="adm__action">
            {a.status === "pending" && (
              <>
                <button className="btn btn--solid" type="button" disabled={busy}
                  onClick={() => setStatus(a.id, "approved")}>
                  {busy ? "Menyimpan…" : "Approve (aktifkan link + kirim email)"}
                </button>
                <button className="btn btn--ghost" type="button" disabled={busy}
                  onClick={() => setStatus(a.id, "rejected")}>
                  Tolak
                </button>
              </>
            )}
            {a.status === "approved" && (
              <button className="btn btn--ghost" type="button" disabled={busy}
                onClick={() => setStatus(a.id, "suspended")}>
                {busy ? "Menyimpan…" : "Tangguhkan (nonaktifkan link)"}
              </button>
            )}
            {(a.status === "suspended" || a.status === "rejected") && (
              <button className="btn btn--solid" type="button" disabled={busy}
                onClick={() => setStatus(a.id, "approved")}>
                {busy ? "Menyimpan…" : "Aktifkan lagi"}
              </button>
            )}
          </div>
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
              <th>Nama</th><th>Link</th><th>Status</th><th>Klik</th><th>Order</th><th>Penjualan</th><th>Komisi</th><th>Daftar</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={8} className="adm__empty">Belum ada pendaftar affiliate.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} onClick={() => open(r.id)}>
                <td><b>{r.name}</b></td>
                <td>/r/{r.slug}</td>
                <td><span className={`paybadge paybadge--${r.status === "approved" ? "paid" : r.status === "pending" ? "pending" : "failed"}`}>{STATUS_LABEL[r.status] || r.status}</span></td>
                <td>{r.clicks}</td>
                <td>{r.orders_paid}</td>
                <td>{rupiah(r.sales_total)}</td>
                <td>{rupiah(r.commission_total)}</td>
                <td>{new Date(r.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", timeZone: "Asia/Jakarta" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mounted && drawer ? createPortal(drawer, document.body) : null}
    </>
  );
}
