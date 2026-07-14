"use client";

// Modul analytics terpusat. SEMUA event GA4 + Meta Pixel lewat sini.
// Jangan pernah panggil gtag() atau fbq() langsung dari komponen: kalau nanti
// pindah GTM atau nambah Conversions API, cukup file ini yang berubah.
//
// Guard ganda (dua-duanya harus true baru analytics hidup):
// 1. Build production Vercel (NEXT_PUBLIC_VERCEL_ENV === 'production').
//    Preview deploy dan local dev: script nggak di-load, semua helper no-op.
// 2. Hostname production (www.domanicscent.com / domanicscent.com).
// Plus: route /admin/* nggak pernah ngirim event.

import { products } from "@/lib/products";

const PROD_HOSTS = new Set(["www.domanicscent.com", "domanicscent.com"]);
const BUILD_IS_PROD = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

const isBrowser = () => typeof window !== "undefined";
const isAdminPage = () => isBrowser() && window.location.pathname.startsWith("/admin");

// Guard terpusat: satu-satunya sumber kebenaran boleh/nggaknya analytics jalan.
export function isAnalyticsEnabled() {
  return BUILD_IS_PROD && isBrowser() && PROD_HOSTS.has(window.location.hostname);
}

function gaEvent(name, params) {
  if (!isAnalyticsEnabled() || isAdminPage() || !window.gtag) return;
  window.gtag("event", name, params);
}

function fbEvent(name, params, eventID) {
  if (!isAnalyticsEnabled() || isAdminPage() || !window.fbq) return;
  window.fbq("track", name, params, eventID ? { eventID } : undefined);
}

// ---- Persona (custom dimension GA4, event parameter: `persona`) ----
// Mapping resmi ada di lib/products.js (field persona per produk). Jangan
// duplikasi mapping di komponen.

export function personaFor(slug) {
  return products.find((x) => x.slug === slug)?.persona || null;
}

// Gabungan unik untuk event multi-produk (string tunggal, dipisah koma).
function personaListFor(slugs) {
  const list = [...new Set((slugs || []).map((s) => personaFor(s)).filter(Boolean))];
  return list.length ? list.join(", ") : null;
}

// Persona dari path halaman: /products/[slug] dan /persona/[slug]
// (dua-duanya pakai slug produk). Selain itu null (jangan kirim parameter).
export function personaFromPath(pathname) {
  const m = /^\/(products|persona)\/([a-z0-9-]+)/.exec(pathname || "");
  return m ? personaFor(m[2]) : null;
}

// page_view manual (dipanggil dari components/Analytics.jsx per route change).
// Di PDP dan halaman persona, bawa parameter persona.
export function trackPageView(pathname) {
  const persona = personaFromPath(pathname);
  gaEvent("page_view", {
    page_location: isBrowser() ? window.location.href : undefined,
    page_title: isBrowser() ? document.title : undefined,
    ...(persona ? { persona } : {}),
  });
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
  const persona = p.persona || personaFor(p.slug) || "";
  return {
    item_id: p.slug,
    item_name: p.name,
    item_brand: "Domanic",
    item_category: persona,
    item_variant: "50ml",
    price: p.price ?? 329000,
    quantity: qty,
    ...(persona ? { persona } : {}),
  };
}

// 4.1 Lihat halaman produk.
export function trackViewItem(productOrSlug) {
  const item = toGA4Item(productOrSlug, 1);
  if (!item) return;
  const persona = personaFor(item.item_id);
  gaEvent("view_item", {
    currency: "IDR",
    value: item.price,
    items: [item],
    ...(persona ? { persona } : {}),
  });
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
  const persona = personaFor(item.item_id);
  gaEvent("add_to_cart", {
    currency: "IDR",
    value,
    items: [item],
    ...(persona ? { persona } : {}),
  });
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
  const persona = personaListFor(items.map((it) => it.item_id));
  gaEvent("begin_checkout", {
    currency: "IDR",
    value,
    items,
    ...(persona ? { persona } : {}),
  });
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
  const items = (order.items || []).map((it) => {
    const persona = personaFor(it.slug) || "";
    return {
      item_id: it.slug,
      item_name: it.name,
      item_brand: "Domanic",
      item_category: persona,
      item_variant: "50ml",
      price: it.price,
      quantity: it.qty,
      ...(persona ? { persona } : {}),
    };
  });
  const persona = personaListFor(items.map((it) => it.item_id));
  gaEvent("purchase", {
    transaction_id: order.orderNumber,
    currency: "IDR",
    value: order.value,
    shipping: order.shipping,
    items,
    ...(persona ? { persona } : {}),
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
