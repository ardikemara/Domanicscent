"use client";

import { useState } from "react";
import { subscribeLead } from "@/app/checkout/actions";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState({ done: false, msg: "" });
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    const res = await subscribeLead(email);
    setBusy(false);
    if (res.ok) setState({ done: true, msg: "Makasih! Kamu udah masuk list." });
    else setState({ done: false, msg: res.error || "Gagal subscribe." });
  }

  if (state.done) return <p className="news__done">{state.msg}</p>;

  return (
    <>
      <div className="news__form">
        <input
          type="email"
          placeholder="email@kamu.com"
          aria-label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="button" onClick={submit} disabled={busy}>{busy ? "..." : "Subscribe"}</button>
      </div>
      {state.msg && <p className="news__msg">{state.msg}</p>}
    </>
  );
}
