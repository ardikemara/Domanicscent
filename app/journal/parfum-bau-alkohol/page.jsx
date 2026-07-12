import Link from "next/link";
import ArticleProductCta from "@/components/ArticleProductCta";
import { getArticle } from "@/lib/journal";

const meta = getArticle("parfum-bau-alkohol");

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
    images: [{ url: "/images/journal/bau-alkohol-artikel-hero.jpg", width: 1200, height: 800 }],
  },
  twitter: { card: "summary_large_image" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: meta.title,
  description: meta.description,
  datePublished: meta.date,
  image: ["https://www.domanicscent.com/images/journal/bau-alkohol-artikel-hero.jpg"],
  author: { "@type": "Organization", name: "Domanic Scent" },
  publisher: { "@type": "Organization", name: "Domanic Scent", url: "https://www.domanicscent.com" },
  mainEntityOfPage: `https://www.domanicscent.com/journal/${meta.slug}`,
  inLanguage: "id-ID",
};

const articleFaqs = [
  {
    q: "Kenapa parfum baru bau alkohol?",
    a: "Karena molekulnya belum menyatu. Semua parfum pakai alkohol sebagai pelarut, tapi pada parfum yang matang, alkohol itu sudah terintegrasi dan tidak menyengat. Parfum yang dijual terlalu cepat setelah dicampur masih terasa bau alkohol.",
  },
  {
    q: "Apakah bau alkohol akan hilang sendiri?",
    a: "Sebagian bisa memudar beberapa detik setelah disemprot saat alkohol menguap. Tapi kalau parfumnya memang belum matang, kesan kasar dan menyengat itu cenderung menempel. Parfum yang dimaserasi dengan benar hampir tidak terasa alkoholnya sejak awal.",
  },
  {
    q: "Apakah parfum yang bau alkohol berbahaya?",
    a: "Umumnya tidak berbahaya, alkohol memang bahan wajar dalam parfum. Tapi bau alkohol yang kuat sering jadi tanda formula belum matang, dan itu bisa bikin aromanya kasar, cepat hilang, atau bikin sebagian orang pusing.",
  },
  {
    q: "Kenapa parfum bikin pusing?",
    a: "Bisa karena kadar alkohol yang terasa menyengat pada parfum yang belum matang, atau karena disemprot terlalu banyak. Parfum yang molekulnya sudah menyatu terasa lebih halus dan lebih jarang bikin pusing.",
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
      <h1>Kenapa Parfum Bau Alkohol, dan Kenapa Domanic Tidak</h1>
      <p className="article__meta">{meta.dateDisplay} · {meta.readTime} baca</p>

      <p className="infopage__lead">
        Parfum bau alkohol karena molekulnya belum menyatu. Semua parfum mengandung alkohol sebagai
        pelarut, tapi pada parfum yang matang, alkohol itu sudah terintegrasi sempurna dan tidak lagi
        terasa menyengat. Yang bau alkohol adalah parfum yang dijual terlalu cepat setelah dicampur,
        sebelum sempat mengendap.
      </p>

      <figure className="article__fig">
        <img src="/images/journal/bau-alkohol-artikel-hero.jpg" alt="Proses maserasi extrait de parfum Domanic supaya tidak bau alkohol" width="1200" height="800" loading="lazy" />
        <figcaption>Bau alkohol adalah tanda formula belum matang, bukan takdir sebuah parfum.</figcaption>
      </figure>

      <section className="infopage__item">
        <h2>Kenapa parfum mengandung alkohol sama sekali</h2>
        <p>
          Alkohol adalah pelarut yang melarutkan minyak wangi dan membantu aromanya menyebar rata di
          kulit lalu menguap perlahan. Hampir semua parfum semprot memakainya, jadi keberadaan
          alkohol itu normal. Masalahnya bukan ada atau tidaknya alkohol, tapi apakah dia sudah
          menyatu dengan aromanya atau belum.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Kenapa sebagian bau alkohol dan sebagian tidak</h2>
        <p>
          Jawabannya satu kata: <Link href="/journal/maserasi-parfum">maserasi</Link>. Setelah minyak
          wangi dan alkohol dicampur, formula perlu waktu untuk mengendap supaya molekulnya menyatu.
          Parfum yang langsung dibotolkan dan dijual masih terasa mentah dan menyengat. Yang
          diistirahatkan beberapa minggu terasa halus, bulat, dan tidak lagi bau alkohol.
        </p>
        <table className="article__table">
          <thead>
            <tr><th></th><th>Parfum mentah</th><th>Parfum matang</th></tr>
          </thead>
          <tbody>
            <tr><td>Semprotan pertama</td><td>Menyengat, bau alkohol</td><td>Halus, langsung wangi</td></tr>
            <tr><td>Transisi notes</td><td>Kasar, meloncat</td><td>Mengalir pelan</td></tr>
            <tr><td>Ketahanan</td><td>Cepat pudar</td><td>Bertahan lama</td></tr>
            <tr><td>Efek di kulit</td><td>Bisa bikin pusing</td><td>Nyaman, menyatu</td></tr>
          </tbody>
        </table>
      </section>

      <section className="infopage__item">
        <h2>Efek lain dari parfum yang belum matang</h2>
        <p>
          Bau alkohol cuma gejala yang paling kentara. Parfum mentah juga cenderung bikin pusing,
          cepat hilang, dan aromanya terasa kasar karena top, middle, dan{" "}
          <Link href="/journal/arti-top-middle-base-notes">base notes</Link>-nya belum berpadu jadi
          satu kesatuan.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Cara Domanic mengatasinya</h2>
        <p>
          Semua parfum Domanic adalah{" "}
          <Link href="/journal/apa-itu-extrait-de-parfum">extrait de parfum</Link> yang menjalani
          maserasi 2 sampai 4 minggu sebelum dibotolkan. Kami sengaja menunggu supaya molekulnya
          menyatu dan alkoholnya tidak lagi terasa. Hasilnya wangi yang halus sejak semprotan
          pertama, bukan yang menyengat lalu perlu didiamkan dulu di kulit. We compose, not cook.
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
          Artikel berikutnya di Journal: cara menyimpan parfum biar awet di iklim tropis.
        </p>
      </div>
    </article>
  );
}
