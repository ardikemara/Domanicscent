import Link from "next/link";
import ArticleProductCta from "@/components/ArticleProductCta";
import { getArticle } from "@/lib/journal";

const meta = getArticle("parfum-untuk-the-free-spirited-explorer");

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
    images: [{ url: "/images/journal/explorer-artikel-hero.jpg", width: 1200, height: 800 }],
  },
  twitter: { card: "summary_large_image" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: meta.title,
  description: meta.description,
  datePublished: meta.date,
  image: ["https://www.domanicscent.com/images/journal/explorer-artikel-hero.jpg"],
  author: { "@type": "Organization", name: "Domanic Scent" },
  publisher: { "@type": "Organization", name: "Domanic Scent", url: "https://www.domanicscent.com" },
  mainEntityOfPage: `https://www.domanicscent.com/journal/${meta.slug}`,
  inLanguage: "id-ID",
};

const articleFaqs = [
  {
    q: "Parfum apa yang cocok untuk dipakai sehari-hari?",
    a: "Parfum fresh dan ringan paling nyaman untuk sehari-hari, seperti aroma floral lembut, hijau, dan sedikit woody. Karakternya bersih dan mudah dipakai ke mana saja, dari pagi ke sore, tanpa terlalu berat.",
  },
  {
    q: "Apa bedanya parfum fresh dengan yang lain?",
    a: "Parfum fresh cenderung ringan, bersih, dan terasa lapang, sering dari keluarga citrus, floral ringan, atau green. Lawannya adalah aroma berat seperti gourmand atau oud yang lebih pekat dan cocok untuk malam.",
  },
  {
    q: "Kenapa Lily Wood cocok untuk yang aktif dan mobile?",
    a: "Karena karakternya fresh dan ringan, Lily Wood terasa nyaman dipakai seharian dalam berbagai aktivitas. Sebagai extrait de parfum, dia tetap tahan lama di cuaca Indonesia meski wanginya ringan.",
  },
  {
    q: "Lily Wood wanginya seperti apa?",
    a: "Fresh, floral lembut, dengan dasar kayu yang halus. Wanginya bersih dan mudah disukai, cocok untuk kepribadian yang spontan dan suka bergerak, tanpa terasa berlebihan.",
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
      <h1>Parfum untuk The Free-Spirited Explorer</h1>
      <p className="article__meta">{meta.dateDisplay} · {meta.readTime} baca</p>

      <p className="infopage__lead">
        Parfum yang cocok untuk The Free-Spirited Explorer adalah parfum fresh yang ringan dan mudah
        dipakai sehari-hari, floral lembut dengan dasar kayu yang halus. Buat kamu yang nggak betah
        diam di satu tempat, wangimu harus ikut bergerak: bersih, lapang, dan nyaman dari pagi ke
        sore. Di Domanic, itu Lily Wood.
      </p>

      <figure className="article__fig">
        <img src="/images/journal/explorer-artikel-hero.jpg" alt="Suasana bebas dan aktif The Free-Spirited Explorer dengan extrait de parfum fresh Domanic Lily Wood" width="1200" height="800" loading="lazy" />
        <figcaption>Nggak betah diam di satu tempat. Itu The Free-Spirited Explorer.</figcaption>
      </figure>

      <section className="infopage__item">
        <h2>Siapa The Free-Spirited Explorer</h2>
        <p>
          Kamu bebas, spontan, dan gampang bosan kalau harus diam. Harimu penuh perpindahan, dari
          satu tempat ke tempat lain, dari satu ide ke ide berikutnya. Kepribadian seperti ini butuh
          wangi yang ringan dan gampang dibawa, bukan yang berat dan menuntut perhatian.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Kenapa aroma fresh yang cocok</h2>
        <p>
          Fresh adalah keluarga aroma yang bersih dan lapang, biasanya dari floral ringan, green, dan
          sentuhan woody yang halus. Karakternya mudah dipakai ke mana saja dan nyaman dalam cuaca
          panas, pas untuk kamu yang aktif dan mobile.
        </p>
        <table className="article__table">
          <thead>
            <tr><th>Lapisan</th><th>Aroma Lily Wood</th></tr>
          </thead>
          <tbody>
            <tr><td>Top notes</td><td>Fresh dan ringan, bersih</td></tr>
            <tr><td>Middle notes</td><td>Floral lembut, tidak berat</td></tr>
            <tr><td>Base notes</td><td>Kayu halus yang menenangkan</td></tr>
          </tbody>
        </table>
        <p>
          Meski wanginya ringan, Lily Wood tetap{" "}
          <Link href="/journal/apa-itu-extrait-de-parfum">extrait de parfum</Link>, jadi tetap tahan
          lama di cuaca Indonesia. Tips biar makin awet ada di{" "}
          <Link href="/journal/cara-pakai-parfum-biar-tahan-lama">cara pakai parfum biar tahan
          lama</Link>.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Kapan paling pas dipakai</h2>
        <p>
          Lily Wood cocok jadi wangi harian: ke kantor, jalan-jalan, ketemu teman, atau aktivitas
          padat yang pindah-pindah tempat. Ringan tapi hadir, nemenin tanpa berat.
        </p>
        <figure className="article__fig article__fig--notes">
          <img src="/images/journal/explorer-artikel-scene.jpg" alt="Lily Wood dipakai untuk aktivitas harian yang aktif, extrait de parfum fresh Domanic" width="960" height="960" loading="lazy" />
          <figcaption>Wangi yang ikut kamu pindah tempat, dari pagi ke sore.</figcaption>
        </figure>
      </section>

      <section className="infopage__item">
        <h2>Belum yakin ini kamu?</h2>
        <p>
          Kalau kamu ragu masuk persona yang mana, mulai dari karaktermu, bukan dari daftar notes.{" "}
          <Link href="/journal/cara-memilih-parfum-sesuai-kepribadian">Baca cara memilih parfum
          sesuai kepribadian</Link>, ikut <Link href="/persona">kuisnya</Link>, atau langsung lihat{" "}
          <Link href="/products/lily-wood">Lily Wood</Link> lebih dekat.
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
          Artikel berikutnya di Journal: bingung kasih kado parfum untuk pasangan? Panduan singkat
          memilih Domanic sesuai kepribadian dia.
        </p>
      </div>
    </article>
  );
}
