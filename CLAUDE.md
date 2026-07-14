# CLAUDE.md — Domanic Scent

Project memory untuk Claude Code. File ini kebaca otomatis tiap sesi. Baca dulu sebelum ngoding.

## Tentang Proyek

Domanic Scent adalah brand extrait de parfum Indonesia (domanicscent.com). Storefront + checkout + admin, satu codebase Next.js. Co-founder: Ardi (visual, deploy, image gen) & Wulan (formulasi). Empat parfum, semua Rp 329.000 / 50ml:

- **Velvet Rum** — The Midnight Intellectual
- **Lily Wood** — The Free-Spirited Explorer
- **Whisper** — The Graceful Muse
- **Oud Majesty** — The Bold Charmer

Tagline: "Wear your identity." USP: Created With Intention, Time-Crafted, Fully Macerated.

## Stack

- **Next.js 14 (App Router, JavaScript, bukan TypeScript)**, deploy di Vercel
- **Database:** Supabase Postgres, schema `domanic` (BUKAN `public`), diakses via `postgres` (porsager/postgres) di `lib/db.js`
- **Pembayaran:** Midtrans Snap embedded (`lib/midtrans.js`, REST langsung tanpa SDK)
- **Ongkir:** RajaOngkir/Komerce, JNE only (`lib/rajaongkir.js`)
- **Styling:** CSS custom di `app/globals.css` (TANPA framework CSS, tanpa Tailwind). Pakai CSS var yang sudah ada.
- Dependencies sengaja minimal: `next`, `react`, `react-dom`, `postgres`. **Jangan tambah dependency baru tanpa alasan kuat.**

## Struktur Penting

```
app/
  page.jsx                     homepage
  layout.jsx                   root layout, Analytics, Header/Footer
  checkout/                    page.jsx (client) + actions.js (server actions)
  pay/[orderNumber]/           halaman pembayaran embedded Snap
  thank-you/                   konfirmasi order
  api/midtrans/notification/   webhook Midtrans (route.js)
  admin/                       dashboard admin (login, orders, actions.js)
  journal/                     artikel SEO
  products/[slug]/, persona/[slug]/
components/
  admin/AdminShell.jsx         sidebar dashboard admin
  admin/OrdersTable.jsx        tabel order + drawer detail (client)
  cart/                        CartContext, CartDrawer, CartButton
  payment/                     snap.js (loader), SnapEmbed.jsx
lib/
  db.js         getSql() — koneksi Supabase, server-only
  products.js   4 produk hardcoded + rupiah() + priceFor()
  midtrans.js   createSnapTransaction, verifySignature, mapPaymentStatus
  rajaongkir.js searchDestination, quoteJne (cache 24 jam)
  adminAuth.js  session cookie admin (HMAC)
  personas.js, journal.js
```

## Aturan Arsitektur (WAJIB)

1. **Semua logika harga, ongkir, promo, pembayaran DIHITUNG ULANG DI SERVER.** Client tidak pernah dipercaya untuk angka. Lihat pola di `app/checkout/actions.js`.
2. **Akses DB server-side only** (server actions / route handlers). Jangan pernah import `lib/db.js` ke komponen client. Semua query pakai schema `domanic`.
3. **Secret cuma di server** via env var. Client cuma boleh pegang yang prefix `NEXT_PUBLIC_`.
4. **Tiap integrasi eksternal wajib punya fallback**: ongkir gagal → flat Rp 25.000; Snap gagal → order tetap tersimpan, bisa bayar ulang; webhook idempotent (status `paid` tidak boleh di-downgrade).
5. **Webhook & aksi sensitif diverifikasi**: Midtrans signature SHA-512; admin action cek `isAdmin()` dulu.

## Env Vars (di Vercel, jangan commit nilainya)

`DOMANIC_DATABASE_URL` (WAJIB transaction pooler IPv4: host `aws-1-ap-southeast-1.pooler.supabase.com`, port `6543`, user `postgres.avqpyvikrtoutejblynu`; koneksi direct `db.xxx.supabase.co:5432` TIDAK jalan di Vercel), `MIDTRANS_SERVER_KEY`, `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`, `MIDTRANS_IS_PRODUCTION`, `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION`, `RAJAONGKIR_API_KEY`, `ADMIN_PASSWORD`. Detail di `.env.example`.

Catatan: key sandbox Midtrans akun baru TIDAK pakai prefix `SB-Mid-`; formatnya sama dengan production. Yang menentukan sandbox/prod adalah flag `*_IS_PRODUCTION`, bukan bentuk key.

## Analytics

- **Semua event GA4 + Meta Pixel lewat `lib/analytics.js`. JANGAN pernah panggil `gtag()` atau `fbq()` langsung dari komponen.** Kalau nanti pindah GTM atau nambah Conversions API, cuma file itu yang berubah.
- Event yang terpasang: `view_item`/`ViewContent` (PDP), `add_to_cart`/`AddToCart`, `begin_checkout`/`InitiateCheckout` (value = subtotal produk TANPA ongkir), `view_item_list` (homepage + persona), `purchase`/`Purchase`.
- **Purchase server-authoritative:** payload WAJIB dari `POST /api/analytics/purchase-payload` yang cek `payment_status = 'paid'` + set `orders.analytics_tracked_at` secara atomic. Jangan pernah fire purchase langsung dari client on-mount.
- Route `/admin/*` TIDAK di-track sama sekali: `components/Analytics.jsx` return null di admin (script nggak di-load) + guard `isAdminPage()` di `lib/analytics.js`.
- Currency selalu `IDR`, harga integer tanpa titik. Meta purchase pakai `eventID` = order number (buat dedup Conversions API fase 2).

## Konvensi Kode & Copy

- **Copy website campuran Indonesia + English (campuran), bukan English murni.** Nada langsung, santai, ringkas.
- **JANGAN pakai em-dash (—) di copy.** Pakai koma, kurung, atau titik.
- Format Rupiah selalu lewat `rupiah()` dari `lib/products.js`.
- CSS: cek namespace class yang sudah ada di `globals.css` sebelum bikin baru. Ikuti pola BEM-ish yang dipakai (`.blok__elemen`).
- Nomor order: `DMN-YYYYMMDD-NNNN` (di-generate DB via sequence, jangan diubah formatnya).

## Aturan Visual / Gambar (kalau relevan)

- Semua imagery HARUS modern Indonesia/Asia (apartemen kontemporer, Japandi, kayu terang). **Estetika Eropa vintage / apothecary antik / parchment / Latin script DILARANG.**
- Botol Domanic asli TIDAK PERNAH di-generate AI ke dalam scene (mengubah label). Untuk scene foto pakai product asset Magnific; untuk background polos pakai composite PIL.
- Toile/line-art wajib ada figur persona + lokasi Indonesia (Borobudur/Velvet, Labuan Bajo/Lily, Ubud/Whisper, Jakarta/Oud). Figur selalu Indonesia/Asia.
- Generate gambar TIDAK dilakukan di Claude Code. Itu lewat Ardi + Claude (chat) via Magnific. Claude Code cukup wire asset yang sudah ada.

## Workflow

- **Konsep/proposal dulu, approval Ardi, baru eksekusi.** Jangan langsung bikin fitur besar tanpa konfirmasi arah.
- Sebelum bikin class CSS baru: `grep` namespace lama. Setelah rename/refactor: grep nama lama sampai nol.
- Verifikasi `npm run build` lolos sebelum bilang selesai. Jangan klaim beres tanpa bukti build.
- Commit message ringkas dan jelas (misal `feat: admin promo module`, `fix: etd label ongkir`).
- Setelah perubahan berarti, catat ke Notion Build Changelog (ini biasanya dikerjakan Claude di chat, bukan Claude Code, tapi sebutkan di commit apa yang berubah).

## Pembagian Peran

- **Claude Code (di sini):** edit file, refactor, fitur, fix, commit, push. Eksekusi coding.
- **Claude di chat (claude.ai / Desktop):** generate/tarik gambar Magnific, migration Supabase, update Notion, riset, nulis prompt gambar, mikir konsep.

Kalau butuh migration DB (schema `domanic`), tulis SQL-nya di sini tapi ingatkan Ardi bahwa apply-nya lewat Claude chat (punya akses Supabase MCP) atau manual di Supabase SQL editor.

## Yang JANGAN Dilakukan

- Jangan tambah TypeScript, Tailwind, atau framework CSS.
- Jangan pindahkan akses DB ke client.
- Jangan hardcode secret di kode.
- Jangan pakai em-dash di copy.
- Jangan generate botol Domanic ke dalam scene.
- Jangan ubah format nomor order atau skema pembayaran tanpa diminta.
