export const articles = [
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
