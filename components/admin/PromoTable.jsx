"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { rupiah } from "@/lib/products";
import { savePromo, deletePromo } from "@/app/admin/actions";

const EMPTY = {
  code: "", type: "percent", value: "", min_spend: "0",
  active: true, starts_at: "", ends_at: "", usage_limit: "", product_slugs: [],
};

function dateInput(ts) {
  if (!ts) return "";
  try { return new Date(ts).toISOString().slice(0, 10); } catch { return ""; }
}
function fmt(ts) {
  if (!ts) return null;
  return new Date(ts).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" });
}
function discountLabel(p) {
  if (p.type === "freeship") return "Gratis ongkir";
  return p.type === "percent" ? `${p.value}%` : rupiah(p.value);
}
function periodLabel(p) {
  const s = fmt(p.starts_at), e = fmt(p.ends_at);
  if (!s && !e) return "Selalu";
  return `${s || "…"} – ${e || "…"}`;
}

export default function PromoTable({ promos, productList = [] }) {
  const nameBySlug = {};
  productList.forEach((pr) => { nameBySlug[pr.slug] = pr.name; });

  const [rows, setRows] = useState(promos);
  const [mode, setMode] = useState(null); // null | "new" | "edit"
  const [current, setCurrent] = useState(null); // id saat edit
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [confirmDel, setConfirmDel] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }
  function toggleSlug(slug) {
    setForm((f) => {
      const has = f.product_slugs.includes(slug);
      return { ...f, product_slugs: has ? f.product_slugs.filter((s) => s !== slug) : [...f.product_slugs, slug] };
    });
  }

  function openNew() {
    setMode("new"); setCurrent(null); setForm(EMPTY); setErr(""); setConfirmDel(false);
  }
  function openEdit(p) {
    setMode("edit"); setCurrent(p.id); setErr(""); setConfirmDel(false);
    setForm({
      code: p.code, type: p.type, value: String(p.value), min_spend: String(p.min_spend),
      active: p.active, starts_at: dateInput(p.starts_at), ends_at: dateInput(p.ends_at),
      usage_limit: p.usage_limit != null ? String(p.usage_limit) : "",
      product_slugs: Array.isArray(p.product_slugs) ? p.product_slugs : [],
    });
  }
  function close() { setMode(null); setCurrent(null); setErr(""); setConfirmDel(false); }

  async function save() {
    setBusy(true); setErr("");
    const res = await savePromo({
      id: current || undefined,
      code: form.code, type: form.type, value: form.value, min_spend: form.min_spend,
      active: form.active, starts_at: form.starts_at || null, ends_at: form.ends_at || null,
      usage_limit: form.usage_limit || null, product_slugs: form.product_slugs,
    });
    setBusy(false);
    if (!res?.ok) { setErr(res?.error || "Gagal simpan."); return; }
    setRows((prev) => {
      const exists = prev.some((r) => r.id === res.promo.id);
      return exists ? prev.map((r) => (r.id === res.promo.id ? res.promo : r)) : [res.promo, ...prev];
    });
    close();
  }

  async function doDelete() {
    setBusy(true); setErr("");
    const res = await deletePromo(current);
    setBusy(false);
    if (!res?.ok) { setErr(res?.error || "Gagal hapus."); return; }
    setRows((prev) => prev.filter((r) => r.id !== current));
    close();
  }

  useEffect(() => {
    if (!mode) return;
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

  const drawer = mode && (
    <div className="odrawer" role="dialog" aria-modal="true" aria-label="Form promo">
      <div className="odrawer__overlay" onClick={close} />
      <aside className="odrawer__panel">
        <button className="odrawer__close" type="button" onClick={close} aria-label="Tutup">×</button>

        <p className="eyebrow">{mode === "new" ? "Promo baru" : "Edit promo"}</p>
        <h2>{mode === "new" ? "Tambah kode" : form.code || "Promo"}</h2>

        <section className="adm__card">
          <div className="odrawer__field">
            <label>Kode</label>
            <input value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} placeholder="MISAL DOMANIC10" />
          </div>

          <div className="odrawer__field">
            <label>Tipe</label>
            <select value={form.type} onChange={(e) => set("type", e.target.value)}>
              <option value="percent">Persen (%)</option>
              <option value="fixed">Nominal (Rp)</option>
              <option value="freeship">Gratis ongkir</option>
            </select>
          </div>

          {form.type !== "freeship" && (
            <div className="odrawer__field">
              <label>{form.type === "percent" ? "Nilai (%)" : "Nilai (Rp)"}</label>
              <input type="number" min="1" value={form.value} onChange={(e) => set("value", e.target.value)} />
            </div>
          )}

          <div className="odrawer__field">
            <label>Min belanja (Rp, 0 = bebas)</label>
            <input type="number" min="0" value={form.min_spend} onChange={(e) => set("min_spend", e.target.value)} />
          </div>

          {productList.length > 0 && (
            <div className="odrawer__field">
              <label>Berlaku untuk (kosong = semua produk)</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {productList.map((pr) => (
                  <label key={pr.slug} className="odrawer__check">
                    <input type="checkbox" checked={form.product_slugs.includes(pr.slug)} onChange={() => toggleSlug(pr.slug)} />
                    {pr.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="odrawer__row2">
            <div className="odrawer__field">
              <label>Mulai (opsional)</label>
              <input type="date" value={form.starts_at} onChange={(e) => set("starts_at", e.target.value)} />
            </div>
            <div className="odrawer__field">
              <label>Berakhir (opsional)</label>
              <input type="date" value={form.ends_at} onChange={(e) => set("ends_at", e.target.value)} />
            </div>
          </div>

          <div className="odrawer__field">
            <label>Batas pakai (opsional, kosong = tak terbatas)</label>
            <input type="number" min="1" value={form.usage_limit} onChange={(e) => set("usage_limit", e.target.value)} />
          </div>

          <label className="odrawer__check">
            <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} />
            Aktif
          </label>

          {mode === "edit" && (
            <div className="adm__kv"><span>Sudah dipakai</span><span>{rows.find((r) => r.id === current)?.used_count ?? 0}×</span></div>
          )}

          {err && <p className="adm__err">{err}</p>}

          <div className="adm__action">
            <button className="btn btn--solid" type="button" disabled={busy} onClick={save}>
              {busy ? "Menyimpan…" : "Simpan"}
            </button>
          </div>

          {mode === "edit" && (
            <div className="adm__action">
              {!confirmDel ? (
                <button className="btn btn--ghost" type="button" onClick={() => setConfirmDel(true)}>Hapus promo</button>
              ) : (
                <div>
                  <p className="adm__err">Yakin hapus permanen?</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn btn--solid" type="button" disabled={busy} onClick={doDelete}>Ya, hapus</button>
                    <button className="btn btn--ghost" type="button" onClick={() => setConfirmDel(false)}>Batal</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </aside>
    </div>
  );

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button className="btn btn--solid" type="button" onClick={openNew}>+ Tambah promo</button>
      </div>

      <div className="adm__tablewrap">
        <table className="adm__table adm__table--clickable">
          <thead>
            <tr>
              <th>Kode</th><th>Diskon</th><th>Min belanja</th><th>Periode</th><th>Pakai</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={6} className="adm__empty">Belum ada promo. Klik "Tambah promo".</td></tr>
            )}
            {rows.map((p) => (
              <tr key={p.id} onClick={() => openEdit(p)}>
                <td>
                  <b>{p.code}</b>
                  {Array.isArray(p.product_slugs) && p.product_slugs.length > 0 && (
                    <div style={{ fontSize: ".72rem", color: "var(--taupe)" }}>
                      {p.product_slugs.map((s) => nameBySlug[s] || s).join(", ")}
                    </div>
                  )}
                </td>
                <td>{discountLabel(p)}</td>
                <td>{p.min_spend > 0 ? rupiah(p.min_spend) : "-"}</td>
                <td>{periodLabel(p)}</td>
                <td>{p.used_count}{p.usage_limit != null ? ` / ${p.usage_limit}` : ""}</td>
                <td><span className={`paybadge paybadge--${p.active ? "paid" : "failed"}`}>{p.active ? "Aktif" : "Nonaktif"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mounted && drawer ? createPortal(drawer, document.body) : null}
    </>
  );
}
