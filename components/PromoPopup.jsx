"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

// Popup promo di halaman journal. Muncul sekali per pengunjung tiap 7 hari:
// desktop pas exit-intent (kursor keluar ke atas), mobile pakai timer.
const STORAGE_KEY = "dmn_promopop_last";
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 hari
const TIMER_MS = 10000; // fallback 10 detik (satu-satunya trigger di mobile)
const PROMO_CODE = "DOMANIC10";

export default function PromoPopup() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    // Sudah pernah lihat dalam 7 hari terakhir? Jangan ganggu lagi.
    try {
      const last = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
      if (last && Date.now() - last < COOLDOWN_MS) return;
    } catch {}

    function show() {
      if (shownRef.current) return;
      shownRef.current = true;
      try {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch {}
      setOpen(true);
    }

    const timer = setTimeout(show, TIMER_MS);
    // Exit-intent: kursor ninggalin viewport lewat atas (mau nutup tab / pindah).
    function onMouseOut(e) {
      if (!e.relatedTarget && e.clientY <= 0) show();
    }
    document.addEventListener("mouseout", onMouseOut);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="promopop" role="dialog" aria-modal="true" aria-label="Promo Domanic">
      <div className="promopop__backdrop" onClick={() => setOpen(false)} />
      <div className="promopop__card">
        <button className="promopop__close" type="button" aria-label="Tutup" onClick={() => setOpen(false)}>
          ×
        </button>
        <p className="promopop__eyebrow">Sebelum kamu pergi</p>
        <h3 className="promopop__title">10% off buat order pertamamu.</h3>
        <p className="promopop__text">
          Udah nemu parfum yang kerasa kamu? Pakai kode ini pas checkout, berlaku untuk semua extrait.
        </p>
        <button className="promopop__code" type="button" onClick={copyCode}>
          <span>{PROMO_CODE}</span>
          <small>{copied ? "Kesalin ✓" : "Tap buat salin"}</small>
        </button>
        <Link className="btn btn--solid promopop__cta" href="/#collection" onClick={() => setOpen(false)}>
          Lihat collection
        </Link>
        <button className="promopop__later" type="button" onClick={() => setOpen(false)}>
          Nanti aja, lanjut baca
        </button>
      </div>
    </div>,
    document.body
  );
}
