import Link from "next/link";
import ArticleProductCta from "@/components/ArticleProductCta";
import { getArticle } from "@/lib/journal";

const meta = getArticle("parfum-pria-tahan-lama");

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
    images: [{ url: "/images/journal/pria-tahan-lama-artikel-hero.jpg", width: 1200, height: 800 }],
  },
  twitter: { card: "summary_large_image" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: meta.title,
  description: meta.description,
  datePublished: meta.date,
  image: ["https://www.domanicscent.com/images/journal/pria-tahan-lama-artikel-hero.jpg"],
  author: { "@type": "Organization", name: "Domanic Scent" },
  publisher: { "@type": "Organization", name: "Domanic Scent", url: "https://www.domanicscent.com" },
  mainEntityOfPage: `https://www.domanicscent.com/journal/${meta.slug}`,
  inLanguage: "id-ID",
};

const articleFaqs = [
  {
    q: "Parfum pria apa yang paling tahan lama?",
    a: "Yang konsentrasinya tinggi. Extrait de parfum (20 sampai 40 persen minyak wangi) jauh lebih tahan lama dibanding EDT atau EDP. Ditambah base notes yang berat seperti oud, kayu, dan musk, wanginya bisa bertahan dari pagi sampai malam meski di cuaca panas.",
  },
  {
    q: "Kenapa parfum saya hilang dalam 2 jam?",
    a: "Kemungkinan besar itu EDT atau EDC yang kadar minyak wanginya rendah dan alkoholnya tinggi. Di cuaca panas dan lembap Indonesia, parfum seperti ini menguap cepat. Solusinya pindah ke konsentrasi lebih tinggi dan pakai di titik nadi setelah mandi.",
  },
  {
    q: "Apakah parfum mahal pasti tahan lama?",
    a: "Nggak selalu. Harga tinggi belum tentu konsentrasi tinggi. Yang menentukan ketahanan adalah kadar minyak wangi dan kematangan formula (maserasi), bukan label harganya. Extrait yang dimaserasi dengan benar lebih tahan lama daripada EDT bermerek mahal.",
  },
  {
    q: "Berapa kali semprot yang ideal?",
    a: "Untuk extrait de parfum yang pekat, 2 sampai 4 semprot di titik nadi sudah cukup untuk seharian. Lebih dari itu bukan bikin lebih tahan, cuma bikin lebih kuat di awal.",
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
      <h1>Parfum Pria Tahan Lama: Kenapa Kebanyakan Gagal di Cuaca Indonesia</h1>
      <p className="article__meta">{meta.dateDisplay} · {meta.readTime} baca</p>

      <p className="infopage__lead">
        Parfum pria yang tahan lama bukan soal aromanya kuat, tapi soal konsentrasinya. Kebanyakan
        parfum pria di pasaran adalah EDT dengan kadar minyak wangi 5 sampai 15 persen, yang di cuaca
        panas dan lembap Indonesia menguap dalam hitungan jam. Kunci ketahanan ada di konsentrasi
        yang lebih tinggi dan base notes yang berat.
      </p>

      <figure className="article__fig">
        <img src="/images/journal/pria-tahan-lama-artikel-hero.jpg" alt="Parfum pria tahan lama Domanic Oud Majesty dengan aroma oud dan kayu yang bertahan seharian" width="1200" height="800" loading="lazy" />
        <figcaption>Ketahanan bukan soal aroma kuat, tapi konsentrasi dan base yang berat.</figcaption>
      </figure>

      <section className="infopage__item">
        <h2>Kenapa parfum pria cepat hilang di Indonesia</h2>
        <p>
          Dua hal bekerja melawanmu. Pertama, konsentrasi: kebanyakan parfum yang beredar adalah EDT,
          kadar minyak wanginya rendah dan alkoholnya tinggi. Kedua, iklim: panas dan lembap
          mempercepat penguapan. Gabungan keduanya bikin wangi yang enak di pagi hari hilang sebelum
          makan siang.
        </p>
      </section>

      <section className="infopage__item">
        <h2>EDT vs EDP vs Extrait: mana yang bertahan</h2>
        <table className="article__table">
          <thead>
            <tr><th>Jenis</th><th>Kadar minyak wangi</th><th>Ketahanan di cuaca tropis</th></tr>
          </thead>
          <tbody>
            <tr><td>Eau de Toilette (EDT)</td><td>±5-15%</td><td>Beberapa jam, perlu re-apply</td></tr>
            <tr><td>Eau de Parfum (EDP)</td><td>±15-20%</td><td>Setengah hari</td></tr>
            <tr><td><b>Extrait de Parfum</b></td><td><b>±20-40%</b></td><td><b>Sampai malam</b></td></tr>
          </tbody>
        </table>
        <p>
          Detailnya bisa kamu baca di{" "}
          <Link href="/journal/perbedaan-edp-dan-edt">perbedaan EDP dan EDT</Link> dan{" "}
          <Link href="/journal/apa-itu-extrait-de-parfum">apa itu extrait de parfum</Link>.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Notes yang bikin parfum pria bertahan lama</h2>
        <p>
          Molekul ringan menguap duluan, molekul berat bertahan. Itu sebabnya parfum yang tahan lama
          selalu punya base notes yang berat: oud, kayu (cedar, sandalwood), musk, amber, dan
          gourmand seperti tonka atau vanilla. Notes inilah yang menempel di kulit sampai malam,
          bukan top notes yang segar tapi cepat hilang.
        </p>
        <figure className="article__fig article__fig--notes">
          <img src="/images/journal/pria-tahan-lama-artikel-notes.jpg" alt="Base notes berat yang bikin parfum pria tahan lama: oud, kayu, musk, dan amber" width="960" height="960" loading="lazy" />
          <figcaption>Oud, kayu, musk, amber: base berat yang bikin wangi bertahan sampai malam.</figcaption>
        </figure>
      </section>

      <section className="infopage__item">
        <h2>Cara pakai biar makin tahan</h2>
        <p>
          Konsentrasi tinggi tetap butuh cara pakai yang benar. Semprot di titik nadi setelah mandi
          saat kulit masih lembap, dan jangan digosok. Trik lengkapnya ada di{" "}
          <Link href="/journal/cara-pakai-parfum-biar-tahan-lama">cara pakai parfum biar tahan
          lama</Link>. Satu faktor lagi yang jarang dibahas: kematangan formula. Parfum yang belum{" "}
          <Link href="/journal/maserasi-parfum">dimaserasi</Link> dengan benar cenderung pudar lebih
          cepat karena molekulnya belum menyatu.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Sebenarnya aroma tidak punya gender</h2>
        <p>
          Label "parfum pria" itu soal marketing, bukan soal aroma. Yang menentukan cocok atau nggak
          bukan gender, tapi karaktermu. Velvet Rum yang gourmand dan dalam atau Oud Majesty yang
          bold dan oud sama-sama tahan lama, dan keduanya soal siapa kamu, bukan soal kolom di rak
          toko. Cara paling jujur nemuin punyamu adalah{" "}
          <Link href="/persona">mulai dari kepribadian</Link>.
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
          Artikel berikutnya di Journal: parfum wanita tahan lama, dan kenapa rahasianya juga ada di
          base notes.
        </p>
      </div>
    </article>
  );
}
