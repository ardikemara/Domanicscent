import "server-only";
import crypto from "crypto";

// Sandbox by default. Set MIDTRANS_IS_PRODUCTION="true" hanya setelah
// akun Midtrans production approved dan keys diganti.
export function isProduction() {
  return process.env.MIDTRANS_IS_PRODUCTION === "true";
}

function snapBaseUrl() {
  return isProduction()
    ? "https://app.midtrans.com/snap/v1"
    : "https://app.sandbox.midtrans.com/snap/v1";
}

function serverKey() {
  const key = process.env.MIDTRANS_SERVER_KEY;
  if (!key) {
    throw new Error(
      "MIDTRANS_SERVER_KEY belum di-set. Isi server key Midtrans (sandbox: prefix SB-Mid-server-) di environment variable."
    );
  }
  return key;
}

function authHeader() {
  const token = Buffer.from(serverKey() + ":").toString("base64");
  return `Basic ${token}`;
}

// Create a Snap transaction. Returns { token, redirect_url }.
// order: { orderNumber, total, items: [{slug,name,unit,qty}], discount, shipping, customer }
export async function createSnapTransaction(order) {
  const itemDetails = order.items.map((l) => ({
    id: l.slug,
    name: l.name.slice(0, 50),
    price: l.unit,
    quantity: l.qty,
  }));
  if (order.shipping > 0) {
    itemDetails.push({ id: "SHIPPING", name: "Ongkos kirim", price: order.shipping, quantity: 1 });
  }
  if (order.discount > 0) {
    itemDetails.push({ id: "DISCOUNT", name: "Diskon promo", price: -order.discount, quantity: 1 });
  }

  const payload = {
    transaction_details: {
      order_id: order.orderNumber,
      gross_amount: order.total,
    },
    item_details: itemDetails,
    customer_details: {
      first_name: (order.customer?.name || "").slice(0, 50),
      email: order.customer?.email || undefined,
      phone: order.customer?.phone || undefined,
      shipping_address: order.customer?.address
        ? {
            first_name: (order.customer.name || "").slice(0, 50),
            phone: order.customer.phone || undefined,
            address: order.customer.address.slice(0, 200),
            city: order.customer.city || undefined,
            country_code: "IDN",
          }
        : undefined,
    },
    // Expire snap link dalam 24 jam biar order pending nggak nggantung selamanya.
    expiry: { unit: "hours", duration: 24 },
  };

  const res = await fetch(`${snapBaseUrl()}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: authHeader(),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.token) {
    const msg = Array.isArray(data.error_messages) ? data.error_messages.join("; ") : res.statusText;
    throw new Error(`Midtrans Snap error: ${msg}`);
  }
  return { token: data.token, redirect_url: data.redirect_url };
}

// Verify signature_key dari notification webhook Midtrans.
// signature = sha512(order_id + status_code + gross_amount + server_key)
export function verifySignature(notification) {
  const { order_id, status_code, gross_amount, signature_key } = notification || {};
  if (!order_id || !status_code || !gross_amount || !signature_key) return false;
  const raw = `${order_id}${status_code}${gross_amount}${serverKey()}`;
  const expected = crypto.createHash("sha512").update(raw).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature_key, "hex"));
  } catch {
    return false;
  }
}

// Map transaction_status Midtrans ke payment_status internal kita.
export function mapPaymentStatus(n) {
  const ts = n?.transaction_status;
  const fraud = n?.fraud_status;
  if (ts === "capture") return fraud === "accept" ? "paid" : "pending";
  if (ts === "settlement") return "paid";
  if (ts === "pending") return "pending";
  if (ts === "deny" || ts === "cancel") return "failed";
  if (ts === "expire") return "expired";
  if (ts === "refund" || ts === "partial_refund") return "refunded";
  return "pending";
}
