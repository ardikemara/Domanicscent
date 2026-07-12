import Link from "next/link";
import ArticleProductCta from "@/components/ArticleProductCta";
import { getArticle } from "@/lib/journal";

const meta = getArticle("parfum-floral");

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
    images: [{ url: "/images/journal/floral-artikel-hero.jpg", width: 1200, height: 800 }],
  },
  twitter: { card: "summary_large_image" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: meta.title,
  description: meta.description,
  datePublished: meta.date,
  image: ["https://www.domanicscent.com/images/journal/floral-artikel-hero.jpg"],
  author: { "@type": "Organization", name: "Domanic Scent" },
  publisher: { "@type": "Organization", name: "Domanic Scent", url: "https://www.domanicscent.com" },
  mainEntityOfPage: `https://www.domanicscent.com/journal/${meta.slug}`,
  inLanguage: "id-ID",
};

const articleFaqs = [
  {
    q: "Apa itu parfum floral?",
    a: "Parfum floral adalah keluarga aroma bunga, dari melati, mawar, freesia, sampai peony. Ini keluarga aroma terbesar dan tertua di dunia parfum, dengan karakter dari yang segar dan ringan sampai yang penuh dan mewah.",
  },
  {
    q: "Kenapa parfum floral cepat hilang?",
    a: "Karena molekul aroma bunga umumnya ringan dan cepat menguap, apalagi di cuaca panas. Solusinya bukan menghindari floral, tapi memilih floral yang ditopang base notes berat seperti vanilla, sandalwood, atau musk, dan konsentrasi tinggi seperti extrait.",
  },
  {
    q: "Parfum aroma melati cocok untuk siapa?",
    a: "Siapa saja yang suka wangi bunga yang anggun dan hangat. Melati (jasmine) adalah bunga parfum paling klasik, dan di Indonesia aromanya sangat akrab. Egyptian jasmine di Whisper misalnya, terasa halus dan elegan, bukan menyengat.",
  },
  {
    q: "Apakah parfum floral terlalu feminin?",
    a: "Tidak harus. Mawar dan melati sudah lama dipakai di parfum maskulin dan unisex di banyak budaya. Floral yang dipadukan kayu atau musk justru terasa netral. Label feminin di floral lebih soal kebiasaan pasar daripada aromanya sendiri.",
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
      <h1>Parfum Floral: Lebih dari Sekadar Wangi Bunga</h1>
      <p className="article__meta">{meta.dateDisplay} · {meta.readTime} baca</p>

      <p className="infopage__lead">
        Parfum floral adalah keluarga aroma bunga, dari melati, mawar, freesia, sampai peony. Ini
        keluarga aroma terbesar dan tertua di dunia parfum. Dua keberatan yang paling sering muncul,
        "terlalu feminin" dan "cepat hilang", dua-duanya sebenarnya bisa dijawab, dan jawabannya ada
        di cara floral itu disusun.
      </p>

      <figure className="article__fig">
        <img src="/images/journal/floral-artikel-hero.jpg" alt="Parfum floral Domanic Whisper dengan aroma melati dan freesia yang lembut" width="1200" height="800" loading="lazy" />
        <figcaption>Bunga yang disusun benar bukan cuma wangi. Dia karakter.</figcaption>
      </figure>

      <section className="infopage__item">
        <h2>Apa itu parfum floral?</h2>
        <p>
          Floral (aroma bunga) adalah tulang punggung dunia parfum sejak awal. Hampir semua parfum
          punya unsur bunga di dalamnya, tapi yang disebut parfum floral adalah yang bunganya jadi
          karakter utama. Tiap bunga punya kepribadian sendiri:
        </p>
        <table className="article__table">
          <thead>
            <tr><th>Bunga</th><th>Karakter</th></tr>
          </thead>
          <tbody>
            <tr><td>Melati (jasmine)</td><td>Anggun, hangat, sedikit sensual</td></tr>
            <tr><td>Mawar (rose)</td><td>Klasik, penuh, bisa segar bisa dalam</td></tr>
            <tr><td>Freesia</td><td>Ringan, bersih, transparan</td></tr>
            <tr><td>Peony</td><td>Segar, muda, seperti bunga baru mekar</td></tr>
          </tbody>
        </table>
      </section>

      <section className="infopage__item">
        <h2>Kenapa parfum floral sering cepat hilang?</h2>
        <p>
          Karena molekul aroma bunga umumnya ringan, dia duduk di top dan middle notes yang menguap
          duluan. Floral tanpa fondasi akan indah 30 menit lalu pergi. Solusinya: pilih floral yang
          ditopang base notes berat, vanilla, sandalwood, musk, dan konsentrasi tinggi. Prinsipnya
          sama dengan yang kami bahas di{" "}
          <Link href="/journal/parfum-wanita-tahan-lama">parfum wanita tahan lama</Link>: yang
          menahan wangi bukan bunganya, tapi apa yang ada di bawahnya.
        </p>
        <figure className="article__fig article__fig--notes">
          <img src="/images/journal/wanita-tahan-lama-artikel-notes.jpg" alt="Base notes penopang parfum floral biar tahan lama: vanilla, sandalwood, musk, patchouli" width="960" height="960" loading="lazy" />
          <figcaption>Vanilla, sandalwood, musk: fondasi yang bikin bunga bertahan sampai malam.</figcaption>
        </figure>
      </section>

      <section className="infopage__item">
        <h2>Melati: bunga yang paling Indonesia</h2>
        <p>
          Kalau ada satu bunga yang menyatu dengan budaya Indonesia, itu melati. Dari upacara sampai
          taman rumah, aromanya sudah akrab di hidung kita jauh sebelum kenal parfum. Di dunia
          wewangian, jasmine termasuk bahan paling berharga: butuh ribuan kuntum untuk sedikit
          minyak absolut. Wangi yang kita anggap sehari-hari ternyata kemewahan di botol.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Whisper: floral yang ditopang vanilla dan sandalwood</h2>
        <p>
          <Link href="/products/whisper">Whisper</Link> adalah floral versi Domanic: egyptian jasmine
          dan freesia yang mekar anggun di tengah, ditahan vanilla dan sandalwood yang hangat di
          dasar. Karena dia extrait de parfum yang dimaserasi penuh, floral-nya tidak hilang setengah
          jalan. Ini juga wangi di balik persona{" "}
          <Link href="/journal/parfum-untuk-the-graceful-muse">The Graceful Muse</Link>: anggun,
          berkesan tanpa berisik.
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
          Taksonomi keluarga aroma Domanic kini lengkap: fresh, gourmand, woody, floral, oud, dan
          unisex. Temukan keluargamu lewat <Link href="/persona">kuis persona</Link>.
        </p>
      </div>
    </article>
  );
}
