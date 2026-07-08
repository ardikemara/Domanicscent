"use client";

// Loader Snap.js (sekali per halaman) + helper buka popup pembayaran.
// Sandbox/production ditentukan oleh NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION.

const SNAP_ID = "midtrans-snap-script";

export function snapScriptUrl() {
  return process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";
}

export function loadSnap() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("no window"));
    if (window.snap) return resolve(window.snap);
    let el = document.getElementById(SNAP_ID);
    if (!el) {
      el = document.createElement("script");
      el.id = SNAP_ID;
      el.src = snapScriptUrl();
      el.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "");
      document.body.appendChild(el);
    }
    el.addEventListener("load", () => resolve(window.snap));
    el.addEventListener("error", () => reject(new Error("Gagal memuat Midtrans Snap.")));
    // kalau script sudah ke-load sebelum listener terpasang
    if (window.snap) resolve(window.snap);
  });
}

// Buka popup Snap. callbacks: { onSuccess, onPending, onError, onClose }
export async function paySnap(token, callbacks) {
  const snap = await loadSnap();
  snap.pay(token, callbacks || {});
}
