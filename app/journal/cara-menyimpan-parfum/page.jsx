import Link from "next/link";
import ArticleProductCta from "@/components/ArticleProductCta";
import { getArticle } from "@/lib/journal";

const meta = getArticle("cara-menyimpan-parfum");

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
    images: [{ url: "/images/journal/simpan-parfum-artikel-hero.jpg", width: 1200, height: 800 }],
  },
  twitter: { card: "summary_large_image" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: meta.title,
  description: meta.description,
  datePublished: meta.date,
  image: ["https://www.domanicscent.com/images/journal/simpan-parfum-artikel-hero.jpg"],
  author: { "@type": "Organization", name: "Domanic Scent" },
  publisher: { "@type": "Organization", name: "Domanic Scent", url: "https://www.domanicscent.com" },
  mainEntityOfPage: `https://www.domanicscent.com/journal/${meta.slug}`,
  inLanguage: "id-ID",
};

const articleFaqs = [
  {
    q: "Apakah parfum bisa kadaluarsa?",
    a: "Bisa. Parfum tidak basi seperti makanan, tapi aromanya bisa berubah dan rusak seiring waktu, apalagi kalau disimpan sembarangan. Umumnya parfum bertahan 3 sampai 5 tahun, lebih lama kalau disimpan sejuk, gelap, dan tertutup rapat.",
  },
  {
    q: "Bolehkah menyimpan parfum di kulkas?",
    a: "Boleh dan malah bagus untuk penyimpanan jangka panjang, karena suhu sejuk dan stabil serta gelap. Idealnya pakai wine cooler atau kulkas khusus. Kalau di kulkas makanan, pastikan tertutup rapat supaya aromanya tidak bercampur.",
  },
  {
    q: "Kenapa parfum tidak boleh disimpan di kamar mandi?",
    a: "Karena kamar mandi adalah tempat terburuk: suhunya naik-turun drastis dan lembapnya tinggi tiap kali mandi air panas. Perubahan suhu dan kelembapan mempercepat kerusakan aroma. Simpan di kamar atau lemari yang sejuk dan gelap.",
  },
  {
    q: "Berapa lama parfum bertahan setelah dibuka?",
    a: "Umumnya 2 sampai 3 tahun setelah dibuka kalau disimpan dengan benar. Extrait de parfum yang konsentrasinya tinggi dan sudah matang cenderung lebih stabil dibanding EDT yang lebih ringan.",
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
      <h1>Cara Menyimpan Parfum Biar Awet di Iklim Tropis</h1>
      <p className="article__meta">{meta.dateDisplay} · {meta.readTime} baca</p>

      <p className="infopage__lead">
        Cara menyimpan parfum biar awet adalah dengan menaruhnya di tempat yang sejuk, gelap, dan
        stabil suhunya. Tiga musuh utama parfum adalah panas, cahaya, dan udara. Di iklim tropis
        seperti Indonesia ketiganya hadir sekaligus, jadi cara menyimpan jadi lebih penting daripada
        di negara empat musim.
      </p>

      <figure className="article__fig">
        <img src="/images/journal/simpan-parfum-artikel-hero.jpg" alt="Cara menyimpan parfum Domanic di lemari yang sejuk dan gelap biar awet di iklim tropis" width="1200" height="800" loading="lazy" />
        <figcaption>Sejuk, gelap, stabil. Tiga syarat parfum tetap awet.</figcaption>
      </figure>

      <section className="infopage__item">
        <h2>Tiga musuh parfum: panas, cahaya, udara</h2>
        <p>
          <b>Panas</b> mempercepat reaksi kimia dan bikin aroma berubah. <b>Cahaya</b>, terutama sinar
          matahari langsung dan UV, memecah molekul aroma dan mengubah warna cairan. <b>Udara</b> yang
          masuk tiap kali botol dibuka lama-lama mengoksidasi parfum. Menyimpan dengan benar berarti
          meminimalkan ketiganya.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Tempat yang baik vs yang buruk</h2>
        <table className="article__table">
          <thead>
            <tr><th>Tempat</th><th>Baik / Buruk</th><th>Kenapa</th></tr>
          </thead>
          <tbody>
            <tr><td>Laci atau lemari tertutup</td><td>Baik</td><td>Gelap, suhu stabil</td></tr>
            <tr><td>Kamar ber-AC</td><td>Baik</td><td>Sejuk dan kering</td></tr>
            <tr><td>Kulkas / wine cooler</td><td>Baik (jangka panjang)</td><td>Sejuk, gelap, stabil</td></tr>
            <tr><td>Kamar mandi</td><td>Buruk</td><td>Lembap, suhu naik-turun</td></tr>
            <tr><td>Dekat jendela</td><td>Buruk</td><td>Kena sinar matahari langsung</td></tr>
            <tr><td>Atas meja rias terbuka</td><td>Kurang ideal</td><td>Kena cahaya dan panas ruangan</td></tr>
          </tbody>
        </table>
      </section>

      <section className="infopage__item">
        <h2>Berapa lama parfum bertahan, dan apakah bisa kadaluarsa</h2>
        <p>
          Parfum tidak basi seperti makanan, tapi aromanya bisa berubah dan rusak seiring waktu.
          Umumnya bertahan 3 sampai 5 tahun, lebih lama kalau disimpan sejuk, gelap, dan tertutup
          rapat. Extrait de parfum yang konsentrasinya tinggi cenderung lebih awet dibanding EDT yang
          ringan.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Tanda parfum sudah rusak</h2>
        <p>
          Ada tiga tanda gampang: warna cairan menggelap atau keruh, aroma berubah dari aslinya, dan
          muncul bau asam atau logam di semprotan pertama. Kalau salah satunya muncul, parfumnya
          kemungkinan sudah teroksidasi.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Kenapa parfum yang matang lebih stabil</h2>
        <p>
          Parfum yang sudah <Link href="/journal/maserasi-parfum">dimaserasi</Link> dengan benar punya
          molekul yang sudah menyatu, jadi lebih stabil dan tidak gampang berubah dibanding formula
          mentah. Ini alasan lain kenapa maserasi penting. Dan setelah disimpan dengan baik, pastikan
          cara pakainya juga benar biar wanginya maksimal:{" "}
          <Link href="/journal/cara-pakai-parfum-biar-tahan-lama">cara pakai parfum biar tahan
          lama</Link>.
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
          Rawat parfummu, dan biarkan karaktermu yang memilih wanginya lewat{" "}
          <Link href="/persona">kuis persona</Link>.
        </p>
      </div>
    </article>
  );
}
