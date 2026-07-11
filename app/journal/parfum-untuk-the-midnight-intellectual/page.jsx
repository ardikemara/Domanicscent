import Link from "next/link";
import ArticleProductCta from "@/components/ArticleProductCta";
import { getArticle } from "@/lib/journal";

const meta = getArticle("parfum-untuk-the-midnight-intellectual");

export const metadata = {
  title: `${meta.title} · DOMANIC`,
  description: meta.description,
  alternates: { canonical: `/journal/${meta.slug}` },
  openGraph: {
    type: "article",
    url: `/journal/${meta.slug}`,
    title: meta.title,
    description: meta.description,
    publishedTime: meta.date,
    images: [{ url: "/images/journal/midnight-artikel-hero.jpg", width: 1200, height: 800 }],
  },
  twitter: { card: "summary_large_image" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: meta.title,
  description: meta.description,
  datePublished: meta.date,
  image: ["https://www.domanicscent.com/images/journal/midnight-artikel-hero.jpg"],
  author: { "@type": "Organization", name: "Domanic Scent" },
  publisher: { "@type": "Organization", name: "Domanic Scent", url: "https://www.domanicscent.com" },
  mainEntityOfPage: `https://www.domanicscent.com/journal/${meta.slug}`,
  inLanguage: "id-ID",
};

const articleFaqs = [
  {
    q: "Parfum apa yang cocok untuk orang introvert dan intelektual?",
    a: "Aroma gourmand yang hangat dan dalam biasanya paling pas, seperti kopi, rum, vanilla, dan kayu. Wangi seperti ini tidak berteriak masuk ruangan, tapi berkesan dan diingat, cocok untuk kepribadian yang tenang tapi punya kedalaman.",
  },
  {
    q: "Apa itu parfum gourmand?",
    a: "Parfum gourmand adalah parfum dengan aroma yang mengingatkan pada makanan atau minuman hangat: kopi, cokelat, karamel, vanilla, rum. Karakternya manis, hangat, dan nyaman, bukan manis yang bikin enek.",
  },
  {
    q: "Kenapa Velvet Rum cocok dipakai malam?",
    a: "Karena karakternya gourmand, dark, dan sensual, aromanya paling hidup di suasana tenang dan intim seperti malam hari. Base notes-nya yang dalam bertahan lama dan terasa personal, pas untuk me-time, dinner, atau event malam.",
  },
  {
    q: "Velvet Rum wanginya seperti apa?",
    a: "Pembukaannya beraroma kopi dan rum yang hangat, lalu berkembang jadi lebih manis dan dalam dengan sentuhan vanilla dan kayu. Sebagai extrait de parfum, transisinya pelan dan kaya dari semprotan pertama sampai dry down.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: articleFaqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Article() {
  return (
    <article className="wrap infopage article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <p className="eyebrow">{meta.eyebrow}</p>
      <h1>Parfum untuk The Midnight Intellectual</h1>
      <p className="article__meta">{meta.dateDisplay} · {meta.readTime} baca</p>

      <p className="infopage__lead">
        Parfum yang cocok untuk The Midnight Intellectual adalah parfum gourmand yang hangat dan
        dalam, aroma kopi dan rum yang berkesan tanpa berteriak. Buat kamu yang tenang di luar tapi
        ramai di kepala, wangimu bukan yang memenuhi ruangan, tapi yang orang ingat setelah kamu
        pergi. Di Domanic, itu Velvet Rum.
      </p>

      <figure className="article__fig">
        <img src="/images/journal/midnight-artikel-hero.jpg" alt="Suasana malam tenang The Midnight Intellectual dengan extrait de parfum gourmand Domanic Velvet Rum" width="1200" height="800" loading="lazy" />
        <figcaption>Paling hidup pas malam udah sepi. Itu The Midnight Intellectual.</figcaption>
      </figure>

      <section className="infopage__item">
        <h2>Siapa The Midnight Intellectual</h2>
        <p>
          Kamu tenang di luar, tapi ramai di kepala. Malam favoritmu: ngopi, baca sampai larut,
          mikir dalam-dalam. Nggak butuh jadi pusat perhatian, karena buat kamu yang berkesan itu
          justru yang pelan. Kepribadian seperti ini butuh wangi yang punya kedalaman, bukan yang
          cuma ramai di menit pertama.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Kenapa aroma gourmand yang cocok</h2>
        <p>
          Gourmand adalah keluarga aroma yang mengingatkan pada hal hangat dan nyaman: kopi, rum,
          vanilla, kayu. Karakternya intim dan dekat ke kulit, bukan yang menyebar memenuhi ruangan.
          Ini sejalan dengan cara The Midnight Intellectual hadir: pelan, dalam, dan diingat.
        </p>
        <table className="article__table">
          <thead>
            <tr><th>Lapisan</th><th>Aroma Velvet Rum</th></tr>
          </thead>
          <tbody>
            <tr><td>Top notes</td><td>Kopi dan rum yang hangat</td></tr>
            <tr><td>Middle notes</td><td>Manis lembut, sentuhan rempah</td></tr>
            <tr><td>Base notes</td><td>Vanilla dan kayu yang dalam</td></tr>
          </tbody>
        </table>
        <p>
          Karena Velvet Rum adalah{" "}
          <Link href="/journal/apa-itu-extrait-de-parfum">extrait de parfum</Link>, transisi antar{" "}
          <Link href="/journal/arti-top-middle-base-notes">lapisan notes</Link> terasa pelan dan
          kaya, persis seperti malam yang kamu nikmati tanpa buru-buru.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Kapan paling pas dipakai</h2>
        <p>
          Velvet Rum paling hidup di suasana tenang: me-time malam, kerja fokus, dinner atau date
          yang kalem, sampai event malam. Cukup beberapa semprot di titik nadi, dan aromanya
          menemani sampai larut.
        </p>
        <figure className="article__fig article__fig--notes">
          <img src="/images/journal/midnight-artikel-scene.jpg" alt="Velvet Rum saat me-time malam dan kerja fokus, extrait de parfum gourmand Domanic" width="960" height="960" loading="lazy" />
          <figcaption>Me-time malam, kopi, dan wangi yang ikut mikir bareng kamu.</figcaption>
        </figure>
      </section>

      <section className="infopage__item">
        <h2>Belum yakin ini kamu?</h2>
        <p>
          Kalau kamu ragu masuk persona yang mana, mulai dari karaktermu, bukan dari daftar notes.{" "}
          <Link href="/journal/cara-memilih-parfum-sesuai-kepribadian">Baca cara memilih parfum
          sesuai kepribadian</Link>, ikut <Link href="/persona">kuisnya</Link>, atau langsung lihat{" "}
          <Link href="/products/velvet-rum">Velvet Rum</Link> lebih dekat.
        </p>
      </section>

      <ArticleProductCta />

      <section className="infopage__item article__faq">
        <h2>Pertanyaan yang sering muncul</h2>
        {articleFaqs.map((f) => (
          <div key={f.q} className="article__faqitem">
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </section>

      <div className="infopage__foot">
        <p>
          Artikel berikutnya di Journal: parfum untuk kamu yang nggak betah diam di satu tempat, The
          Free-Spirited Explorer.
        </p>
      </div>
    </article>
  );
}
