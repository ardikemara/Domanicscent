"use client";

import { useState } from "react";
import { requestAffiliateLogin } from "@/app/affiliate/actions";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    const res = await requestAffiliateLogin(email);
    setBusy(false);
    setMessage(res.message || "Cek email kamu ya.");
  }

  if (message) {
    return (
      <div className="affdaftar__done">
        <h3>Cek email kamu 📬</h3>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <form className="affdaftar__form" onSubmit={submit}>
      <div className="field">
        <label>Email terdaftar</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@kamu.com" />
      </div>
      <button className="btn btn--solid" type="submit" disabled={busy || !email.includes("@")}>
        {busy ? "Mengirim..." : "Kirim link masuk"}
      </button>
    </form>
  );
}
