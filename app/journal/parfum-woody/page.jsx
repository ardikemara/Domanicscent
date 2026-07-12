import Link from "next/link";
import ArticleProductCta from "@/components/ArticleProductCta";
import { getArticle } from "@/lib/journal";

const meta = getArticle("parfum-woody");

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
    images: [{ url: "/images/journal/woody-artikel-hero.jpg", width: 1200, height: 800 }],
  },
  twitter: { card: "summary_large_image" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: meta.title,
  description: meta.description,
  datePublished: meta.date,
  image: ["https://www.domanicscent.com/images/journal/woody-artikel-hero.jpg"],
  author: { "@type": "Organization", name: "Domanic Scent" },
  publisher: { "@type": "Organization", name: "Domanic Scent", url: "https://www.domanicscent.com" },
  mainEntityOfPage: `https://www.domanicscent.com/journal/${meta.slug}`,
  inLanguage: "id-ID",
};

const articleFaqs = [
  {
    q: "Apa itu parfum woody?",
    a: "Parfum woody adalah keluarga aroma kayu: sandalwood, cedar, vetiver, cashmeran, sampai oud. Karakternya hangat, membumi, dan tenang. Woody bisa jadi bintang utama sebuah parfum atau jadi fondasi yang menahan aroma lain supaya awet.",
  },
  {
    q: "Apakah parfum woody hanya untuk pria?",
    a: "Tidak. Woody adalah salah satu keluarga aroma paling netral. Sandalwood misalnya jadi base parfum floral feminin sekaligus parfum maskulin. Label gender di parfum itu marketing, bukan sifat aromanya.",
  },
  {
    q: "Kenapa parfum woody tahan lama?",
    a: "Karena molekul aroma kayu termasuk yang paling berat di dunia parfum, jadi menguapnya paling lambat. Itu sebabnya notes woody hampir selalu ada di base notes, lapisan yang menempel di kulit sampai malam.",
  },
  {
    q: "Sandalwood itu aroma apa?",
    a: "Sandalwood, atau kayu cendana, beraroma kayu yang creamy, lembut, dan hangat, tidak tajam seperti kayu segar. Dia salah satu bahan parfum tertua di dunia dan sangat lekat dengan wewangian Asia, termasuk Indonesia.",
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
      <h1>Parfum Woody: Aroma Kayu yang Bikin Parfum Bertahan Lama</h1>
      <p className="article__meta">{meta.dateDisplay} · {meta.readTime} baca</p>

      <p className="infopage__lead">
        Parfum woody adalah keluarga aroma kayu: sandalwood, cedar, vetiver, cashmeran, sampai oud.
        Karakternya hangat, membumi, dan tenang. Dan ada satu keunggulan yang jarang disadari:
        molekul aroma kayu adalah yang paling berat di dunia parfum, jadi woody adalah alasan kenapa
        sebuah parfum bisa bertahan sampai malam.
      </p>

      <figure className="article__fig">
        <img src="/images/journal/woody-artikel-hero.jpg" alt="Parfum woody Domanic Lily Wood dengan aroma kayu cedar dan vetiver yang membumi" width="1200" height="800" loading="lazy" />
        <figcaption>Aroma kayu: hangat, membumi, dan jadi penahan wangi paling setia.</figcaption>
      </figure>

      <section className="infopage__item">
        <h2>Apa itu parfum woody?</h2>
        <p>
          Woody (aroma kayu) adalah keluarga aroma yang dibangun dari kayu-kayuan wangi dan akar.
          Tiap jenisnya punya karakter sendiri:
        </p>
        <table className="article__table">
          <thead>
            <tr><th>Notes woody</th><th>Karakter</th></tr>
          </thead>
          <tbody>
            <tr><td>Sandalwood (cendana)</td><td>Creamy, lembut, hangat</td></tr>
            <tr><td>Cedar</td><td>Kering, bersih, seperti pensil baru diraut</td></tr>
            <tr><td>Vetiver</td><td>Earthy, sedikit smoky, dari akar rumput</td></tr>
            <tr><td>Cashmeran</td><td>Kayu modern yang halus seperti kain kasmir</td></tr>
            <tr><td>Oud (gaharu)</td><td>Dalam, intens, paling berkarakter</td></tr>
          </tbody>
        </table>
      </section>

      <section className="infopage__item">
        <h2>Kenapa woody bikin parfum bertahan lebih lama?</h2>
        <p>
          Semua soal berat molekul. Molekul ringan seperti citrus menguap dalam hitungan menit,
          molekul kayu menguap paling lambat, bisa berjam-jam. Itu sebabnya notes woody hampir selalu
          ditaruh di base, lapisan yang menempel paling lama di kulit. Parfum tanpa fondasi woody
          (atau base berat lain) biasanya cepat hilang, apa pun aromanya di awal. Ini prinsip yang
          sama dengan yang kami bahas di{" "}
          <Link href="/journal/parfum-pria-tahan-lama">parfum pria tahan lama</Link>.
        </p>
        <figure className="article__fig article__fig--notes">
          <img src="/images/journal/pria-tahan-lama-artikel-notes.jpg" alt="Notes woody yang berat dan tahan lama: kayu gaharu, cedar, musk, dan amber" width="960" height="960" loading="lazy" />
          <figcaption>Oud, cedar, musk, amber: molekul berat yang menguap paling lambat.</figcaption>
        </figure>
      </section>

      <section className="infopage__item">
        <h2>Woody itu maskulin?</h2>
        <p>
          Tidak, dan ini salah kaprah yang umum. Sandalwood jadi base parfum floral yang feminin
          sekaligus parfum maskulin yang gelap. Cedar dan vetiver muncul di parfum semua gender.
          Aroma kayu itu netral, yang bikin dia terkesan maskulin cuma iklan. Lebih lengkap soal ini
          ada di <Link href="/journal/parfum-unisex">parfum unisex: kenapa aroma tidak punya
          gender</Link>.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Lily Wood: fresh di atas, woody di bawah</h2>
        <p>
          <Link href="/products/lily-wood">Lily Wood</Link> adalah contoh kerja sama dua keluarga
          aroma: pembuka litchi dan bergamot yang <Link href="/journal/parfum-fresh">fresh</Link>,
          ditahan fondasi cashmeran, cedar, dan haitian vetiver yang woody. Hasilnya wangi yang
          ringan di hidung tapi awet di kulit, segar tanpa cepat hilang. Namanya sendiri sudah
          cerita: lily di atas, wood di bawah.
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
          Artikel berikutnya di Journal: parfum floral, lebih dari sekadar wangi bunga.
        </p>
      </div>
    </article>
  );
}
