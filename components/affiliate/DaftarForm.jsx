"use client";

import { useState } from "react";
import { registerAffiliate } from "@/app/affiliate/actions";

const EMPTY = {
  name: "", email: "", phone: "", social_url: "", slug: "",
  bank_name: "", bank_account: "", bank_holder: "",
};

export default function DaftarForm() {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [doneSlug, setDoneSlug] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const res = await registerAffiliate(form);
    setBusy(false);
    if (!res.ok) { setErr(res.error || "Gagal daftar."); return; }
    setDoneSlug(res.slug);
  }

  if (doneSlug) {
    return (
      <div className="affdaftar__done">
        <h3>Pendaftaran diterima 🎉</h3>
        <p>
          Makasih udah daftar. Tim kami bakal review akunmu (biasanya 1-2 hari kerja).
          Kalau di-approve, link kamu aktif di <b>domanicscent.com/r/{doneSlug}</b> dan
          kami kabari lewat email.
        </p>
      </div>
    );
  }

  return (
    <form className="affdaftar__form" onSubmit={submit}>
      <div className="field">
        <label>Nama lengkap *</label>
        <input value={form.name} onChange={set("name")} placeholder="Nama kamu" />
      </div>
      <div className="field">
        <label>Email *</label>
        <input type="email" value={form.email} onChange={set("email")} placeholder="email@kamu.com" />
      </div>
      <div className="field">
        <label>Nomor HP / WhatsApp *</label>
        <input value={form.phone} onChange={set("phone")} placeholder="08xxxxxxxxxx" />
      </div>
      <div className="field">
        <label>Akun sosial media *</label>
        <input value={form.social_url} onChange={set("social_url")} placeholder="Link Instagram / TikTok kamu" />
        <p className="field__hint">Buat verifikasi kamu beneran punya audiens, bukan spam.</p>
      </div>
      <div className="field">
        <label>Username link yang diinginkan *</label>
        <input value={form.slug} onChange={set("slug")} placeholder="mis. ardi (jadi domanicscent.com/r/ardi)" />
        <p className="field__hint">3-30 karakter, huruf kecil, angka, atau strip.</p>
      </div>

      <h3 className="affdaftar__subhead">Rekening buat pencairan komisi</h3>
      <div className="field">
        <label>Nama bank *</label>
        <input value={form.bank_name} onChange={set("bank_name")} placeholder="mis. BCA" />
      </div>
      <div className="field">
        <label>Nomor rekening *</label>
        <input value={form.bank_account} onChange={set("bank_account")} placeholder="Nomor rekening" />
      </div>
      <div className="field">
        <label>Nama pemilik rekening *</label>
        <input value={form.bank_holder} onChange={set("bank_holder")} placeholder="Sesuai buku tabungan" />
      </div>

      {err && <p className="affdaftar__err">{err}</p>}
      <button className="btn btn--solid" type="submit" disabled={busy}>
        {busy ? "Mengirim..." : "Daftar jadi affiliate"}
      </button>
      <p className="field__hint">
        Dengan mendaftar, kamu setuju komisi dihitung dari penjualan yang lunas dan bisa
        hangus kalau ordernya dibatalkan/refund.
      </p>
    </form>
  );
}
