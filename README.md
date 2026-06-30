# DOMANIC , Storefront (Next.js)

Homepage, halaman detail parfum (PDP), kuis "Find Your Persona", dan cart + checkout untuk Domanic Scent.
Next.js (App Router). Desain quiet luxury, foto produk premium, copy campuran Indonesia + English.

## Jalankan di lokal

```bash
npm install
cp .env.example .env.local   # lalu isi DOMANIC_DATABASE_URL
npm run dev
```

Buka http://localhost:3000

## Database (Supabase)

Pakai project Supabase **yk-internal-portal**, schema khusus **`domanic`** (kepisah dari data internal).
Tabel: `customers`, `orders`, `order_items`, `promo_codes`, `leads`. Promo `DOMANIC10` (10%) sudah ada.

Set `DOMANIC_DATABASE_URL` di `.env.local` (lihat `.env.example`). Connection string ada di
Supabase Dashboard > Project Settings > Database > Connection string > URI (pakai Transaction pooler, port 6543).

Semua akses DB lewat server (server actions di `app/checkout/actions.js`) pakai connection langsung.
RLS aktif default-deny, jadi nggak ada key yang ke-expose ke browser.

## Fitur

- **Homepage**: hero (4 botol di silk, teks di kiri), collection, persona teaser, why domanic, story, newsletter.
- **PDP**: `/products/[slug]` , scent pyramid, persona, story, Add to bag.
- **Find Your Persona**: `/persona` , kuis 4 pertanyaan, hasil ke PDP.
- **Cart**: ikon Bag di header, drawer slide-in, ubah qty, hapus item (state disimpan di localStorage).
- **Checkout**: `/checkout` , form pengiriman, kode promo (validasi ke DB), ringkasan, ongkir (gratis di atas Rp 500.000).
- **Order**: disimpan ke Supabase (customer + order + order_items), nomor order otomatis (DMN-YYYYMMDD-xxxx).
- **Payment**: di-bypass (belum ada gateway). Order langsung ke Thank You page `/thank-you?order=...`.
- **Lead capture**: newsletter + checkout nyimpen ke tabel `leads`.

## Struktur

```
app/
  layout.jsx              Header + Footer + CartProvider + CartDrawer
  page.jsx                Homepage
  products/[slug]/        PDP
  persona/                Kuis
  checkout/page.jsx       Form checkout (client)
  checkout/actions.js     Server actions: createOrder, checkPromo, subscribeLead
  thank-you/page.jsx      Halaman terima kasih (baca order dari DB)
  globals.css
components/
  Header, Footer, Hero, Sections, ProductCard, AddToCart, NewsletterForm
  cart/CartContext.jsx    State cart (client, localStorage)
  cart/CartButton.jsx     Ikon bag + count
  cart/CartDrawer.jsx     Drawer keranjang
lib/
  products.js             Data 4 parfum
  db.js                   Koneksi Postgres (server-only)
public/images/
```

## Yang BELUM ada (roadmap)

1. Payment gateway beneran (Midtrans / Xendit: QRIS, GoPay, OVO, VA).
2. Email transaksional (Resend).
3. Admin panel: order, customer, promo, lead.
4. Halaman Persona (penjelasan tiap persona) + halaman Article/Blog (SEO).
5. Tracking pixels (GA, Meta, TikTok) , nunggu domain.

## Deploy ke Vercel

1. Push ke GitHub, import di Vercel.
2. Set Environment Variable `DOMANIC_DATABASE_URL` di Vercel (Project Settings > Environment Variables).
3. Deploy.

## Catatan brand

- Tanpa em-dash. Copy campuran Indonesia + English.
- Foto: tangan Indonesia/Asia, suasana lokal, botol Domanic asli.
