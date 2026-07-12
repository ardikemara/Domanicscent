import Link from "next/link";
import ArticleProductCta from "@/components/ArticleProductCta";
import { getArticle } from "@/lib/journal";

const meta = getArticle("parfum-unisex");

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
    images: [{ url: "/images/journal/unisex-artikel-hero.jpg", width: 1200, height: 800 }],
  },
  twitter: { card: "summary_large_image" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: meta.title,
  description: meta.description,
  datePublished: meta.date,
  image: ["https://www.domanicscent.com/images/journal/unisex-artikel-hero.jpg"],
  author: { "@type": "Organization", name: "Domanic Scent" },
  publisher: { "@type": "Organization", name: "Domanic Scent", url: "https://www.domanicscent.com" },
  mainEntityOfPage: `https://www.domanicscent.com/journal/${meta.slug}`,
  inLanguage: "id-ID",
};

const articleFaqs = [
  {
    q: "Apa itu parfum unisex?",
    a: "Parfum unisex adalah parfum yang dirancang untuk dipakai siapa saja, tanpa terikat gender. Biasanya dibangun dari notes yang netral seperti citrus, woody (aroma kayu), musk, atau green, bukan yang secara stereotip dianggap maskulin atau feminin.",
  },
  {
    q: "Parfum unisex cocok untuk siapa?",
    a: "Siapa saja yang memilih aroma berdasarkan karakter, bukan label. Kalau kamu suka wangi bersih, ringan, dan netral yang gampang dipakai ke mana saja, parfum unisex hampir pasti cocok, apa pun gendermu.",
  },
  {
    q: "Apakah parfum pria bisa dipakai wanita?",
    a: "Bisa, dan sebaliknya juga. Tidak ada aturan kimia yang membuat sebuah aroma hanya untuk satu gender. Label pria atau wanita di parfum adalah keputusan marketing, bukan sifat aromanya. Yang penting wanginya cocok di kulitmu dan terasa seperti kamu.",
  },
  {
    q: "Parfum unisex apa yang tahan lama?",
    a: "Cari yang konsentrasinya tinggi, seperti extrait de parfum, dengan base notes yang berat seperti kayu atau musk. Lily Wood dari Domanic contohnya: fresh dan unisex, tapi tetap extrait yang bertahan seharian di cuaca Indonesia.",
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
      <h1>Parfum Unisex: Kenapa Aroma Tidak Punya Gender</h1>
      <p className="article__meta">{meta.dateDisplay} · {meta.readTime} baca</p>

      <p className="infopage__lead">
        Parfum unisex adalah parfum yang dirancang tanpa terikat gender, biasanya dibangun dari notes
        yang netral seperti citrus, woody, atau musk, dan bisa dipakai siapa saja. Tapi pertanyaan
        yang lebih menarik bukan "parfum unisex itu apa", melainkan: kenapa kita pernah percaya bahwa
        aroma punya jenis kelamin?
      </p>

      <figure className="article__fig">
        <img src="/images/journal/unisex-artikel-hero.jpg" alt="Parfum unisex Domanic Lily Wood yang bisa dipakai pria dan wanita" width="1200" height="800" loading="lazy" />
        <figcaption>Satu wangi, siapa pun pemakainya. Aroma nggak pernah nanya gender.</figcaption>
      </figure>

      <section className="infopage__item">
        <h2>Apa itu parfum unisex?</h2>
        <p>
          Sederhananya: parfum yang bisa dipakai siapa saja. Bukan karena aromanya "setengah pria
          setengah wanita", tapi karena dia dibangun dari notes yang memang netral, seperti citrus
          yang cerah, woody (aroma kayu) yang membumi, musk yang bersih, atau green yang segar.
          Karakternya jelas, tapi tidak diarahkan ke satu gender.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Kenapa parfum dibagi jadi pria dan wanita?</h2>
        <p>
          Jawaban singkatnya: marketing abad 20, bukan kimia. Selama ratusan tahun sebelumnya, parfum
          dipakai siapa saja tanpa label. Baru ketika industri parfum modern tumbuh, brand mulai
          memisahkan produk berdasarkan gender supaya bisa menjual dua botol ke satu rumah. Molekul
          aromanya sendiri tidak pernah berubah: melati tetap melati di kulit siapa pun.
        </p>
        <table className="article__table">
          <thead>
            <tr><th>Notes</th><th>Stereotip</th><th>Kenyataannya</th></tr>
          </thead>
          <tbody>
            <tr><td>Oud, kayu, tembakau</td><td>"Maskulin"</td><td>Dipakai semua gender di Timur Tengah sejak dulu</td></tr>
            <tr><td>Melati, mawar, floral</td><td>"Feminin"</td><td>Mawar adalah nota klasik parfum pria di banyak budaya</td></tr>
            <tr><td>Vanilla, gourmand</td><td>"Feminin"</td><td>Base favorit banyak parfum niche unisex</td></tr>
            <tr><td>Citrus, green, musk</td><td>Netral</td><td>Memang netral, makanya jadi tulang punggung parfum unisex</td></tr>
          </tbody>
        </table>
      </section>

      <section className="infopage__item">
        <h2>Kenapa parfum unisex makin populer?</h2>
        <p>
          Karena makin banyak orang memilih aroma berdasarkan karakter, bukan kolom di rak toko.
          Tren yang sama terlihat di data pencarian: orang mencari{" "}
          <Link href="/journal/parfum-pria-tahan-lama">parfum pria tahan lama</Link> atau{" "}
          <Link href="/journal/parfum-wanita-tahan-lama">parfum wanita tahan lama</Link> karena butuh
          solusi ketahanan, bukan karena aromanya harus bergender. Rumah parfum niche dunia bahkan
          hampir semuanya merilis parfum tanpa label gender sama sekali.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Cara memilih parfum unisex yang cocok</h2>
        <p>
          Mulai dari karaktermu, bukan dari gender. Kamu tipe yang tenang dan mendalam, bebas dan
          spontan, anggun, atau berani? Dari situ keluarga aromanya ikut. Panduan lengkapnya ada di{" "}
          <Link href="/journal/cara-memilih-parfum-sesuai-kepribadian">cara memilih parfum sesuai
          kepribadian</Link>. Di Domanic, yang paling netral dan gampang dipakai siapa saja adalah{" "}
          <Link href="/products/lily-wood">Lily Wood</Link>: fresh, ringan, dengan fondasi woody yang
          membumi. Tapi sejujurnya, keempat parfum kami dirancang dari persona, bukan gender.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Wear your identity, bukan wear your gender</h2>
        <p>
          Prinsip Domanic dari awal: parfum adalah soal siapa kamu. Kalau kamu belum tahu karaktermu
          condong ke mana, <Link href="/persona">ikut kuis persona</Link>, empat pertanyaan singkat,
          dan biarkan kepribadianmu yang memilih wanginya.
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
          Artikel berikutnya di Journal: parfum untuk kamu yang berani dan bikin orang menoleh, The
          Bold Charmer.
        </p>
      </div>
    </article>
  );
}
