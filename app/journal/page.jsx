import Link from "next/link";
import { articles } from "@/lib/journal";

export const metadata = {
  title: "Journal · Cerita di Balik Extrait de Parfum · DOMANIC",
  description:
    "Journal Domanic: soal extrait de parfum, maceration, cara memilih parfum sesuai kepribadian, dan cerita di balik setiap aroma.",
  alternates: { canonical: "/journal" },
  openGraph: {
    type: "website",
    url: "/journal",
    title: "Journal · DOMANIC",
    description: "Cerita di balik extrait de parfum, ditulis pelan seperti parfumnya.",
  },
};

export default function JournalPage() {
  return (
    <div className="wrap infopage journal">
      <p className="eyebrow">Journal</p>
      <h1>Ditulis pelan, seperti parfumnya</h1>
      <p className="infopage__lead">
        Soal extrait de parfum, proses di balik Domanic, dan cara menemukan aroma yang paling kamu.
      </p>

      <div className="journal__list">
        {articles.map((a) => (
          <Link key={a.slug} href={`/journal/${a.slug}`} className="journal__card">
            <div className="journal__thumb"><img src={a.image} alt={a.title} loading="lazy" /></div>
            <p className="eyebrow">{a.eyebrow}</p>
            <h2>{a.title}</h2>
            <p className="journal__desc">{a.description}</p>
            <p className="journal__meta">{a.dateDisplay} · {a.readTime} baca</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
