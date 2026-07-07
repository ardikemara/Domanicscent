export const articles = [
  {
    slug: "perbedaan-edp-dan-edt",
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
