import "server-only";

// Program affiliate Domanic. Spesifikasi (locked 12 Jul 2026):
// link /r/[slug], komisi 15% dari harga produk setelah diskon (tanpa ongkir),
// masa tahan 7 hari, atribusi last-touch (cookie 30 hari), approval manual.

export const COMMISSION_RATE = 15; // persen
export const HOLD_DAYS = 7;
export const REF_COOKIE = "dmn_ref";
export const REF_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 hari (detik)

// Username link: huruf kecil/angka/strip, 3-30 karakter, nggak boleh nabrak route.
const RESERVED = new Set([
  "admin", "api", "r", "affiliate", "journal", "products", "persona",
  "checkout", "pay", "thank-you", "images", "notes", "_next",
]);

export function validSlug(slug) {
  const s = String(slug || "").trim().toLowerCase();
  if (!/^[a-z0-9-]{3,30}$/.test(s)) return null;
  if (RESERVED.has(s)) return null;
  return s;
}

// Komisi dihitung ulang di server dari data order, jangan pernah dari client.
export function commissionFor(subtotal, discount) {
  const base = Math.max(0, (subtotal || 0) - (discount || 0));
  return { base, amount: Math.round((base * COMMISSION_RATE) / 100) };
}
