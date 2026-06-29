# DOMANIC , Storefront (Next.js)

Homepage, halaman detail parfum (PDP), dan kuis "Find Your Persona" untuk Domanic Scent.
Dibangun dengan Next.js (App Router). Desain: quiet luxury, foto produk premium, copy campuran Indonesia + English.

## Jalankan di lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000

Build production:

```bash
npm run build
npm start
```

## Struktur

```
app/
  layout.jsx            Header + Footer + fonts global
  page.jsx              Homepage (hero, collection, persona teaser, why, story, dll)
  globals.css           Design system (warna, tipografi, semua komponen)
  products/[slug]/      Halaman detail tiap parfum (PDP)
  persona/              Halaman kuis Find Your Persona
  not-found.jsx
components/
  Header, Footer, Hero, ProductCard, Sections, PersonaQuiz
lib/
  products.js           Data 4 parfum + helper rupiah
public/images/          Foto hero, kartu produk, foto proses Why Domanic
```

## Konten

- 4 parfum: Velvet Rum, Lily Wood, Whisper, Oud Majesty (Extrait De Parfum, 50 ml, Rp 329.000).
- Data parfum ada di `lib/products.js` (notes, persona, story, dll). Edit di sini.
- Kuis persona: `components/PersonaQuiz.jsx` (4 pertanyaan, hasil nunjuk 1 parfum).

## Yang BELUM ada (roadmap berikutnya)

Ini storefront/front-end. Tahap berikutnya:

1. Cart + checkout beneran.
2. Database (Supabase): produk, order, customer, promo.
3. Payment Indonesia (Midtrans / Xendit): QRIS, GoPay, OVO, VA.
4. Email transaksional (Resend): konfirmasi order, dll.
5. Admin panel: kelola order, customer, promo (kode DOMANIC10).
6. Tombol "Add to bag" sekarang masih placeholder.

## Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Import di Vercel, framework auto-detect Next.js.
3. Deploy. Domain bisa diatur belakangan.

## Catatan brand

- Jangan pakai em-dash. Pakai koma, tanda kurung, atau titik.
- Copy campuran Indonesia + English.
- Foto: tangan Indonesia/Asia, suasana lokal, botol Domanic asli.
