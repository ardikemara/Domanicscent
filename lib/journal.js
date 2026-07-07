export const articles = [
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
