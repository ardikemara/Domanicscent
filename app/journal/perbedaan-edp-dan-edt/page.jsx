import Link from "next/link";
import ArticleProductCta from "@/components/ArticleProductCta";
import { getArticle } from "@/lib/journal";

const meta = getArticle("perbedaan-edp-dan-edt");

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
    images: [{ url: "/images/journal/edp-edt-artikel-hero.webp", width: 928, height: 1152 }],
  },
  twitter: { card: "summary_large_image" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: meta.title,
  description: meta.description,
  datePublished: meta.date,
  author: { "@type": "Organization", name: "Domanic Scent" },
  publisher: { "@type": "Organization", name: "Domanic Scent", url: "https://www.domanicscent.com" },
  mainEntityOfPage: `https://www.domanicscent.com/journal/${meta.slug}`,
  inLanguage: "id-ID",
};

const articleFaqs = [
  {
    q: "EDP atau EDT yang lebih tahan lama?",
    a: "EDP. Kadar minyak wanginya lebih tinggi (sekitar 15-20% dibanding 5-15% pada EDT), jadi aromanya bertahan lebih lama di kulit. Di atas keduanya masih ada extrait de parfum yang paling tahan lama.",
  },
  {
    q: "Apakah EDT cocok dipakai siang hari di Indonesia?",
    a: "Cocok untuk kesan segar, tapi siap-siap re-apply karena cuaca panas dan lembap mempercepat penguapannya. Kalau mau sekali pakai tahan seharian di iklim tropis, EDP atau extrait pilihan yang lebih masuk akal.",
  },
  {
    q: "Kenapa EDT lebih murah dari EDP?",
    a: "Karena kandungan minyak wanginya lebih sedikit. Minyak wangi adalah komponen termahal dalam sebuah parfum, jadi harga naik seiring konsentrasinya.",
  },
  {
    q: "Kalau extrait de parfum itu apa?",
    a: "Konsentrasi di atas EDP, sekitar 20-40% minyak wangi. Paling pekat, paling tahan lama, dan aromanya paling dekat ke kulit. Semua parfum Domanic adalah extrait de parfum.",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <p className="eyebrow">{meta.eyebrow}</p>
      <h1>Perbedaan EDP dan EDT</h1>
      <p className="article__meta">{meta.dateDisplay} · {meta.readTime} baca</p>

      <p className="infopage__lead">
        Perbedaan utama EDP (eau de parfum) dan EDT (eau de toilette) ada di konsentrasi minyak
        wanginya: EDP sekitar 15-20%, EDT sekitar 5-15%. Karena lebih pekat, EDP lebih tahan lama,
        aromanya lebih dalam, dan harganya lebih tinggi. EDT lebih ringan, lebih segar, dan lebih
        cepat pudar. Dan di atas keduanya, masih ada satu tingkat lagi: extrait de parfum.
      </p>

      <figure className="article__fig article__fig--notes">
        <img src="/images/journal/edp-edt-artikel-hero.webp" alt="Botol extrait de parfum Domanic Lily Wood terbuka dengan atomizer chrome, tutup di sampingnya" width="928" height="1152" loading="lazy" />
        <figcaption>Konsentrasi menentukan segalanya: ketahanan, kedalaman, dan harga.</figcaption>
      </figure>

      <section className="infopage__item">
        <h2>Perbandingan lengkapnya</h2>
        <table className="article__table">
          <thead>
            <tr><th>Aspek</th><th>EDT</th><th>EDP</th><th>Extrait de Parfum</th></tr>
          </thead>
          <tbody>
            <tr><td>Minyak wangi</td><td>±5-15%</td><td>±15-20%</td><td>±20-40%</td></tr>
            <tr><td>Ketahanan</td><td>Singkat, perlu re-apply</td><td>Setengah hari lebih</td><td>Paling tahan lama</td></tr>
            <tr><td>Karakter</td><td>Ringan, segar</td><td>Lebih dalam</td><td>Paling pekat, intim</td></tr>
            <tr><td>Proyeksi</td><td>Menyebar cepat lalu hilang</td><td>Seimbang</td><td>Dekat ke kulit, personal</td></tr>
            <tr><td>Harga per ml</td><td>Paling terjangkau</td><td>Menengah</td><td>Paling tinggi</td></tr>
          </tbody>
        </table>
        <p>
          Angka persisnya berbeda-beda antar rumah parfum, tapi polanya konsisten: makin tinggi
          konsentrasi, makin tahan lama, makin dalam, dan makin mahal per mililiternya.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Mana yang cocok buat kamu?</h2>
        <p>
          Pertanyaannya bukan mana yang lebih bagus, tapi kamu butuh apa. Kalau kamu suka wangi
          ringan yang segar buat sebentar-sebentar dan tidak keberatan re-apply, EDT cukup. Kalau
          kamu mau sekali semprot pagi dan masih tercium sore, minimal EDP. Dan kalau kamu mau aroma
          yang benar-benar menempel jadi bagian dari dirimu, halus tapi bertahan sampai malam, di
          situlah extrait bekerja.
        </p>
        <figure className="article__fig article__fig--notes">
          <img src="/images/journal/edp-edt-artikel-wrist.webp" alt="Menyemprotkan extrait de parfum Domanic dengan atomizer chrome ke titik nadi pergelangan tangan" width="928" height="1152" loading="lazy" />
          <figcaption>Titik nadi: tempat konsentrasi apapun bekerja paling baik.</figcaption>
        </figure>
      </section>

      <section className="infopage__item">
        <h2>Faktor iklim: kenapa ini penting di Indonesia</h2>
        <p>
          Panas dan kelembapan mempercepat penguapan parfum. EDT yang di negara empat musim bisa
          bertahan setengah hari, di Jakarta bisa hilang sebelum jam makan siang. Ini alasan kenapa
          konsentrasi bukan sekadar preferensi di sini, tapi keputusan praktis. Makin tinggi
          konsentrasi, makin kuat parfummu menghadapi cuaca tropis.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Kenapa Domanic memilih extrait</h2>
        <p>
          Kami tidak membuat EDT atau EDP. Semua Domanic adalah{" "}
          <Link href="/journal/apa-itu-extrait-de-parfum">extrait de parfum</Link>, konsentrasi
          tertinggi, karena filosofi kami sederhana: parfum adalah identitas, dan identitas tidak
          seharusnya pudar di tengah hari. Setiap formula juga menjalani{" "}
          <Link href="/journal/maserasi-parfum">maserasi 2 sampai 4 minggu</Link> sebelum
          dibotolkan, supaya kepekatannya matang, bukan kasar.
        </p>
        <figure className="article__fig">
          <img src="/images/journal/edp-edt-artikel-detail.webp" alt="Detail label botol extrait de parfum Domanic Whisper di side table modern" width="1200" height="900" loading="lazy" />
          <figcaption>Whisper: extrait de parfum floral lembut, 50 ml.</figcaption>
        </figure>
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
          Artikel berikutnya di Journal: cara memilih parfum sesuai kepribadianmu, dan kenapa
          Domanic memulai setiap formula dari sebuah persona.
        </p>
      </div>
    </article>
  );
}
