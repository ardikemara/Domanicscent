import "server-only";
import crypto from "crypto";

// Komerce Payment API (via akun RajaOngkir). Ganti Midtrans.
// Sandbox by default. Set KOMERCE_IS_PRODUCTION="true" hanya setelah siap go-live.
export function isProduction() {
  return process.env.KOMERCE_IS_PRODUCTION === "true";
}

function baseUrl() {
  return isProduction()
    ? "https://api.collaborator.komerce.id/user"
    : "https://api-sandbox.collaborator.komerce.id/user";
}

function apiKey() {
  const k = process.env.KOMERCE_PAYMENT_API_KEY;
  if (!k) {
    throw new Error(
      "KOMERCE_PAYMENT_API_KEY belum di-set. Isi Payment API key Komerce di environment variable."
    );
  }
  return k;
}

// Secret yang kita kirim saat create; dipakai Komerce buat nandatangani callback.
function callbackKey() {
  return process.env.KOMERCE_CALLBACK_API_KEY || "";
}

function siteUrl() {
  return (process.env.SITE_URL || "https://www.domanicscent.com").replace(/\/$/, "");
}

function callbackUrl() {
  return `${siteUrl()}/api/komerce/notification`;
}

async function komerceFetch(path, { method = "GET", body } = {}) {
  const res = await fetch(`${baseUrl()}${path}`, {
    method,
    headers: {
      "x-api-key": apiKey(),
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

// List metode bayar (VA banks + QRIS).
// return [{ payment_type:"va"|"qris", display_name, bank_code, logo_url, min_amount, max_amount }]
export async function getMethods() {
  const { res, data } = await komerceFetch("/api/v1/user/methods");
  if (!res.ok || !Array.isArray(data?.data)) {
    throw new Error("Gagal ambil metode bayar Komerce.");
  }
  return data.data;
}

// Bikin transaksi bayar.
// paymentType: "qris" | "bank_transfer". channelCode wajib untuk bank_transfer (mis. "BCA").
// Amount di-charge apa adanya; items cuma buat tampilan di halaman bayar.
export async function createPayment({
  orderNumber,
  amount,
  paymentType,
  channelCode,
  customer,
  items,
  expirySeconds = 86400,
}) {
  const type = paymentType === "qris" ? "qris" : "bank_transfer";
  const phone = String(customer?.phone || "").replace(/[^\d]/g, "");
  const body = {
    order_id: orderNumber,
    payment_type: type,
    amount,
    customer: {
      name: (customer?.name || "").slice(0, 100),
      email: customer?.email || undefined,
      phone: phone || undefined,
    },
    items: (items || []).map((it) => ({
      name: String(it.name || "Item").slice(0, 100),
      quantity: Math.max(1, parseInt(it.quantity, 10) || 1),
      price: Math.round(it.price || 0),
    })),
    callback_url: callbackUrl(),
    callback_API_KEY: callbackKey(),
  };
  if (type === "bank_transfer") {
    body.channel_code = channelCode;
    body.expiry_duration = Math.max(3600, expirySeconds);
  }

  const { res, data } = await komerceFetch("/api/v1/user/payment/create", {
    method: "POST",
    body,
  });
  const d = data?.data;
  if (!res.ok || !d?.payment_url) {
    throw new Error(`Komerce create error: ${data?.meta?.message || res.statusText}`);
  }
  return {
    paymentId: d.payment_id,
    paymentUrl: d.payment_url,
    vaNumber: d.va_number || "",
    qrString: d.qr_string || "",
    bankCode: d.bank_code || "",
    amount: d.amount,
    status: d.status,
    expiredAt: d.expired_at || null,
  };
}

// Cek status transaksi. payment_id bisa mengandung "/", jadi harus di-encode.
export async function getStatus(paymentId) {
  const enc = encodeURIComponent(paymentId);
  const { res, data } = await komerceFetch(`/api/v1/user/payment/status/${enc}`);
  const d = data?.data;
  if (!res.ok || !d) {
    throw new Error("Gagal cek status Komerce.");
  }
  return {
    status: d.status, // PENDING | PAID | EXPIRED | CANCELED
    orderId: d.order_id || null,
    paymentId: d.payment_id || paymentId,
    paidAt: d.paid_at || null,
    vaNumber: d.va_number || "",
    raw: d,
  };
}

export async function cancelPayment(paymentId, reason = "order dibatalkan") {
  const { res } = await komerceFetch("/api/v1/user/payment/cancel", {
    method: "POST",
    body: { payment_id: paymentId, reason },
  });
  return res.ok;
}

// Map status Komerce ke payment_status internal kita.
export function mapStatus(s) {
  const v = String(s || "").toUpperCase();
  if (v === "PAID") return "paid";
  if (v === "PENDING") return "pending";
  if (v === "EXPIRED") return "expired";
  if (v === "CANCELED" || v === "CANCELLED") return "failed";
  if (v === "REFUND" || v === "REFUNDED") return "refunded";
  return "pending";
}

// Verifikasi signature callback: HMAC-SHA256 atas RAW body, secret = callback key.
// Signature dikirim di header X-Callback-Api-Key. Coba cocokkan hex maupun base64.
export function verifyCallback(rawBody, signatureHeader) {
  const secret = callbackKey();
  if (!secret || !signatureHeader) return false;
  const h = crypto.createHmac("sha256", secret).update(rawBody || "", "utf8").digest();
  const sig = String(signatureHeader).trim();
  return safeEq(sig, h.toString("hex")) || safeEq(sig, h.toString("base64"));
}

function safeEq(a, b) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  try {
    return crypto.timingSafeEqual(ab, bb);
  } catch {
    return false;
  }
}
