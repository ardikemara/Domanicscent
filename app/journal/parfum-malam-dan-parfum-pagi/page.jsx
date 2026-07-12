import Link from "next/link";
import ArticleProductCta from "@/components/ArticleProductCta";
import { getArticle } from "@/lib/journal";

const meta = getArticle("parfum-malam-dan-parfum-pagi");

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
    images: [{ url: "/images/journal/malam-pagi-artikel-hero.jpg", width: 1200, height: 800 }],
  },
  twitter: { card: "summary_large_image" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: meta.title,
  description: meta.description,
  datePublished: meta.date,
  image: ["https://www.domanicscent.com/images/journal/malam-pagi-artikel-hero.jpg"],
  author: { "@type": "Organization", name: "Domanic Scent" },
  publisher: { "@type": "Organization", name: "Domanic Scent", url: "https://www.domanicscent.com" },
  mainEntityOfPage: `https://www.domanicscent.com/journal/${meta.slug}`,
  inLanguage: "id-ID",
};

const articleFaqs = [
  {
    q: "Parfum apa yang cocok untuk malam hari?",
    a: "Aroma yang lebih pekat dan hangat: gourmand, oud, woody, amber, dan musk. Notes berat ini terasa intim dan dalam, pas untuk suasana malam yang tenang. Velvet Rum dan Oud Majesty dari Domanic contohnya.",
  },
  {
    q: "Kenapa parfum saya lebih kuat di malam hari?",
    a: "Karena suhu tubuh dan konteks berpengaruh. Malam biasanya lebih sejuk dan tenang, jadi aroma terasa lebih dekat dan personal. Kulit yang hangat juga membuat base notes lebih menonjol dibanding siang yang panas dan berangin.",
  },
  {
    q: "Bolehkah pakai parfum yang sama pagi dan malam?",
    a: "Boleh, terutama kalau konsentrasinya tinggi dan strukturnya matang. Extrait de parfum berkembang pelan dari top ke base, jadi satu parfum bisa terasa segar di pagi dan dalam di malam. Kuncinya di kualitas, bukan jumlah botol.",
  },
  {
    q: "Parfum apa yang cocok untuk pagi hari?",
    a: "Aroma fresh dan ringan: citrus, green, dan floral ringan. Karakternya bersih dan bikin adem, pas untuk memulai hari dan nyaman di cuaca panas. Lily Wood dari Domanic contohnya.",
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
      <h1>Parfum Malam vs Parfum Pagi: Kenapa Aroma yang Sama Terasa Berbeda</h1>
      <p className="article__meta">{meta.dateDisplay} · {meta.readTime} baca</p>

      <p className="infopage__lead">
        Parfum malam biasanya lebih pekat, hangat, dan dalam. Parfum pagi lebih ringan dan segar.
        Tapi perbedaannya bukan cuma soal aroma, melainkan soal bagaimana suhu tubuh, kelembapan, dan
        konteks mengubah cara aroma itu terbaca di kulit. Wangi yang sama bisa terasa dua orang yang
        berbeda tergantung waktunya.
      </p>

      <figure className="article__fig">
        <img src="/images/journal/malam-pagi-artikel-hero.jpg" alt="Parfum malam yang hangat dan dalam, extrait de parfum Domanic Velvet Rum di suasana malam" width="1200" height="800" loading="lazy" />
        <figcaption>Parfum malam: lebih pekat, hangat, dan intim.</figcaption>
      </figure>

      <section className="infopage__item">
        <h2>Kenapa aroma terasa beda di pagi dan malam</h2>
        <p>
          Tiga hal berperan. <b>Suhu tubuh:</b> kulit yang lebih hangat membuat aroma menyebar lebih
          cepat dan base notes lebih menonjol. <b>Kelembapan dan udara:</b> siang yang panas dan
          berangin menerbangkan aroma, malam yang tenang menahannya lebih dekat. <b>Konteks sosial:</b>{" "}
          pagi menuntut yang bersih dan ringan, malam memberi ruang buat yang dalam dan berani.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Karakter parfum pagi vs parfum malam</h2>
        <table className="article__table">
          <thead>
            <tr><th></th><th>Parfum pagi</th><th>Parfum malam</th></tr>
          </thead>
          <tbody>
            <tr><td>Notes</td><td>Citrus, green, floral ringan</td><td>Gourmand, oud, woody, amber</td></tr>
            <tr><td>Kesan</td><td>Fresh, bersih, ringan</td><td>Hangat, dalam, intim</td></tr>
            <tr><td>Proyeksi</td><td>Dekat, sopan</td><td>Lebih terasa, personal</td></tr>
            <tr><td>Domanic</td><td>Lily Wood, Whisper</td><td>Velvet Rum, Oud Majesty</td></tr>
          </tbody>
        </table>
      </section>

      <section className="infopage__item">
        <h2>Notes yang cocok untuk pagi</h2>
        <p>
          Pagi minta yang ringan dan menyegarkan: citrus, green, dan floral ringan yang bikin adem di
          cuaca panas. Ini wilayah{" "}
          <Link href="/journal/parfum-fresh">parfum fresh</Link>, aroma bersih yang gampang dipakai ke
          mana saja.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Notes yang cocok untuk malam</h2>
        <p>
          Malam memberi ruang buat aroma yang lebih dalam: gourmand yang hangat, oud yang bold, kayu
          dan amber yang berat. Notes ini muncul di lapisan base, dan kalau kamu penasaran gimana
          aroma berpindah dari segar ke dalam, baca{" "}
          <Link href="/journal/arti-top-middle-base-notes">arti top, middle, dan base notes</Link>.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Bisakah satu parfum dipakai pagi dan malam?</h2>
        <p>
          Bisa, kalau konsentrasinya tinggi dan strukturnya matang. Sebuah{" "}
          <Link href="/journal/apa-itu-extrait-de-parfum">extrait de parfum</Link> berkembang pelan
          dari top yang segar sampai base yang dalam, jadi satu botol bisa menemani dari pagi ke
          malam. Yang menentukan bukan jumlah parfum, tapi kualitasnya.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Pagi atau malam, itu juga soal karakter</h2>
        <p>
          Ada orang yang paling hidup pagi hari, ada yang justru malam. Pilihan aroma pagi atau malam
          sebenarnya cerminan karaktermu juga. Cari yang paling kamu lewat{" "}
          <Link href="/persona">kuis persona</Link>.
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
          Artikel berikutnya di Journal: kenapa sebagian parfum bau alkohol, dan kenapa Domanic tidak.
        </p>
      </div>
    </article>
  );
}
