import "server-only";

// Komship (Komerce Shipping Delivery API): bikin pengiriman, pickup, label, tracking.
// Docs: https://rajaongkir.com/docs/delivery-order-api/
// Sandbox/prod ikut flag yang sama dengan pembayaran (KOMERCE_IS_PRODUCTION).

export function isProduction() {
  return process.env.KOMERCE_IS_PRODUCTION === "true";
}

function baseUrl() {
  return isProduction()
    ? "https://api.collaborator.komerce.id"
    : "https://api-sandbox.collaborator.komerce.id";
}

function apiKey() {
  const k = process.env.KOMERCE_DELIVERY_API_KEY || process.env.KOMERCE_PAYMENT_API_KEY;
  if (!k) throw new Error("KOMERCE_DELIVERY_API_KEY belum di-set.");
  return k;
}

// Data pengirim (gudang Jatiwaringin). Nomor HP wajib di-set di env sebelum dipakai
// di production, sisanya punya default yang masuk akal.
export function shipperConfig() {
  return {
    originId: parseInt(process.env.KOMSHIP_ORIGIN_ID || "6564", 10), // JATIWARINGIN, PONDOK GEDE, BEKASI
    brandName: process.env.KOMSHIP_BRAND_NAME || "DOMANIC",
    name: process.env.KOMSHIP_SHIPPER_NAME || "Domanic Scent",
    phone: process.env.KOMSHIP_SHIPPER_PHONE || "",
    email: process.env.KOMSHIP_SHIPPER_EMAIL || "ardi.kemara1@gmail.com",
    address: process.env.KOMSHIP_SHIPPER_ADDRESS || "Jatiwaringin, Pondok Gede, Kota Bekasi",
  };
}

async function komshipFetch(path, { method = "GET", body } = {}) {
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

// Hitung tarif reguler origin gudang -> destination. Return list opsi mentah.
export async function calculateTariff(destinationId, weightGrams, itemValue) {
  const { originId } = shipperConfig();
  const weightKg = Math.max(0.1, (parseInt(weightGrams, 10) || 500) / 1000);
  const qs = new URLSearchParams({
    shipper_destination_id: String(originId),
    receiver_destination_id: String(destinationId),
    weight: String(weightKg),
    item_value: String(Math.round(itemValue || 0)),
    cod: "no",
  });
  const { res, data } = await komshipFetch(`/tariff/api/v1/calculate?${qs}`);
  if (!res.ok) throw new Error(`Komship calculate error: ${data?.meta?.message || res.statusText}`);
  return Array.isArray(data?.data?.calculate_reguler) ? data.data.calculate_reguler : [];
}

// Pilih layanan JNE reguler dari hasil calculate (fase 1 tetap JNE, konsisten
// dengan ongkir yang dibayar customer). Fallback null kalau JNE nggak tersedia.
export function pickJne(options) {
  const jne = (options || []).filter((o) => String(o.shipping_name).toUpperCase() === "JNE");
  if (jne.length === 0) return null;
  return jne.sort((a, b) => (a.shipping_cost_net ?? a.shipping_cost) - (b.shipping_cost_net ?? b.shipping_cost))[0];
}

// Bikin delivery order di Komship. Return { orderNo }.
// Ongkir (net setelah cashback) otomatis dipotong dari saldo dashboard Komerce.
export async function storeOrder({ order, items, tariff }) {
  const s = shipperConfig();
  if (!s.phone) {
    throw new Error("KOMSHIP_SHIPPER_PHONE belum di-set di env (nomor HP pengirim wajib).");
  }
  const details = items.map((it) => ({
    product_name: String(it.product_name).slice(0, 100),
    product_variant_name: "50ml",
    product_price: it.unit_price,
    product_weight: 500, // gram per botol termasuk packaging
    product_width: 8,
    product_height: 15,
    product_length: 8,
    qty: it.qty,
    subtotal: it.line_total,
  }));

  const body = {
    order_date: new Date().toISOString().slice(0, 10),
    brand_name: s.brandName,
    shipper_name: s.name,
    shipper_phone: s.phone,
    shipper_destination_id: s.originId,
    shipper_address: s.address,
    shipper_email: s.email,
    receiver_name: order.name,
    receiver_phone: String(order.phone || "").replace(/^\+62/, "62").replace(/[^\d]/g, ""),
    receiver_destination_id: order.shipping_destination_id,
    receiver_address: String(order.shipping_address || "").slice(0, 200),
    shipping: "JNE",
    shipping_type: tariff.service_name,
    payment_method: "BANK TRANSFER",
    shipping_cost: tariff.shipping_cost,
    shipping_cashback: tariff.shipping_cashback || 0,
    service_fee: 0,
    additional_cost: 0,
    // Komship validasi ketat: grand_total = total item + shipping_cost versi mereka
    // (bukan total order kita, yang ongkirnya bisa beda tipis dari tarif Komship).
    grand_total: details.reduce((s, d) => s + d.subtotal, 0) + tariff.shipping_cost,
    cod_value: 0,
    insurance_value: 0,
    order_details: details,
  };

  const { res, data } = await komshipFetch("/order/api/v1/orders/store", { method: "POST", body });
  const d = data?.data;
  if (!res.ok || !d?.order_no) {
    throw new Error(`Komship store error: ${data?.meta?.message || res.statusText}`);
  }
  return { orderNo: d.order_no };
}

// Jadwalkan pickup. Return { awb, status } untuk order tsb.
export async function requestPickup(orderNo, pickupDate, pickupTime, vehicle = "Motor") {
  const { res, data } = await komshipFetch("/order/api/v1/pickup/request", {
    method: "POST",
    body: {
      pickup_date: pickupDate,
      pickup_time: pickupTime,
      pickup_vehicle: ["Motor", "Mobil", "Truk"].includes(vehicle) ? vehicle : "Motor",
      orders: [{ order_no: orderNo }],
    },
  });
  if (!res.ok) throw new Error(`Komship pickup error: ${data?.meta?.message || res.statusText}`);
  const item = Array.isArray(data?.data) ? data.data.find((x) => x.order_no === orderNo) || data.data[0] : null;
  if (!item || item.status !== "success") {
    throw new Error("Pickup ditolak Komship. Cek jam pickup (minimal 90 menit dari sekarang) dan saldo Komerce.");
  }
  return { awb: item.awb || "", status: item.status };
}

// Ambil label PDF (base64). page_4 = A4 isi 4 label (printer biasa).
export async function printLabel(orderNo, page = "page_4") {
  const qs = new URLSearchParams({ page, order_no: orderNo });
  const { res, data } = await komshipFetch(`/order/api/v1/orders/print-label?${qs}`, { method: "POST" });
  const d = data?.data;
  if (!res.ok || typeof d !== "object" || !d) {
    throw new Error(`Komship label error: ${data?.meta?.message || data?.data || res.statusText}`);
  }
  return { base64: d.base_64 || "", path: d.path || "" };
}

// Detail delivery order (buat refresh AWB/status manual).
export async function getDetail(orderNo) {
  const qs = new URLSearchParams({ order_no: orderNo });
  const { res, data } = await komshipFetch(`/order/api/v1/orders/detail?${qs}`);
  const d = data?.data;
  if (!res.ok || !d) throw new Error("Gagal ambil detail Komship.");
  return { awb: d.awb || "", status: d.order_status || "", raw: d };
}

// Map status Komship ke status order internal. Return null = jangan ubah status.
export function mapKomshipStatus(s) {
  const v = String(s || "").toLowerCase();
  if (v.includes("selesai") || v.includes("diterima")) return "completed";
  if (v.includes("kirim") || v.includes("jemput") || v.includes("transit") || v.includes("pickup")) return "shipped";
  return null;
}
