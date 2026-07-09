import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";

// Auth admin sederhana: satu password (env ADMIN_PASSWORD), session berupa
// cookie HTTP-only berisi "expiry.signature" yang ditandatangani HMAC.
// Cukup untuk 2 admin (Ardi + Wulan) tanpa sistem akun.

const COOKIE = "domanic_admin";
const SESSION_HOURS = 24 * 7; // 7 hari

function secret() {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) throw new Error("ADMIN_PASSWORD belum di-set di environment.");
  return crypto.createHash("sha256").update(`domanic-admin::${pw}`).digest();
}

function sign(exp) {
  return crypto.createHmac("sha256", secret()).update(String(exp)).digest("hex");
}

export function checkPassword(input) {
  const pw = process.env.ADMIN_PASSWORD || "";
  const a = Buffer.from(String(input || ""));
  const b = Buffer.from(pw);
  if (a.length !== b.length || pw.length === 0) return false;
  return crypto.timingSafeEqual(a, b);
}

export function createSessionCookie() {
  const exp = Date.now() + SESSION_HOURS * 3600 * 1000;
  cookies().set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_HOURS * 3600,
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/admin", maxAge: 0 });
}

export function isAdmin() {
  try {
    const raw = cookies().get(COOKIE)?.value || "";
    const [expStr, sig] = raw.split(".");
    const exp = parseInt(expStr, 10);
    if (!exp || !sig || Date.now() > exp) return false;
    const expected = sign(exp);
    return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(sig, "hex"));
  } catch {
    return false;
  }
}
