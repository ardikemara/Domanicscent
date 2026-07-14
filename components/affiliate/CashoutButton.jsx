"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestPayout } from "@/app/affiliate/actions";

export default function CashoutButton({ eligible }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const enough = eligible >= 250000;

  async function submit() {
    setBusy(true);
    setErr("");
    const res = await requestPayout();
    setBusy(false);
    if (!res.ok) { setErr(res.error || "Gagal mengajukan."); return; }
    setDone(true);
    router.refresh();
  }

  if (done) {
    return (
      <p className="affdash__cashoutok">
        Pengajuan terkirim ✓ Kami proses maksimal 3 hari kerja, konfirmasinya masuk ke email kamu.
      </p>
    );
  }

  return (
    <div className="affdash__cashout">
      <button className="btn btn--solid" type="button" disabled={busy || !enough} onClick={submit}>
        {busy ? "Mengirim..." : "Ajukan pencairan"}
      </button>
      {!enough && (
        <p className="field__hint">Minimal saldo bisa dicairkan Rp 250.000 buat mengajukan.</p>
      )}
      {err && <p className="affdaftar__err">{err}</p>}
    </div>
  );
}
