"use client";

// Modul analytics terpusat. SEMUA event GA4 + Meta Pixel lewat sini.
// Jangan pernah panggil gtag() atau fbq() langsung dari komponen: kalau nanti
// pindah GTM atau nambah Conversions API, cukup file ini yang berubah.
// Route /admin/* nggak pernah ngirim event (guard di sini + script tag
// nggak di-load sama sekali di components/Analytics.jsx).

import { products } from "@/lib/products";

const isBrowser = () => typeof window !== "undefined";
const isAdminPage = () => isBrowser() && window.location.pathname.startsWith("/admin");

function gaEvent(name, params) {
  if (!isBrowser() || isAdminPage() || !window.gtag) return;
  window.gtag("event", name, params);
}

function fbEvent(name, params, eventID) {
  if (!isBrowser() || isAdminPage() || !window.fbq) return;
  window.fbq("track", name, params, eventID ? { eventID } : undefined);
}

// Item shape GA4. Selalu currency IDR, harga integer tanpa titik.
// Terima slug (di-resolve dari lib/products) atau object {slug,name,persona,price}.
function resolveProduct(p) {
  if (typeof p === "string") return products.find((x) => x.slug === p) || null;
  return p || null;
}

export function toGA4Item(productOrSlug, qty = 1) {
  const p = resolveProduct(productOrSlug);
  if (!p) return null;
  return {
    item_id: p.slug,
    item_name: p.name,
    item_brand: "Domanic",
    item_category: p.persona || products.find((x) => x.slug === p.slug)?.persona || "",
    item_variant: "50ml",
    price: p.price ?? 329000,
    quantity: qty,
  };
}

// 4.1 Lihat halaman produk.
export function trackViewItem(productOrSlug) {
  const item = toGA4Item(productOrSlug, 1);
  if (!item) return;
  gaEvent("view_item", { currency: "IDR", value: item.price, items: [item] });
  fbEvent("ViewContent", {
    content_ids: [item.item_id],
    content_type: "product",
    content_name: item.item_name,
    value: item.price,
    currency: "IDR",
  });
}

// 4.2 Tambah ke keranjang. Dipanggil setelah state cart ke-update.
export function trackAddToCart(productOrSlug, qty = 1) {
  const item = toGA4Item(productOrSlug, qty);
  if (!item) return;
  const value = item.price * qty;
  gaEvent("add_to_cart", { currency: "IDR", value, items: [item] });
  fbEvent("AddToCart", {
    content_ids: [item.item_id],
    content_type: "product",
    value,
    currency: "IDR",
  });
}

// 4.3 Mulai checkout. value = subtotal produk saja, TANPA ongkir.
// cartItems: [{slug, qty}] dari CartContext.
export function trackBeginCheckout(cartItems) {
  const list = Array.isArray(cartItems) ? cartItems : [];
  const items = list.map((it) => toGA4Item(it.slug, it.qty)).filter(Boolean);
  if (items.length === 0) return;
  const value = items.reduce((s, it) => s + it.price * it.quantity, 0);
  gaEvent("begin_checkout", { currency: "IDR", value, items });
  fbEvent("InitiateCheckout", {
    content_ids: items.map((it) => it.item_id),
    content_type: "product",
    num_items: items.reduce((s, it) => s + it.quantity, 0),
    value,
    currency: "IDR",
  });
}

// 4.4 Lihat daftar produk (homepage collection / persona).
export function trackViewItemList(slugs, listName) {
  const items = (slugs || []).map((s) => toGA4Item(s, 1)).filter(Boolean);
  if (items.length === 0) return;
  gaEvent("view_item_list", { item_list_name: listName, items });
}

// 4.5 Purchase. JANGAN panggil langsung dari thank-you on mount.
// Payload WAJIB dari /api/analytics/purchase-payload (server-authoritative,
// cuma keluar sekali per order). order: {orderNumber, value, shipping, items:[{slug,name,qty,price}]}.
export function trackPurchase(order) {
  if (!order?.orderNumber) return;
  const items = (order.items || []).map((it) => ({
    item_id: it.slug,
    item_name: it.name,
    item_brand: "Domanic",
    item_category: products.find((x) => x.slug === it.slug)?.persona || "",
    item_variant: "50ml",
    price: it.price,
    quantity: it.qty,
  }));
  gaEvent("purchase", {
    transaction_id: order.orderNumber,
    currency: "IDR",
    value: order.value,
    shipping: order.shipping,
    items,
  });
  // eventID = orderNumber: wajib buat dedup pixel vs Conversions API (fase 2).
  fbEvent(
    "Purchase",
    {
      content_ids: items.map((it) => it.item_id),
      content_type: "product",
      value: order.value,
      currency: "IDR",
    },
    order.orderNumber
  );
}
