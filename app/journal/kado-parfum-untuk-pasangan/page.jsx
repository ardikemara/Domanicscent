import Link from "next/link";
import ArticleProductCta from "@/components/ArticleProductCta";
import { getArticle } from "@/lib/journal";

const meta = getArticle("kado-parfum-untuk-pasangan");

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
    images: [{ url: "/images/journal/kado-artikel-hero.jpg", width: 1200, height: 800 }],
  },
  twitter: { card: "summary_large_image" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: meta.title,
  description: meta.description,
  datePublished: meta.date,
  image: ["https://www.domanicscent.com/images/journal/kado-artikel-hero.jpg"],
  author: { "@type": "Organization", name: "Domanic Scent" },
  publisher: { "@type": "Organization", name: "Domanic Scent", url: "https://www.domanicscent.com" },
  mainEntityOfPage: `https://www.domanicscent.com/journal/${meta.slug}`,
  inLanguage: "id-ID",
};

const articleFaqs = [
  {
    q: "Kenapa parfum jadi kado yang bagus untuk pasangan?",
    a: "Karena parfum itu personal dan dipakai tiap hari, jadi tiap kali dia menyemprot, dia ingat kamu. Apalagi kalau wanginya dipilih sesuai kepribadiannya, kadonya terasa dipikirin, bukan asal beli.",
  },
  {
    q: "Gimana cara memilih parfum sebagai kado kalau nggak tahu selera dia?",
    a: "Mulai dari kepribadiannya, bukan dari daftar notes. Kenali dia tipe yang tenang dan mendalam, bebas dan spontan, anggun dan kalem, atau berani dan percaya diri. Dari situ arah wanginya jadi jelas.",
  },
  {
    q: "Parfum apa yang aman buat kado tanpa terlalu berisiko salah?",
    a: "Pilih extrait yang karakternya jelas tapi mudah disukai. Untuk pasangan yang aktif dan santai, aroma fresh seperti Lily Wood cenderung paling aman. Untuk yang suka wangi hangat dan berkesan, gourmand seperti Velvet Rum pilihan bagus.",
  },
  {
    q: "Berapa harga parfum Domanic untuk kado?",
    a: "Semua extrait de parfum Domanic Rp 329.000 untuk 50 ml. Satu harga untuk keempat parfum, jadi kamu bebas pilih yang paling cocok sama kepribadian pasanganmu tanpa mikirin beda harga.",
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
      <h1>Gift Guide: Kado Parfum untuk Pasangan</h1>
      <p className="article__meta">{meta.dateDisplay} · {meta.readTime} baca</p>

      <p className="infopage__lead">
        Kado parfum untuk pasangan paling berkesan kalau dipilih sesuai kepribadiannya, bukan asal
        wangi yang lagi viral. Parfum itu personal dan dipakai tiap hari, jadi tiap kali dia
        menyemprot, dia ingat kamu. Panduan singkat ini bantu kamu memilih extrait Domanic yang pas
        buat karakter pasanganmu.
      </p>

      <figure className="article__fig">
        <img src="/images/journal/kado-artikel-hero.jpg" alt="Kado parfum untuk pasangan, extrait de parfum Domanic sesuai kepribadian" width="1200" height="800" loading="lazy" />
        <figcaption>Kado yang terasa dipikirin: wangi yang sesuai siapa dia.</figcaption>
      </figure>

      <section className="infopage__item">
        <h2>Mulai dari kepribadian dia, bukan dari notes</h2>
        <p>
          Cara paling gampang salah beli parfum kado adalah mulai dari wangi yang kamu suka, bukan
          yang cocok buat dia. Balik urutannya: kenali dulu karakternya, baru cari aroma yang
          mewakili. Cara ini kami bahas lengkap di{" "}
          <Link href="/journal/cara-memilih-parfum-sesuai-kepribadian">cara memilih parfum sesuai
          kepribadian</Link>.
        </p>
        <table className="article__table">
          <thead>
            <tr><th>Kalau pasanganmu</th><th>Parfum</th><th>Karakter aroma</th></tr>
          </thead>
          <tbody>
            <tr><td>Tenang, mendalam, suka malam</td><td><b>Velvet Rum</b></td><td>Gourmand, kopi, hangat</td></tr>
            <tr><td>Aktif, spontan, santai</td><td><b>Lily Wood</b></td><td>Fresh, ringan, harian</td></tr>
            <tr><td>Anggun, kalem, elegan</td><td><b>Whisper</b></td><td>Floral lembut</td></tr>
            <tr><td>Berani, percaya diri</td><td><b>Oud Majesty</b></td><td>Oud, bold</td></tr>
          </tbody>
        </table>
      </section>

      <section className="infopage__item">
        <h2>Kenapa extrait de parfum jadi kado yang terasa mewah</h2>
        <p>
          Semua parfum Domanic adalah{" "}
          <Link href="/journal/apa-itu-extrait-de-parfum">extrait de parfum</Link>, konsentrasi
          paling tinggi di dunia parfum, dengan aroma yang lebih dalam dan lebih tahan lama. Ditambah
          tiap batch dimaserasi 2 sampai 4 minggu, kado ini terasa seperti sesuatu yang dibuat dengan
          niat, bukan produk massal. Semua Rp 329.000 untuk 50 ml, satu harga untuk empat pilihan.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Tips biar kadonya makin kena</h2>
        <p>
          Kalau kamu masih ragu, dua pilihan paling aman adalah{" "}
          <Link href="/journal/parfum-untuk-the-free-spirited-explorer">Lily Wood untuk yang aktif
          dan santai</Link>, atau{" "}
          <Link href="/journal/parfum-untuk-the-midnight-intellectual">Velvet Rum untuk yang suka
          wangi hangat dan berkesan</Link>. Atau ajak dia diam-diam{" "}
          <Link href="/persona">ikut kuis persona</Link> biar kamu tahu arahnya tanpa spoiler
          kadonya. Dan kalau mau lebih hati-hati, kasih{" "}
          <Link href="/journal/kamus-istilah-parfum#decant">decant</Link> kecil dulu buat dia coba,
          daripada <Link href="/journal/kamus-istilah-parfum#blind-buy">blind buy</Link> botol
          penuh.
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
          Masih bingung? Mulai dari <Link href="/persona">kuis persona</Link>, dan biarkan
          kepribadian dia yang menentukan wanginya.
        </p>
      </div>
    </article>
  );
}
