"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { startKomercePayment, getOrderPaymentStatus } from "@/app/checkout/actions";
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
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  // Ruang tunggu: halaman bayar Komerce dibuka di tab baru, halaman ini mantau
  // status dan otomatis lanjut ke thank-you begitu pembayaran terdeteksi.
  const [waiting, setWaiting] = useState(null); // { paymentUrl, isQris }
  const pollRef = useRef(null);
  const payTabRef = useRef(null);

  const list = Array.isArray(methods) ? methods : [];
  const banks = list.filter((m) => m.payment_type === "va");
  const qris = list.find((m) => m.payment_type === "qris");

  useEffect(() => {
    if (!waiting) return;
    let alive = true;
    async function poll() {
      const res = await getOrderPaymentStatus(orderNumber);
      if (!alive) return;
      if (res.ok && res.paymentStatus === "paid") {
        // Tutup tab halaman bayar Komerce (kalau masih kebuka) supaya customer
        // otomatis balik ke tab ini, yang langsung pindah ke thank-you.
        try {
          payTabRef.current?.close();
        } catch {}
        router.push(`/thank-you?order=${encodeURIComponent(orderNumber)}`);
      }
    }
    poll();
    pollRef.current = setInterval(poll, 4000);
    return () => {
      alive = false;
      clearInterval(pollRef.current);
    };
  }, [waiting, orderNumber, router]);

  async function choose(method) {
    if (busy) return;
    setErr("");
    const isQris = method.payment_type === "qris";
    const key = isQris ? "qris" : method.bank_code;
    setBusy(key);

    // Buka tab kosong SEKARANG (masih dalam gestur klik, lolos popup blocker),
    // URL-nya diisi begitu transaksi kebuat. Kalau ke-blok, ada tombol fallback.
    let payTab = null;
    try {
      payTab = window.open("", "_blank");
    } catch {}

    const res = await startKomercePayment(
      orderNumber,
      isQris ? "" : method.bank_code,
      isQris ? "qris" : "bank_transfer"
    );
    setBusy("");
    if (!res.ok || !res.paymentUrl) {
      if (payTab) payTab.close();
      setErr(res.error || "Gagal menyiapkan pembayaran, coba lagi.");
      return;
    }
    if (payTab) {
      try {
        payTab.location.href = res.paymentUrl;
      } catch {}
    }
    payTabRef.current = payTab;
    setWaiting({ paymentUrl: res.paymentUrl, isQris });
  }

  function disabledReason(m) {
    if (total < (m.min_amount || 0)) return true;
    if (m.max_amount && total > m.max_amount) return true;
    return false;
  }

  if (waiting) {
    return (
      <div className="paypick paypick--waiting">
        <div className="paypick__wait">
          <span className="paypick__spinner" aria-hidden="true" />
          <h3 className="paypick__waittitle">Menunggu pembayaranmu...</h3>
          <p className="paypick__waittext">
            Selesaikan pembayaran di tab yang barusan kebuka. Begitu pembayaranmu masuk,
            halaman ini <b>otomatis lanjut sendiri</b>, nggak perlu di-refresh.
          </p>
          <a
            className="btn btn--solid paypick__waitbtn"
            href={waiting.paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Buka halaman pembayaran
          </a>
          <p className="paypick__waithint">
            {waiting.isQris
              ? "QRIS berlaku 5 menit. Kalau keburu kedaluwarsa, tutup dan pilih metode lagi."
              : "Transfer VA berlaku 24 jam. Mau bayar nanti? Aman, konfirmasi otomatis dikirim ke email begitu pembayaran masuk."}
          </p>
          <button className="paypick__waitback" type="button" onClick={() => setWaiting(null)}>
            Pilih metode lain
          </button>
        </div>
      </div>
    );
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
        Total tagihan <b>{rupiah(total)}</b>. Setelah pilih metode, halaman bayar aman Komerce
        kebuka di tab baru. Catatan: kalau bayar pakai QRIS, nama merchant yang muncul di
        aplikasimu adalah <b>Komerce</b>, partner pembayaran resmi Domanic. Itu normal dan
        pembayaranmu tetap tercatat otomatis.
      </p>
    </div>
  );
}
