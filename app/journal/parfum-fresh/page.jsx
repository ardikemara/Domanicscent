import Link from "next/link";
import ArticleProductCta from "@/components/ArticleProductCta";
import { getArticle } from "@/lib/journal";

const meta = getArticle("parfum-fresh");

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
    images: [{ url: "/images/journal/parfum-fresh-artikel-hero.jpg", width: 1200, height: 800 }],
  },
  twitter: { card: "summary_large_image" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: meta.title,
  description: meta.description,
  datePublished: meta.date,
  image: ["https://www.domanicscent.com/images/journal/parfum-fresh-artikel-hero.jpg"],
  author: { "@type": "Organization", name: "Domanic Scent" },
  publisher: { "@type": "Organization", name: "Domanic Scent", url: "https://www.domanicscent.com" },
  mainEntityOfPage: `https://www.domanicscent.com/journal/${meta.slug}`,
  inLanguage: "id-ID",
};

const articleFaqs = [
  {
    q: "Apa itu parfum fresh?",
    a: "Parfum fresh adalah parfum dengan aroma yang ringan, bersih, dan terasa lapang, biasanya dari keluarga citrus, green (dedaunan), aquatic (air laut), atau floral ringan. Karakternya menyegarkan dan mudah dipakai ke mana saja, kebalikan dari aroma berat seperti gourmand atau oud.",
  },
  {
    q: "Kenapa parfum fresh cocok untuk cuaca panas?",
    a: "Karena aromanya ringan dan tidak menumpuk saat berkeringat. Di cuaca panas dan lembap, parfum berat bisa terasa menyesakkan, sedangkan parfum fresh tetap terasa bersih dan nyaman. Ini alasan kenapa aroma fresh populer di iklim tropis seperti Indonesia.",
  },
  {
    q: "Apakah parfum fresh tahan lama?",
    a: "Tergantung konsentrasinya. Parfum fresh berbentuk EDT sering cepat hilang, tapi kalau bentuknya extrait de parfum (konsentrasi tertinggi), aroma fresh bisa ringan di hidung tapi tetap tahan lama di kulit. Lily Wood dari Domanic contohnya: fresh tapi extrait.",
  },
  {
    q: "Parfum fresh cocok untuk pria atau wanita?",
    a: "Dua-duanya. Banyak parfum fresh bersifat unisex karena karakternya netral dan bersih, tidak terlalu manis atau terlalu maskulin. Cocok untuk siapa saja yang suka wangi ringan buat sehari-hari.",
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
      <h1>Apa itu Parfum Fresh? Panduan Aroma Segar untuk Iklim Tropis</h1>
      <p className="article__meta">{meta.dateDisplay} · {meta.readTime} baca</p>

      <p className="infopage__lead">
        Parfum fresh adalah parfum dengan aroma yang ringan, bersih, dan terasa lapang, biasanya dari
        keluarga citrus, green, aquatic, atau floral ringan. Karakternya menyegarkan dan gampang
        dipakai ke mana saja, jadi salah satu jenis parfum paling nyaman buat cuaca panas dan lembap
        seperti di Indonesia.
      </p>

      <figure className="article__fig">
        <img src="/images/journal/parfum-fresh-artikel-hero.jpg" alt="Parfum fresh Domanic Lily Wood dengan aroma segar citrus dan floral untuk iklim tropis" width="1200" height="800" loading="lazy" />
        <figcaption>Parfum fresh: ringan, bersih, dan lapang. Wangi yang bikin adem.</figcaption>
      </figure>

      <section className="infopage__item">
        <h2>Keluarga aroma yang termasuk parfum fresh</h2>
        <p>
          "Fresh" bukan satu aroma, tapi payung buat beberapa keluarga aroma yang punya kesan sama:
          bersih dan menyegarkan. Ini yang paling umum:
        </p>
        <table className="article__table">
          <thead>
            <tr><th>Sub-keluarga</th><th>Kesan</th><th>Contoh aroma</th></tr>
          </thead>
          <tbody>
            <tr><td>Citrus</td><td>Cerah, energik</td><td>Bergamot, lemon, jeruk, litchi</td></tr>
            <tr><td>Green</td><td>Seperti dedaunan basah</td><td>Daun teh, rumput, batang tanaman</td></tr>
            <tr><td>Aquatic</td><td>Bersih seperti air</td><td>Sea notes, melon, mentimun</td></tr>
            <tr><td>Floral fresh</td><td>Bunga ringan, tidak berat</td><td>Peony, freesia, mawar muda</td></tr>
          </tbody>
        </table>
        <p>
          Sering satu parfum fresh menggabungkan beberapa: citrus di atas, floral ringan di tengah,
          lalu kayu halus di dasar biar tetap membumi.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Kenapa parfum fresh cocok buat iklim Indonesia</h2>
        <p>
          Di cuaca panas dan lembap, aroma berat gampang terasa menyesakkan dan menumpuk saat
          berkeringat. Parfum fresh justru sebaliknya: ringan, bersih, dan bikin adem. Ini alasan
          kenapa aroma segar selalu jadi favorit di negara tropis. Cocok buat aktivitas siang,
          kerja, atau jalan-jalan yang banyak gerak.
        </p>
        <figure className="article__fig article__fig--notes">
          <img src="/images/journal/parfum-fresh-artikel-notes.jpg" alt="Bahan aroma parfum fresh: citrus, dedaunan hijau, dan bunga ringan di atas kayu terang" width="960" height="960" loading="lazy" />
          <figcaption>Citrus yang cerah, green yang bersih, floral yang ringan: bahan aroma fresh.</figcaption>
        </figure>
      </section>

      <section className="infopage__item">
        <h2>Apakah parfum fresh tahan lama?</h2>
        <p>
          Ini salah paham yang paling umum. Orang mengira fresh pasti cepat hilang. Padahal yang
          menentukan ketahanan bukan segar atau beratnya aroma, tapi konsentrasinya. Parfum fresh
          bentuk EDT memang cepat menguap, tapi kalau bentuknya{" "}
          <Link href="/journal/apa-itu-extrait-de-parfum">extrait de parfum</Link>, aromanya bisa
          ringan di hidung tapi tetap tahan lama di kulit. Biar makin awet, cek juga{" "}
          <Link href="/journal/cara-pakai-parfum-biar-tahan-lama">cara pakai parfum biar tahan
          lama</Link>.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Parfum fresh dari Domanic: Lily Wood</h2>
        <p>
          Kalau kamu cari parfum fresh yang ringan buat sehari-hari tapi tetap tahan lama,{" "}
          <Link href="/products/lily-wood">Lily Wood</Link> jawabannya. Fresh dan unisex, dibuka
          litchi dan bergamot yang cerah, floral lembut di tengah, lalu mendarat di cedar dan vetiver
          yang membumi. Sebagai extrait de parfum yang dimaserasi 2 sampai 4 minggu, dia ringan tapi
          matang, bukan segar yang hilang sebelum siang.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Cara pilih parfum fresh yang pas</h2>
        <p>
          Aroma fresh cocok banget buat kepribadian yang aktif dan nggak betah diam. Cara paling
          gampang nemuin punyamu adalah mulai dari karakter, bukan dari daftar notes.{" "}
          <Link href="/journal/cara-memilih-parfum-sesuai-kepribadian">Baca cara memilih parfum
          sesuai kepribadian</Link>, atau kenalan sama{" "}
          <Link href="/journal/parfum-untuk-the-free-spirited-explorer">The Free-Spirited
          Explorer</Link>, persona di balik Lily Wood.
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
          Artikel berikutnya di Journal: parfum untuk kamu yang anggun dan berkesan tanpa berisik,
          The Graceful Muse.
        </p>
      </div>
    </article>
  );
}
