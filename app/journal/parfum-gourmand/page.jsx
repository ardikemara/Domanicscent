import Link from "next/link";
import ArticleProductCta from "@/components/ArticleProductCta";
import { getArticle } from "@/lib/journal";

const meta = getArticle("parfum-gourmand");

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
    images: [{ url: "/images/journal/gourmand-artikel-hero.jpg", width: 1200, height: 800 }],
  },
  twitter: { card: "summary_large_image" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: meta.title,
  description: meta.description,
  datePublished: meta.date,
  image: ["https://www.domanicscent.com/images/journal/gourmand-artikel-hero.jpg"],
  author: { "@type": "Organization", name: "Domanic Scent" },
  publisher: { "@type": "Organization", name: "Domanic Scent", url: "https://www.domanicscent.com" },
  mainEntityOfPage: `https://www.domanicscent.com/journal/${meta.slug}`,
  inLanguage: "id-ID",
};

const articleFaqs = [
  {
    q: "Apa itu parfum gourmand?",
    a: "Parfum gourmand adalah keluarga aroma yang terinspirasi dari makanan dan minuman: vanilla, cokelat, karamel, kopi, rum. Sederhananya, aroma manis yang bikin nyaman seperti dapur kue atau kedai kopi, tapi disusun jadi wangi yang bisa dipakai.",
  },
  {
    q: "Apakah parfum gourmand terlalu manis?",
    a: "Tergantung komposisinya. Gourmand yang murahan memang bisa terasa seperti permen. Tapi gourmand yang disusun benar diseimbangkan dengan notes pahit dan woody, seperti kopi, dark chocolate, atau kayu, sehingga terasa dalam dan dewasa, bukan enek.",
  },
  {
    q: "Parfum gourmand cocok dipakai kapan?",
    a: "Paling pas untuk malam, cuaca sejuk, dan momen intim: dinner, me-time, atau acara malam. Karakternya hangat dan dekat ke kulit, jadi lebih terasa di suasana tenang daripada di siang terik.",
  },
  {
    q: "Parfum aroma kopi termasuk gourmand?",
    a: "Iya. Kopi adalah salah satu notes gourmand paling populer, biasanya dipadukan dengan cokelat, vanilla, atau rum. Justru kopi yang pahit inilah yang sering menyeimbangkan gourmand supaya tidak terlalu manis.",
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
      <h1>Parfum Gourmand: Aroma Manis yang Tidak Bikin Enek</h1>
      <p className="article__meta">{meta.dateDisplay} · {meta.readTime} baca</p>

      <p className="infopage__lead">
        Parfum gourmand adalah keluarga aroma yang terinspirasi dari makanan: vanilla, cokelat,
        karamel, kopi, rum. Sederhananya, aroma manis seperti makanan. Reputasinya sering dianggap
        terlalu manis, padahal gourmand yang disusun dengan benar justru terasa dalam dan dewasa,
        bukan seperti permen.
      </p>

      <figure className="article__fig">
        <img src="/images/journal/gourmand-artikel-hero.jpg" alt="Parfum gourmand Domanic Velvet Rum dengan aroma kopi dan cokelat yang hangat" width="1200" height="800" loading="lazy" />
        <figcaption>Manis yang dewasa: hangat seperti kedai kopi, bukan toko permen.</figcaption>
      </figure>

      <section className="infopage__item">
        <h2>Apa itu parfum gourmand?</h2>
        <p>
          Gourmand diambil dari bahasa Prancis yang berarti penikmat makanan. Di dunia parfum, dia
          jadi sebutan untuk aroma yang "bisa dimakan": manis, hangat, dan nyaman seperti dapur kue
          atau kedai kopi. Keluarga ini relatif muda, baru populer sejak 1990-an, tapi sekarang jadi
          salah satu yang paling dicintai karena aromanya langsung terasa akrab.
        </p>
        <table className="article__table">
          <thead>
            <tr><th>Notes gourmand</th><th>Karakter</th></tr>
          </thead>
          <tbody>
            <tr><td>Vanilla</td><td>Manis lembut, hangat, menenangkan</td></tr>
            <tr><td>Cokelat / dark chocolate</td><td>Manis-pahit, dalam</td></tr>
            <tr><td>Kopi</td><td>Pahit, roasted, dewasa</td></tr>
            <tr><td>Karamel</td><td>Manis penuh, gurih</td></tr>
            <tr><td>Tonka</td><td>Manis creamy dengan sisi almond</td></tr>
            <tr><td>Rum</td><td>Hangat, sedikit nakal</td></tr>
          </tbody>
        </table>
      </section>

      <section className="infopage__item">
        <h2>Kenapa sebagian gourmand terasa enek dan sebagian tidak?</h2>
        <p>
          Rahasianya keseimbangan. Gourmand yang enek biasanya menumpuk manis di atas manis: karamel,
          gula, vanilla, tanpa penyeimbang. Gourmand yang bagus selalu melawan manisnya dengan
          sesuatu yang pahit atau gelap: kopi, dark chocolate, rum, atau kayu seperti sandalwood dan
          vetiver. Hasilnya bukan permen, tapi dessert yang disusun chef, manis yang punya lapisan.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Kapan memakai parfum gourmand?</h2>
        <p>
          Gourmand paling hidup di <Link href="/journal/parfum-malam-dan-parfum-pagi">malam
          hari</Link>, cuaca sejuk, dan momen intim: dinner, me-time, atau acara malam. Karakternya
          hangat dan dekat ke kulit. Untuk siang yang terik, keluarga{" "}
          <Link href="/journal/parfum-fresh">parfum fresh</Link> biasanya lebih nyaman, dan banyak
          orang akhirnya punya keduanya: fresh buat siang, gourmand buat malam.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Velvet Rum: gourmand yang gelap, bukan manis</h2>
        <p>
          <Link href="/products/velvet-rum">Velvet Rum</Link> adalah cara Domanic membaca gourmand:
          dibuka rum yang hangat, diisi kopi dan dark chocolate yang pahit-manis, ditutup vanilla,
          tonka, dan sandalwood yang dalam. Manisnya selalu dikawal sisi gelap, makanya dia terasa
          dewasa dan sensual, bukan enek. Ini juga wangi di balik persona{" "}
          <Link href="/journal/parfum-untuk-the-midnight-intellectual">The Midnight
          Intellectual</Link>: tenang di luar, dalam di dalam.
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
          Artikel berikutnya di Journal: parfum woody, aroma kayu yang bikin wangi bertahan lebih
          lama.
        </p>
      </div>
    </article>
  );
}
