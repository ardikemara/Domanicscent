import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";

// Auth affiliate: magic link via email (tanpa password).
// Token & session ditandatangani HMAC, pola sama kayak lib/adminAuth.js.
// Secret pakai AFFILIATE_SECRET kalau ada, fallback ADMIN_PASSWORD (selalu ada).

const COOKIE = "domanic_aff";
const SESSION_DAYS = 30;
const LOGIN_TOKEN_MINUTES = 15;

function secret() {
  const base = process.env.AFFILIATE_SECRET || process.env.ADMIN_PASSWORD;
  if (!base) throw new Error("AFFILIATE_SECRET / ADMIN_PASSWORD belum di-set.");
  return crypto.createHash("sha256").update(`domanic-affiliate::${base}`).digest();
}

function sign(payload) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqHex(a, b) {
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

// Token login sekali pakai secara praktis: berlaku 15 menit.
// Bentuk: <affiliateId>.<exp>.<sig>  (uuid nggak mengandung titik, aman displit).
export function createLoginToken(affiliateId) {
  const exp = Date.now() + LOGIN_TOKEN_MINUTES * 60 * 1000;
  const payload = `${affiliateId}.${exp}`;
  return `${payload}.${sign(`login:${payload}`)}`;
}

export function verifyLoginToken(token) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) return null;
  const [id, expStr, sig] = parts;
  const exp = parseInt(expStr, 10);
  if (!id || !exp || Date.now() > exp) return null;
  if (!safeEqHex(sign(`login:${id}.${expStr}`), sig)) return null;
  return id;
}

// Session cookie 30 hari setelah magic link diklik.
export function createAffiliateSession(affiliateId) {
  const exp = Date.now() + SESSION_DAYS * 24 * 3600 * 1000;
  const payload = `${affiliateId}.${exp}`;
  cookies().set(COOKIE, `${payload}.${sign(`session:${payload}`)}`, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/affiliate",
    maxAge: SESSION_DAYS * 24 * 3600,
  });
}

export function clearAffiliateSession() {
  cookies().set(COOKIE, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/affiliate", maxAge: 0 });
}

// Return affiliateId kalau session valid, selain itu null.
export function getAffiliateId() {
  try {
    const raw = cookies().get(COOKIE)?.value || "";
    const parts = raw.split(".");
    if (parts.length !== 3) return null;
    const [id, expStr, sig] = parts;
    const exp = parseInt(expStr, 10);
    if (!id || !exp || Date.now() > exp) return null;
    if (!safeEqHex(sign(`session:${id}.${expStr}`), sig)) return null;
    return id;
  } catch {
    return null;
  }
}
