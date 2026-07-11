import Link from "next/link";
import ArticleProductCta from "@/components/ArticleProductCta";
import { getArticle } from "@/lib/journal";

const meta = getArticle("cara-memilih-parfum-sesuai-kepribadian");

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
    images: [{ url: "/images/journal/persona-artikel-hero.jpg", width: 1200, height: 805 }],
  },
  twitter: { card: "summary_large_image" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: meta.title,
  description: meta.description,
  datePublished: meta.date,
  image: ["https://www.domanicscent.com/images/journal/persona-artikel-hero.jpg"],
  author: { "@type": "Organization", name: "Domanic Scent" },
  publisher: { "@type": "Organization", name: "Domanic Scent", url: "https://www.domanicscent.com" },
  mainEntityOfPage: `https://www.domanicscent.com/journal/${meta.slug}`,
  inLanguage: "id-ID",
};

const articleFaqs = [
  {
    q: "Bagaimana cara memilih parfum sesuai kepribadian?",
    a: "Mulai dari karaktermu, bukan dari daftar notes. Tentukan dulu kamu tipe yang tenang dan mendalam, bebas dan spontan, anggun dan kalem, atau berani dan penuh percaya diri. Setelah itu baru cocokkan dengan keluarga aroma yang mewakili karakter itu. Cara ini lebih akurat daripada asal pilih wangi yang lagi viral.",
  },
  {
    q: "Apakah parfum benar-benar bisa mencerminkan kepribadian?",
    a: "Aroma adalah salah satu sinyal identitas paling personal. Orang mengingat kamu lewat wangi jauh sebelum mereka ingat apa yang kamu pakai. Parfum yang sesuai kepribadian terasa seperti dirimu sendiri, bukan kostum, jadi kamu pakai dengan percaya diri dan konsisten.",
  },
  {
    q: "Kalau kepribadianku kompleks, apa harus punya lebih dari satu parfum?",
    a: "Boleh banget, dan itu wajar. Banyak orang punya satu parfum siang yang fresh dan satu parfum malam yang lebih dalam. Di Domanic, misalnya, Lily Wood cocok buat siang dan Velvet Rum buat malam. Satu koleksi, dua mood.",
  },
  {
    q: "Gimana kalau aku masih ragu wanginya cocok atau nggak?",
    a: "Coba di kulit dulu, semprot di pergelangan tangan, lalu tunggu 15 sampai 20 menit sampai dry down. Parfum berubah karakter setelah menyatu dengan kulit. Semua extrait Domanic juga punya garansi 30 hari kalau ternyata nggak cocok.",
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
      <h1>Cara Memilih Parfum Sesuai Kepribadian</h1>
      <p className="article__meta">{meta.dateDisplay} · {meta.readTime} baca</p>

      <p className="infopage__lead">
        Cara memilih parfum sesuai kepribadian adalah dengan mengenali karaktermu dulu, baru mencari
        keluarga aroma yang mewakilinya, bukan sebaliknya. Tentukan kamu tipe yang tenang dan
        mendalam, bebas dan spontan, anggun dan kalem, atau berani dan penuh percaya diri. Dari situ
        pilihan wanginya jadi jauh lebih terarah, dan hasilnya terasa seperti dirimu sendiri.
      </p>

      <figure className="article__fig">
        <img src="/images/journal/persona-artikel-hero.jpg" alt="Empat botol extrait de parfum Domanic di meja kayu terang, mewakili empat kepribadian berbeda" width="1200" height="805" loading="lazy" />
        <figcaption>Empat kepribadian, empat wangi. Wear your identity.</figcaption>
      </figure>

      <section className="infopage__item">
        <h2>Kenapa mulai dari kepribadian, bukan dari notes</h2>
        <p>
          Kebanyakan orang memilih parfum dari wangi yang lagi ramai dibicarakan, lalu bingung kenapa
          di kulit sendiri rasanya kurang pas. Masalahnya bukan di parfumnya, tapi di titik mulainya.
          Aroma adalah sinyal identitas yang sangat personal. Orang mengingat kamu lewat wangi jauh
          sebelum mereka ingat apa yang kamu kenakan.
        </p>
        <p>
          Kalau kamu mulai dari karakter, parfum berhenti jadi aksesori dan mulai jadi bagian dari
          cara kamu hadir. Itu sebabnya setiap parfum Domanic lahir dari sebuah persona, bukan dari
          resep. Kami menyebutnya wear your identity.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Empat kepribadian, empat wangi</h2>
        <p>
          Domanic punya empat extrait de parfum, dan masing-masing dibangun dari satu karakter yang
          jelas. Cari baris yang paling kerasa kamu:
        </p>
        <table className="article__table">
          <thead>
            <tr><th>Kalau kamu</th><th>Persona</th><th>Parfum</th><th>Karakter aroma</th></tr>
          </thead>
          <tbody>
            <tr><td>Tenang di luar, ramai di kepala, hidup pas malam</td><td>The Midnight Intellectual</td><td><b>Velvet Rum</b></td><td>Gourmand, kopi, dark</td></tr>
            <tr><td>Bebas, spontan, nggak betah diam</td><td>The Free-Spirited Explorer</td><td><b>Lily Wood</b></td><td>Fresh, ringan, sehari-hari</td></tr>
            <tr><td>Anggun, kalem, berkesan tanpa berisik</td><td>The Graceful Muse</td><td><b>Whisper</b></td><td>Floral lembut, elegan</td></tr>
            <tr><td>Berani, percaya diri, bikin statement</td><td>The Bold Charmer</td><td><b>Oud Majesty</b></td><td>Parfum oud, bold</td></tr>
          </tbody>
        </table>
        <p>
          Nggak harus pas 100 persen di satu baris. Banyak orang campuran dua karakter, dan itu justru
          alasan bagus buat punya lebih dari satu wangi: satu buat siang, satu buat malam.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Cocokkan karakter dengan keluarga aroma</h2>
        <p>
          Setelah tahu karaktermu, langkah berikutnya gampang: kenali keluarga aroma yang biasanya
          sejalan. Yang tenang dan mendalam cenderung nyaman di gourmand dan woody yang hangat. Yang
          bebas dan spontan condong ke fresh dan floral ringan. Yang anggun cocok di floral lembut yang
          nggak berlebihan. Yang berani biasanya kuat di oud dan aroma yang berani ambil ruang.
        </p>
        <figure className="article__fig article__fig--notes">
          <img src="/images/journal/persona-artikel-notes.jpg" alt="Bahan aroma dari empat keluarga: biji kopi, bunga segar, kelopak floral lembut, dan kayu oud" width="960" height="960" loading="lazy" />
          <figcaption>Dari gourmand yang hangat sampai oud yang bold: tiap karakter punya rumah aromanya.</figcaption>
        </figure>
        <p>
          Karena semua parfum Domanic adalah{" "}
          <Link href="/journal/apa-itu-extrait-de-parfum">extrait de parfum</Link>, konsentrasi
          aromanya tinggi dan karakternya terasa penuh sejak semprotan pertama sampai malam. Kamu
          nggak perlu re-apply tiap beberapa jam buat tetap kerasa jadi dirimu.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Kenapa karakter Domanic terasa utuh</h2>
        <p>
          Persona yang jelas cuma separuh cerita. Separuh lainnya ada di proses. Setelah formula
          selesai, tiap batch masih menjalani{" "}
          <Link href="/journal/maserasi-parfum">maserasi 2 sampai 4 minggu</Link> supaya molekulnya
          menyatu dan karakternya keluar sepenuhnya. Inilah yang bikin sebuah wangi terasa matang dan
          konsisten, bukan mentah dan pecah di tengah jalan. We compose, not cook.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Cara paling cepat: ikut kuisnya</h2>
        <p>
          Kalau kamu masih ragu ada di baris yang mana, nggak perlu nebak sendiri. Cukup jawab empat
          pertanyaan singkat dan kami cariin Domanic yang paling kerasa kamu.{" "}
          <Link href="/persona">Ikut kuis parfum sesuai kepribadian di sini</Link>, atau langsung lihat
          keempat pilihannya di bawah.
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
          Artikel berikutnya di Journal: arti top, middle, dan base notes, dan kenapa sebuah parfum
          berubah karakter dari jam pertama sampai malam.
        </p>
      </div>
    </article>
  );
}
