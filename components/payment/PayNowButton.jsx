"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSnapToken } from "@/app/checkout/actions";
import { paySnap } from "@/components/payment/snap";

export default function PayNowButton({ orderNumber }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function pay() {
    setErr("");
    setBusy(true);
    const res = await getSnapToken(orderNumber);
    if (!res.ok) {
      setBusy(false);
      setErr(res.error || "Gagal menyiapkan pembayaran.");
      return;
    }
    try {
      await paySnap(res.snapToken, {
        onSuccess: () => router.refresh(),
        onPending: () => router.refresh(),
        onError: () => {
          setErr("Pembayaran gagal. Coba lagi atau pilih metode lain.");
          setBusy(false);
        },
        onClose: () => setBusy(false),
      });
    } catch {
      setErr("Gagal memuat halaman pembayaran, refresh dan coba lagi.");
      setBusy(false);
    }
  }

  return (
    <div className="thanks__paybtn">
      <button className="btn btn--solid" type="button" onClick={pay} disabled={busy}>
        {busy ? "Memuat..." : "Bayar sekarang"}
      </button>
      {err && <p className="thanks__payerr">{err}</p>}
    </div>
  );
}
