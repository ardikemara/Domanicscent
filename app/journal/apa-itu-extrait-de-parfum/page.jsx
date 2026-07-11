import Link from "next/link";
import ArticleProductCta from "@/components/ArticleProductCta";
import { getArticle } from "@/lib/journal";

const meta = getArticle("apa-itu-extrait-de-parfum");

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
    images: [{ url: "/images/journal/extrait-artikel-hero.jpg", width: 1200, height: 805 }],
  },
  twitter: { card: "summary_large_image" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: meta.title,
  description: meta.description,
  datePublished: meta.date,
  image: ["https://www.domanicscent.com/images/journal/extrait-artikel-hero.webp"],
  author: { "@type": "Organization", name: "Domanic Scent" },
  publisher: { "@type": "Organization", name: "Domanic Scent", url: "https://www.domanicscent.com" },
  mainEntityOfPage: `https://www.domanicscent.com/journal/${meta.slug}`,
  inLanguage: "id-ID",
};

const articleFaqs = [
  {
    q: "Extrait de parfum tahan berapa lama di kulit?",
    a: "Umumnya jauh lebih lama dibanding EDT atau EDP karena kadar minyak wanginya lebih tinggi. Hasil persisnya tergantung tipe kulit, cuaca, dan komposisi parfumnya sendiri, tapi extrait biasanya masih terasa sampai malam dari pemakaian pagi.",
  },
  {
    q: "Apakah extrait de parfum lebih bagus dari EDP?",
    a: "Bukan soal lebih bagus, tapi beda karakter. Extrait lebih pekat, lebih intim, dan lebih tahan lama. EDP lebih ringan dan menyebar lebih luas. Kalau kamu cari ketahanan dan kedalaman aroma, extrait jawabannya.",
  },
  {
    q: "Kenapa extrait de parfum harganya lebih tinggi?",
    a: "Karena kandungan minyak wanginya jauh lebih banyak per botol. Minyak wangi adalah komponen termahal dalam parfum, jadi makin pekat konsentrasinya, makin tinggi biaya bahannya.",
  },
  {
    q: "Extrait de parfum sebaiknya disemprot di mana?",
    a: "Di titik nadi: pergelangan tangan, leher, atau belakang telinga. Karena pekat, cukup 2 sampai 4 semprot. Paling optimal dipakai setelah mandi saat kulit masih sedikit lembap.",
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
      <h1>Apa itu Extrait de Parfum?</h1>
      <p className="article__meta">{meta.dateDisplay} · {meta.readTime} baca</p>

      <p className="infopage__lead">
        Extrait de parfum adalah konsentrasi parfum paling tinggi yang dijual untuk dipakai
        sehari-hari, dengan kandungan minyak wangi sekitar 20 sampai 40 persen. Lebih pekat dari eau
        de parfum (EDP) dan jauh lebih pekat dari eau de toilette (EDT). Hasilnya: aroma yang lebih
        dalam, lebih halus, dan lebih tahan lama di kulit.
      </p>

      <figure className="article__fig">
        <img src="/images/journal/extrait-artikel-hero.webp" alt="Botol extrait de parfum Domanic Velvet Rum di meja kayu dengan espresso dan dark chocolate" width="1200" height="805" loading="lazy" />
        <figcaption>Extrait de parfum: konsentrasi paling pekat, aroma paling dalam.</figcaption>
      </figure>

      <section className="infopage__item">
        <h2>Urutan konsentrasi parfum, dari paling ringan</h2>
        <p>
          Semua parfum pada dasarnya adalah campuran minyak wangi dan alkohol. Yang membedakan
          jenis-jenisnya adalah seberapa banyak minyak wanginya:
        </p>
        <table className="article__table">
          <thead>
            <tr><th>Jenis</th><th>Kadar minyak wangi</th><th>Karakter umum</th></tr>
          </thead>
          <tbody>
            <tr><td>Eau de Cologne (EDC)</td><td>±2-5%</td><td>Sangat ringan, cepat hilang</td></tr>
            <tr><td>Eau de Toilette (EDT)</td><td>±5-15%</td><td>Segar, cocok siang, perlu re-apply</td></tr>
            <tr><td>Eau de Parfum (EDP)</td><td>±15-20%</td><td>Standar parfum modern</td></tr>
            <tr><td><b>Extrait de Parfum</b></td><td><b>±20-40%</b></td><td><b>Paling pekat, paling tahan lama</b></td></tr>
          </tbody>
        </table>
        <p>
          Angka persisnya beda-beda tiap rumah parfum, tapi urutannya selalu sama: extrait ada di
          puncak piramida konsentrasi. Kalau kamu masih bingung dua yang di tengah, baca dulu{" "}
          <Link href="/journal/perbedaan-edp-dan-edt">perbedaan EDP dan EDT</Link>.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Apa bedanya di kulit?</h2>
        <p>
          Konsentrasi yang lebih tinggi mengubah tiga hal. Pertama, <b>ketahanan</b>: extrait
          bertahan jauh lebih lama dibanding EDT atau EDP karena minyak wanginya lebih banyak dan
          alkoholnya lebih sedikit. Kedua, <b>cara aromanya menyebar</b>: extrait cenderung lebih
          dekat ke kulit, lebih intim, bukan yang teriak memenuhi ruangan. Ketiga, <b>evolusinya</b>:
          transisi dari top ke heart ke base notes terasa lebih pelan dan lebih kaya, seperti cerita
          yang dibiarkan berkembang.
        </p>
        <figure className="article__fig article__fig--notes">
          <img src="/images/journal/extrait-artikel-notes.webp" alt="Bahan parfum: bergamot, melati, vanilla pods, dan sandalwood, perjalanan top ke base notes extrait de parfum" width="960" height="960" loading="lazy" />
          <figcaption>Dari bergamot yang cerah sampai sandalwood yang dalam: perjalanan notes sebuah extrait.</figcaption>
        </figure>
      </section>

      <section className="infopage__item">
        <h2>Kenapa extrait cocok buat iklim Indonesia</h2>
        <p>
          Cuaca panas dan lembap bikin parfum menguap lebih cepat. Ini alasan kenapa EDT yang wanginya
          enak di mall bisa hilang sebelum makan siang. Extrait de parfum, dengan kadar alkohol yang
          lebih rendah, lebih tahan menghadapi cuaca tropis. Cukup beberapa semprot di titik nadi,
          dan aromanya menemani sampai malam.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Cara Domanic membuat extrait de parfum</h2>
        <p>
          Semua parfum Domanic adalah extrait de parfum, dan kami memperlakukannya seperti extrait
          seharusnya diperlakukan: tidak terburu-buru. Setiap formula dimulai dari sebuah persona,
          bukan resep. Setelah formula selesai, parfum masih menjalani{" "}
          <Link href="/journal/maserasi-parfum">maserasi 2 sampai 4 minggu</Link> sebelum
          dibotolkan, supaya molekulnya menyatu dan karakternya keluar sepenuhnya. We compose, not
          cook.
        </p>
        <figure className="article__fig">
          <img src="/images/journal/extrait-artikel-maceration.webp" alt="Proses maceration extrait de parfum Domanic, pipet kaca dan vial amber di meja kerja" width="1200" height="896" loading="lazy" />
          <figcaption>Maceration: 2 sampai 4 minggu sebelum sebuah Domanic layak dibotolkan.</figcaption>
        </figure>
      </section>

      <section className="infopage__item">
        <h2>Mulai dari mana?</h2>
        <p>
          Kalau kamu baru mau coba extrait de parfum pertama, cara paling gampang adalah mulai dari
          kepribadianmu, bukan dari daftar notes. <Link href="/persona">Ikut kuis singkat kami</Link>{" "}
          buat nemuin parfum yang sesuai kepribadianmu, atau langsung lihat{" "}
          <Link href="/#collection">empat extrait de parfum Domanic</Link>: Velvet Rum yang gourmand
          dan dalam, Lily Wood yang fresh buat sehari-hari, Whisper yang floral lembut, dan Oud
          Majesty yang bold.
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
          Artikel berikutnya di Journal: apa itu maceration, dan kenapa Domanic rela nunggu 2 sampai
          4 minggu sebelum membotolkan parfum.
        </p>
      </div>
    </article>
  );
}
