import "server-only";
import { getSql } from "@/lib/db";

// RajaOngkir (Komerce) API, tier Starter. Kurir: JNE only.
// Origin: gudang Domanic, Jatiwaringin, Pondok Gede, Kota Bekasi (17411).

const BASE = "https://rajaongkir.komerce.id/api/v1";
const COURIER = "jne";
// Cache 24 jam (hardcoded di query).

function apiKey() {
  const key = process.env.RAJAONGKIR_API_KEY;
  if (!key) throw new Error("RAJAONGKIR_API_KEY belum di-set.");
  return key;
}

// Cari tujuan (kecamatan/kelurahan) berdasarkan keyword.
// Return: [{ id, label }] maksimal `limit`.
export async function searchDestination(query, limit = 8) {
  const q = (query || "").trim();
  if (q.length < 3) return [];
  const url = `${BASE}/destination/domestic-destination?search=${encodeURIComponent(q)}&limit=${limit}&offset=0`;
  const res = await fetch(url, { headers: { key: apiKey() }, cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !Array.isArray(data?.data)) return [];
  return data.data.map((d) => ({ id: d.id, label: d.label }));
}

// Origin ID gudang. Prioritas: env RAJAONGKIR_ORIGIN_ID, fallback search sekali lalu di-cache di module.
let _originId = null;
export async function getOriginId() {
  if (process.env.RAJAONGKIR_ORIGIN_ID) return parseInt(process.env.RAJAONGKIR_ORIGIN_ID, 10);
  if (_originId) return _originId;
  const search = process.env.RAJAONGKIR_ORIGIN_SEARCH || "jatiwaringin";
  const results = await searchDestination(search, 5);
  if (results.length === 0) throw new Error("Origin gudang nggak ketemu di RajaOngkir.");
  // Prefer hasil yang menyebut Bekasi
  const bekasi = results.find((r) => (r.label || "").toUpperCase().includes("BEKASI"));
  _originId = (bekasi || results[0]).id;
  return _originId;
}

function cleanEtd(etd) {
  // API kadang balikin "1 day", "1-2 days", "1 HARI", dst. Simpan angkanya saja.
  return String(etd || "").replace(/day(s)?|hari/gi, "").trim();
}

function pickService(list) {
  // Pilih layanan JNE: REG kalau ada, kalau nggak yang termurah.
  const items = (Array.isArray(list) ? list : []).map((it) => ({
    service: it.service || it.code || "JNE",
    cost: typeof it.cost === "number" ? it.cost : Array.isArray(it.cost) ? it.cost[0]?.value : null,
    etd: cleanEtd(it.etd || (Array.isArray(it.cost) ? it.cost[0]?.etd : "")),
  })).filter((it) => typeof it.cost === "number" && it.cost > 0);
  if (items.length === 0) return null;
  const reg = items.find((it) => String(it.service).toUpperCase() === "REG");
  if (reg) return reg;
  return items.sort((a, b) => a.cost - b.cost)[0];
}

// Hitung ongkir JNE origin gudang -> destinationId untuk berat tertentu (gram).
// Pakai cache Supabase (24 jam) biar hemat kuota 100 hit/hari.
// Return { cost, service, etd, cached } atau null kalau gagal.
export async function quoteJne(destinationId, weightGrams) {
  const dest = parseInt(destinationId, 10);
  const weight = Math.max(1, parseInt(weightGrams, 10) || 0);
  if (!dest || !weight) return null;

  const sql = getSql();
  try {
    const cached = await sql`
      select cost, service, etd from domanic.shipping_rate_cache
      where destination_id = ${dest} and weight_grams = ${weight} and courier = ${COURIER}
        and cached_at > now() - interval '24 hours'
      limit 1`;
    if (cached.length > 0) {
      return { cost: cached[0].cost, service: cached[0].service, etd: cached[0].etd, cached: true };
    }
  } catch {}

  let origin;
  try {
    origin = await getOriginId();
  } catch {
    return null;
  }

  const body = new URLSearchParams({
    origin: String(origin),
    destination: String(dest),
    weight: String(weight),
    courier: COURIER,
    price: "lowest",
  });
  const res = await fetch(`${BASE}/calculate/domestic-cost`, {
    method: "POST",
    headers: { key: apiKey(), "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return null;
  const picked = pickService(data?.data);
  if (!picked) return null;

  try {
    const sql2 = getSql();
    await sql2`
      insert into domanic.shipping_rate_cache (destination_id, weight_grams, courier, service, cost, etd)
      values (${dest}, ${weight}, ${COURIER}, ${picked.service}, ${picked.cost}, ${picked.etd})
      on conflict (destination_id, weight_grams, courier)
      do update set service = excluded.service, cost = excluded.cost, etd = excluded.etd, cached_at = now()`;
  } catch {}

  return { cost: picked.cost, service: picked.service, etd: picked.etd, cached: false };
}
