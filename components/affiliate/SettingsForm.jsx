"use client";

import { useState } from "react";
import { updateAffiliateProfile } from "@/app/affiliate/actions";

export default function SettingsForm({ initial }) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    setErr("");
    const res = await updateAffiliateProfile(form);
    setBusy(false);
    if (!res.ok) { setErr(res.error || "Gagal menyimpan."); return; }
    setMsg("Tersimpan ✓");
    setTimeout(() => setMsg(""), 2500);
  }

  return (
    <form className="affdash__settings" onSubmit={submit}>
      <div className="field">
        <label>Nomor HP / WhatsApp</label>
        <input value={form.phone} onChange={set("phone")} placeholder="08xxxxxxxxxx" />
      </div>
      <div className="field">
        <label>Nama bank</label>
        <input value={form.bank_name} onChange={set("bank_name")} placeholder="mis. BCA" />
      </div>
      <div className="field">
        <label>Nomor rekening</label>
        <input value={form.bank_account} onChange={set("bank_account")} placeholder="Nomor rekening" />
      </div>
      <div className="field">
        <label>Nama pemilik rekening</label>
        <input value={form.bank_holder} onChange={set("bank_holder")} placeholder="Sesuai buku tabungan" />
      </div>
      {err && <p className="affdaftar__err">{err}</p>}
      <button className="btn btn--solid" type="submit" disabled={busy}>
        {busy ? "Menyimpan..." : msg || "Simpan perubahan"}
      </button>
    </form>
  );
}
