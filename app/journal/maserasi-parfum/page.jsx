import Link from "next/link";
import ArticleProductCta from "@/components/ArticleProductCta";
import { getArticle } from "@/lib/journal";

const meta = getArticle("maserasi-parfum");

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
    images: [{ url: "/images/journal/maserasi-artikel-hero.jpg", width: 1200, height: 805 }],
  },
  twitter: { card: "summary_large_image" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: meta.title,
  description: meta.description,
  datePublished: meta.date,
  image: ["https://www.domanicscent.com/images/journal/maserasi-artikel-hero.webp"],
  author: { "@type": "Organization", name: "Domanic Scent" },
  publisher: { "@type": "Organization", name: "Domanic Scent", url: "https://www.domanicscent.com" },
  mainEntityOfPage: `https://www.domanicscent.com/journal/${meta.slug}`,
  inLanguage: "id-ID",
};

const articleFaqs = [
  {
    q: "Berapa lama proses maserasi parfum yang ideal?",
    a: "Bervariasi tergantung komposisi. Rumah parfum mewah umumnya memakai rentang 3 sampai 8 minggu. Domanic memakai 2 sampai 4 minggu per formula, disesuaikan dengan karakter masing-masing parfum.",
  },
  {
    q: "Apakah parfum yang baru dibeli bisa dimaserasi sendiri di rumah?",
    a: "Menyimpan parfum baru beberapa minggu di tempat gelap dan sejuk memang bisa sedikit menghaluskan aromanya. Tapi maserasi yang sebenarnya terjadi sebelum pembotolan, di tangki, dengan kontrol suhu. Itu yang tidak bisa direplikasi di rumah.",
  },
  {
    q: "Apa bedanya aroma parfum yang belum dan sudah dimaserasi?",
    a: "Parfum yang belum matang biasanya terasa tajam di semprotan pertama, bau alkoholnya menonjol, dan transisi antar notes terasa kasar. Parfum yang sudah dimaserasi terasa halus sejak detik pertama, menyatu, dan karakternya keluar penuh.",
  },
  {
    q: "Apakah semua brand parfum melakukan maserasi?",
    a: "Tidak. Banyak parfum diproduksi dan langsung dijual demi kecepatan. Maserasi menahan stok berminggu-minggu, jadi hanya dilakukan brand yang memprioritaskan kualitas akhir di atas kecepatan produksi.",
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
      <h1>Apa itu Maserasi Parfum?</h1>
      <p className="article__meta">{meta.dateDisplay} · {meta.readTime} baca</p>

      <p className="infopage__lead">
        Maserasi parfum adalah proses mengistirahatkan parfum setelah formula selesai dicampur,
        biasanya beberapa minggu, supaya molekul minyak wangi dan alkohol menyatu sempurna sebelum
        dibotolkan. Tanpa maserasi, parfum terasa tajam, kasar, dan bau alkoholnya masih menonjol.
        Dengan maserasi, aroma jadi halus, dalam, dan utuh.
      </p>

      <figure className="article__fig">
        <img src="/images/journal/maserasi-artikel-hero.webp" alt="Satu batch botol extrait de parfum Domanic Oud Majesty tersimpan di lemari selama maserasi" width="1200" height="821" loading="lazy" />
        <figcaption>Satu batch, satu lemari, beberapa minggu ketenangan sebelum dijual.</figcaption>
      </figure>

      <section className="infopage__item">
        <h2>Apa yang terjadi selama maserasi</h2>
        <p>
          Saat formula baru selesai dicampur, semua bahannya secara teknis sudah ada di tempatnya,
          tapi belum saling mengenal. Molekul minyak wangi, alkohol, dan fiksatif masih berdiri
          sendiri-sendiri. Selama masa maserasi, perlahan-lahan mereka berintegrasi: alkohol
          melembut dan berhenti terasa menyengat, molekul aroma saling mengikat, dan transisi dari
          top ke heart ke base notes menjadi mulus. Prosesnya mirip masakan yang dibiarkan semalaman:
          bahannya sama, tapi rasanya menyatu.
        </p>
        <figure className="article__fig article__fig--notes">
          <img src="/images/journal/maserasi-artikel-liquid.webp" alt="Cairan extrait de parfum keemasan dalam wadah kaca selama proses maserasi" width="960" height="960" loading="lazy" />
          <figcaption>Perubahan yang tidak terlihat mata, tapi jelas terasa di kulit.</figcaption>
        </figure>
      </section>

      <section className="infopage__item">
        <h2>Sebelum vs sesudah maserasi</h2>
        <table className="article__table">
          <thead>
            <tr><th>Aspek</th><th>Belum dimaserasi</th><th>Fully macerated</th></tr>
          </thead>
          <tbody>
            <tr><td>Semprotan pertama</td><td>Tajam, alkohol menonjol</td><td>Halus sejak detik pertama</td></tr>
            <tr><td>Keutuhan aroma</td><td>Notes terasa terpisah-pisah</td><td>Menyatu jadi satu karakter</td></tr>
            <tr><td>Transisi notes</td><td>Kasar, melompat-lompat</td><td>Smooth dari top sampai base</td></tr>
            <tr><td>Ketahanan</td><td>Cenderung lebih cepat pudar</td><td>Lebih stabil dan tahan lama</td></tr>
          </tbody>
        </table>
      </section>

      <section className="infopage__item">
        <h2>Standar rumah parfum mewah</h2>
        <p>
          Maserasi bukan penemuan Domanic. Ini praktik standar rumah parfum mewah dunia: Le Labo
          memaserasi parfumnya sekitar 3 minggu, Tom Ford sampai 6 hingga 8 minggu. Alasannya sama:
          parfum yang diberi waktu selalu lebih baik dari parfum yang diburu-buru. Yang jarang adalah
          brand yang mau menahannya, karena maserasi berarti stok tertahan berminggu-minggu sebelum
          bisa dijual.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Cara Domanic melakukannya</h2>
        <p>
          Setiap batch Domanic menjalani maserasi penuh 2 sampai 4 minggu setelah formula selesai,
          dan tidak ada satu botol pun yang dijual sebelum masa itu selesai. Setiap batch diberi
          tanggal, diistirahatkan, dan baru dibotolkan ketika karakternya sudah keluar sepenuhnya.
          Ini bagian dari prinsip yang sama dengan cara kami menyusun formula:{" "}
          <Link href="/journal/apa-itu-extrait-de-parfum">extrait de parfum</Link> yang dibuat pelan,
          bukan dikejar tanggal rilis. We don't sell unfinished perfume.
        </p>
        <figure className="article__fig">
          <img src="/images/journal/maserasi-artikel-label.webp" alt="Menulis label tanggal batch maserasi dengan bolpen di samping deretan botol extrait de parfum Domanic" width="1200" height="900" loading="lazy" />
          <figcaption>Setiap batch diberi tanggal. Waktu adalah bahan terakhir setiap Domanic.</figcaption>
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
          Artikel berikutnya di Journal: perbedaan EDP dan EDT, dan di mana posisi extrait di
          antara keduanya.
        </p>
      </div>
    </article>
  );
}
