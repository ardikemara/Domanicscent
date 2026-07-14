"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { rupiah } from "@/lib/products";
import { markPayoutPaid, rejectPayout } from "@/app/admin/actions";

const STATUS_LABEL = {
  requested: "Menunggu transfer",
  paid: "Sudah dibayar",
  rejected: "Ditolak",
};

function fmt(d) {
  if (!d) return "-";
  return new Date(d).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" });
}

export default function CashoutTable({ payouts }) {
  const [rows, setRows] = useState(payouts);
  const [selected, setSelected] = useState(null); // id
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const p = selected ? rows.find((r) => r.id === selected) : null;
  const waNumber = p ? (p.phone || "").replace(/[^0-9]/g, "").replace(/^0/, "62") : "";

  function open(id) {
    setSelected(id);
    setNote("");
    setErr("");
  }
  function close() {
    setSelected(null);
    setErr("");
  }

  async function run(fn, ...args) {
    setBusy(true);
    setErr("");
    const res = await fn(...args);
    setBusy(false);
    if (!res?.ok) { setErr(res?.error || "Gagal."); return; }
    if (res.payout) {
      setRows((prev) => prev.map((r) => (r.id === res.payout.id ? res.payout : r)));
    }
  }

  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const drawer = p && (
    <div className="odrawer" role="dialog" aria-modal="true" aria-label="Detail pencairan">
      <div className="odrawer__overlay" onClick={close} />
      <aside className="odrawer__panel">
        <button className="odrawer__close" type="button" onClick={close} aria-label="Tutup">×</button>

        <p className="eyebrow">Pengajuan pencairan</p>
        <h2>{rupiah(p.amount)}</h2>

        <section className="adm__card">
          <h3>Affiliate</h3>
          <div className="adm__kv"><span>Nama</span><span>{p.name} (/r/{p.slug})</span></div>
          <div className="adm__kv"><span>Email</span><span>{p.email}</span></div>
          <div className="adm__kv"><span>HP/WA</span><span>{p.phone} {waNumber && <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer">(chat)</a>}</span></div>
        </section>

        <section className="adm__card">
          <h3>Transfer ke</h3>
          <div className="adm__kv"><span>Bank</span><span>{p.bank_name || "-"}</span></div>
          <div className="adm__kv"><span>No. rekening</span><span><b>{p.bank_account || "-"}</b></span></div>
          <div className="adm__kv"><span>Atas nama</span><span>{p.bank_holder || "-"}</span></div>
          <div className="adm__kv"><span>Jumlah</span><span><b>{rupiah(p.amount)}</b></span></div>
        </section>

        <section className="adm__card">
          <h3>Status</h3>
          <div className="adm__kv"><span>Status</span><span><b>{STATUS_LABEL[p.status] || p.status}</b></span></div>
          <div className="adm__kv"><span>Diajukan</span><span>{fmt(p.requested_at)}</span></div>
          <div className="adm__kv"><span>Dibayar</span><span>{fmt(p.paid_at)}</span></div>
          {p.note && <div className="adm__kv"><span>Catatan</span><span>{p.note}</span></div>}

          {err && <p className="adm__err">{err}</p>}

          {p.status === "requested" && (
            <div className="adm__action">
              <button className="btn btn--solid" type="button" disabled={busy}
                onClick={() => run(markPayoutPaid, p.id)}>
                {busy ? "Menyimpan…" : "Tandai sudah ditransfer (kirim email)"}
              </button>
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Alasan penolakan (opsional)" />
              <button className="btn btn--ghost" type="button" disabled={busy}
                onClick={() => run(rejectPayout, p.id, note)}>
                Tolak (komisi balik jadi bisa dicairkan)
              </button>
            </div>
          )}
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
              <th>Affiliate</th><th>Jumlah</th><th>Status</th><th>Diajukan</th><th>Dibayar</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={5} className="adm__empty">Belum ada pengajuan pencairan.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} onClick={() => open(r.id)}>
                <td><b>{r.name}</b> <span className="adm__muted">/r/{r.slug}</span></td>
                <td>{rupiah(r.amount)}</td>
                <td><span className={`paybadge paybadge--${r.status === "paid" ? "paid" : r.status === "requested" ? "pending" : "failed"}`}>{STATUS_LABEL[r.status] || r.status}</span></td>
                <td>{fmt(r.requested_at)}</td>
                <td>{fmt(r.paid_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mounted && drawer ? createPortal(drawer, document.body) : null}
    </>
  );
}
