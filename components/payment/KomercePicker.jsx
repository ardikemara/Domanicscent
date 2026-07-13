"use client";

import { useState } from "react";
import { startKomercePayment } from "@/app/checkout/actions";
import { rupiah } from "@/lib/products";

// Logo metode dengan fallback: kalau file logo dari Komerce 404 (kejadian di
// qris.png), tampilkan nama metodenya sebagai teks.
function MethodLogo({ method }) {
  const [broken, setBroken] = useState(false);
  if (!method.logo_url || broken) {
    return <span className="paypick__name">{method.display_name || "QRIS"}</span>;
  }
  return (
    <img
      src={method.logo_url}
      alt={method.display_name}
      className="paypick__logo"
      loading="lazy"
      onError={() => setBroken(true)}
    />
  );
}

export default function KomercePicker({ orderNumber, methods, total }) {
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");

  const list = Array.isArray(methods) ? methods : [];
  const banks = list.filter((m) => m.payment_type === "va");
  const qris = list.find((m) => m.payment_type === "qris");

  async function choose(method) {
    if (busy) return;
    setErr("");
    const isQris = method.payment_type === "qris";
    const key = isQris ? "qris" : method.bank_code;
    setBusy(key);
    const res = await startKomercePayment(
      orderNumber,
      isQris ? "" : method.bank_code,
      isQris ? "qris" : "bank_transfer"
    );
    if (!res.ok || !res.paymentUrl) {
      setBusy("");
      setErr(res.error || "Gagal menyiapkan pembayaran, coba lagi.");
      return;
    }
    // Redirect ke halaman bayar hosted Komerce (VA number / QRIS + instruksi).
    window.location.assign(res.paymentUrl);
  }

  function disabledReason(m) {
    if (total < (m.min_amount || 0)) return true;
    if (m.max_amount && total > m.max_amount) return true;
    return false;
  }

  if (list.length === 0) {
    return (
      <div className="paypick">
        <p className="pay__err">
          Metode pembayaran lagi nggak bisa dimuat. Refresh halaman ini, atau buka lagi sebentar lagi.
        </p>
      </div>
    );
  }

  return (
    <div className="paypick">
      {err && <p className="pay__err">{err}</p>}

      <div className="paypick__group">
        <h3 className="paypick__title">Transfer Bank (Virtual Account)</h3>
        <div className="paypick__grid">
          {banks.map((m) => {
            const dis = disabledReason(m) || (busy && busy !== m.bank_code);
            const loading = busy === m.bank_code;
            return (
              <button
                key={m.bank_code}
                type="button"
                className="paypick__item"
                disabled={dis || loading}
                onClick={() => choose(m)}
              >
                <MethodLogo method={m} />
                <span className="paypick__go">{loading ? "Menyiapkan..." : "Pilih"}</span>
              </button>
            );
          })}
        </div>
      </div>

      {qris && (
        <div className="paypick__group">
          <h3 className="paypick__title">QRIS (GoPay, OVO, Dana, ShopeePay, m-banking)</h3>
          <div className="paypick__grid">
            <button
              type="button"
              className="paypick__item paypick__item--qris"
              disabled={disabledReason(qris) || (busy && busy !== "qris")}
              onClick={() => choose(qris)}
            >
              <MethodLogo method={qris} />
              <span className="paypick__go">{busy === "qris" ? "Menyiapkan..." : "Pilih"}</span>
            </button>
          </div>
        </div>
      )}

      <p className="paypick__foot">
        Total tagihan <b>{rupiah(total)}</b>. Setelah pilih metode, kamu diarahkan ke halaman bayar
        aman Komerce untuk menyelesaikan pembayaran.
      </p>
    </div>
  );
}
