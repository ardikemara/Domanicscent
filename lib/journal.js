export const articles = [
  {
    slug: "kado-parfum-untuk-pasangan",
    image: "/images/journal/kado-artikel-hero.jpg",
    title: "Gift Guide: Kado Parfum untuk Pasangan",
    description:
      "Kado parfum untuk pasangan yang terasa dipikirin: pilih extrait Domanic sesuai kepribadian dia. Panduan singkat plus rekomendasi buat tiap karakter.",
    date: "2026-07-11",
    dateDisplay: "11 Juli 2026",
    readTime: "5 menit",
    eyebrow: "Gift Guide",
  },
  {
    slug: "parfum-untuk-the-free-spirited-explorer",
    image: "/images/journal/explorer-artikel-hero.jpg",
    title: "Parfum untuk The Free-Spirited Explorer",
    description:
      "Parfum untuk The Free-Spirited Explorer: fresh, ringan, gampang dipakai sehari-hari. Kenapa Lily Wood cocok buat kamu yang aktif dan nggak betah diam.",
    date: "2026-07-11",
    dateDisplay: "11 Juli 2026",
    readTime: "5 menit",
    eyebrow: "Fragrance as Identity",
  },
  {
    slug: "parfum-untuk-the-midnight-intellectual",
    image: "/images/journal/midnight-artikel-hero.jpg",
    title: "Parfum untuk The Midnight Intellectual",
    description:
      "Parfum untuk The Midnight Intellectual: gourmand hangat beraroma kopi dan rum yang berkesan tanpa berteriak. Kenapa Velvet Rum cocok buat kamu yang tenang.",
    date: "2026-07-11",
    dateDisplay: "11 Juli 2026",
    readTime: "5 menit",
    eyebrow: "Fragrance as Identity",
  },
  {
    slug: "cara-pakai-parfum-biar-tahan-lama",
    image: "/images/journal/pakai-parfum-artikel-hero.jpg",
    title: "Cara Pakai Parfum Biar Tahan Lama di Cuaca Indonesia",
    description:
      "Cara pakai parfum biar tahan lama: semprot di titik nadi saat kulit lembap, jangan digosok, pilih extrait de parfum. Panduan buat cuaca panas Indonesia.",
    date: "2026-07-11",
    dateDisplay: "11 Juli 2026",
    readTime: "5 menit",
    eyebrow: "Fragrance 101",
  },
  {
    slug: "arti-top-middle-base-notes",
    image: "/images/journal/notes-layer-artikel-hero.jpg",
    title: "Arti Top, Middle, dan Base Notes Parfum",
    description:
      "Top, middle, dan base notes adalah tiga lapisan aroma yang muncul bergantian di kulit. Ini artinya buat cara parfum berubah dari semprotan pertama sampai malam.",
    date: "2026-07-11",
    dateDisplay: "11 Juli 2026",
    readTime: "5 menit",
    eyebrow: "Fragrance 101",
  },
  {
    slug: "cara-memilih-parfum-sesuai-kepribadian",
    image: "/images/journal/persona-artikel-hero.jpg",
    title: "Cara Memilih Parfum Sesuai Kepribadian",
    description:
      "Cara memilih parfum sesuai kepribadian: kenali karaktermu dulu, baru notes-nya. Panduan mencocokkan 4 persona Domanic dengan extrait yang paling kerasa kamu.",
    date: "2026-07-11",
    dateDisplay: "11 Juli 2026",
    readTime: "6 menit",
    eyebrow: "Fragrance as Identity",
  },
  {
    slug: "perbedaan-edp-dan-edt",
    image: "/images/journal/edp-edt-artikel-hero.webp",
    title: "Perbedaan EDP dan EDT: Mana yang Lebih Tahan Lama?",
    description:
      "Perbedaan EDP dan EDT ada di konsentrasi minyak wangi: EDP 15-20%, EDT 5-15%. Ini artinya buat ketahanan, harga, dan mana yang cocok buat iklim Indonesia.",
    date: "2026-07-07",
    dateDisplay: "7 Juli 2026",
    readTime: "5 menit",
    eyebrow: "Fragrance 101",
  },
  {
    slug: "maserasi-parfum",
    image: "/images/journal/maserasi-artikel-hero.webp",
    title: "Apa itu Maserasi Parfum? Kenapa Domanic Menunggu 2-4 Minggu",
    description:
      "Maserasi parfum adalah proses mengistirahatkan parfum setelah formula selesai supaya molekulnya menyatu. Ini yang membedakan parfum matang dari parfum mentah.",
    date: "2026-07-07",
    dateDisplay: "7 Juli 2026",
    readTime: "5 menit",
    eyebrow: "The Craft",
  },
  {
    slug: "apa-itu-extrait-de-parfum",
    image: "/images/journal/extrait-artikel-hero.webp",
    title: "Apa itu Extrait de Parfum? Konsentrasi Tertinggi di Dunia Parfum",
    description:
      "Extrait de parfum adalah konsentrasi parfum paling tinggi, di atas EDP dan EDT. Ini artinya buat ketahanan, cara pakai, dan kenapa cocok buat iklim Indonesia.",
    date: "2026-07-07",
    dateDisplay: "7 Juli 2026",
    readTime: "5 menit",
    eyebrow: "Fragrance 101",
  },
];

export function getArticle(slug) {
  return articles.find((a) => a.slug === slug);
}
