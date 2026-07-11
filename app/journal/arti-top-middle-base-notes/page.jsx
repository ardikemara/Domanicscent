import Link from "next/link";
import ArticleProductCta from "@/components/ArticleProductCta";
import { getArticle } from "@/lib/journal";

const meta = getArticle("arti-top-middle-base-notes");

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
    images: [{ url: "/images/journal/notes-layer-artikel-hero.jpg", width: 1200, height: 805 }],
  },
  twitter: { card: "summary_large_image" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: meta.title,
  description: meta.description,
  datePublished: meta.date,
  image: ["https://www.domanicscent.com/images/journal/notes-layer-artikel-hero.jpg"],
  author: { "@type": "Organization", name: "Domanic Scent" },
  publisher: { "@type": "Organization", name: "Domanic Scent", url: "https://www.domanicscent.com" },
  mainEntityOfPage: `https://www.domanicscent.com/journal/${meta.slug}`,
  inLanguage: "id-ID",
};

const articleFaqs = [
  {
    q: "Apa itu top, middle, dan base notes?",
    a: "Tiga lapisan aroma yang muncul bergantian setelah parfum disemprot. Top notes adalah kesan pertama yang cepat menguap, middle notes (heart) adalah karakter utama yang bertahan beberapa jam, dan base notes adalah fondasi yang paling tahan lama dan menempel di kulit sampai malam.",
  },
  {
    q: "Berapa lama top notes bertahan?",
    a: "Biasanya sekitar 15 sampai 30 menit. Top notes memang sengaja dibuat ringan dan mudah menguap, jadi wajar kalau wangi awal parfum berubah setelah setengah jam. Yang kamu cium setelah itu adalah middle dan base notes.",
  },
  {
    q: "Kenapa parfum wanginya berubah setelah beberapa jam?",
    a: "Karena tiap lapisan notes menguap dengan kecepatan berbeda. Molekul ringan (top) hilang duluan, disusul middle, lalu base yang paling berat bertahan paling lama. Perubahan ini normal dan justru bagian dari cara parfum bagus bercerita di kulit.",
  },
  {
    q: "Apa itu dry down?",
    a: "Dry down adalah tahap akhir saat top dan middle notes sudah menguap dan yang tersisa tinggal base notes. Ini wangi paling jujur dari sebuah parfum. Makanya coba parfum sebaiknya tunggu 15 sampai 20 menit dulu sampai dry down sebelum memutuskan cocok atau nggak.",
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
      <h1>Arti Top, Middle, dan Base Notes dalam Parfum</h1>
      <p className="article__meta">{meta.dateDisplay} · {meta.readTime} baca</p>

      <p className="infopage__lead">
        Top, middle, dan base notes adalah tiga lapisan aroma yang muncul bergantian setelah parfum
        disemprot. Top notes jadi kesan pertama yang cepat menguap, middle notes adalah karakter
        utamanya, dan base notes adalah fondasi yang bertahan paling lama di kulit. Inilah kenapa
        wangi parfum berubah dari semprotan pertama sampai malam.
      </p>

      <figure className="article__fig">
        <img src="/images/journal/notes-layer-artikel-hero.jpg" alt="Botol extrait de parfum Domanic dengan tiga lapisan aroma top, middle, dan base notes" width="1200" height="805" loading="lazy" />
        <figcaption>Satu parfum, tiga babak: top, middle, base. Wangi yang berkembang, bukan diam.</figcaption>
      </figure>

      <section className="infopage__item">
        <h2>Apa itu top, middle, dan base notes?</h2>
        <p>
          Sebuah parfum bukan satu wangi yang datar. Dia disusun berlapis seperti piramida, dan tiap
          lapisan punya perannya sendiri serta muncul di waktu yang berbeda:
        </p>
        <table className="article__table">
          <thead>
            <tr><th>Lapisan</th><th>Kapan terasa</th><th>Durasi</th><th>Contoh aroma</th></tr>
          </thead>
          <tbody>
            <tr><td><b>Top notes</b></td><td>Semprotan pertama</td><td>±15-30 menit</td><td>Citrus, bergamot, buah, herbal</td></tr>
            <tr><td><b>Middle notes</b> (heart)</td><td>Setelah top memudar</td><td>±2-4 jam</td><td>Floral, rempah, teh, buah matang</td></tr>
            <tr><td><b>Base notes</b></td><td>Beberapa jam terakhir</td><td>Sampai malam</td><td>Kayu, vanilla, musk, amber, oud</td></tr>
          </tbody>
        </table>
        <p>
          Urutannya selalu sama: yang ringan menguap duluan, yang berat bertahan paling lama. Itu
          sebabnya wangi yang kamu cium di menit pertama beda dengan yang menempel di sore hari.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Kenapa wanginya berubah di kulit</h2>
        <p>
          Perubahan itu bukan cacat, justru itu bagian dari cara parfum bagus bercerita. Tiap molekul
          aroma punya berat yang berbeda. Molekul ringan di top notes menguap cepat, disusul middle,
          lalu base notes yang paling berat menempel paling lama. Tahap akhir saat tinggal base notes
          ini disebut <b>dry down</b>, dan itulah wangi paling jujur dari sebuah parfum.
        </p>
        <figure className="article__fig article__fig--notes">
          <img src="/images/journal/notes-layer-artikel-pyramid.jpg" alt="Tiga kelompok bahan aroma: citrus untuk top notes, floral untuk middle notes, dan kayu untuk base notes" width="960" height="960" loading="lazy" />
          <figcaption>Dari citrus yang cerah, ke floral yang hangat, sampai kayu yang dalam.</figcaption>
        </figure>
        <p>
          Makanya waktu nyoba parfum, jangan buru-buru menilai dari semprotan pertama. Tunggu 15
          sampai 20 menit sampai dry down, baru kamu tahu karakter aslinya. Tips lengkapnya ada di
          artikel <Link href="/journal/perbedaan-edp-dan-edt">perbedaan EDP dan EDT</Link>, karena
          konsentrasi juga menentukan seberapa lama tiap lapisan bertahan.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Kenapa lapisan notes Domanic terasa lebih penuh</h2>
        <p>
          Karena semua parfum Domanic adalah{" "}
          <Link href="/journal/apa-itu-extrait-de-parfum">extrait de parfum</Link>, konsentrasi
          minyak wanginya tinggi, jadi transisi dari top ke middle ke base terasa lebih pelan dan
          lebih kaya, bukan hilang setengah jalan. Ditambah tiap batch masih menjalani{" "}
          <Link href="/journal/maserasi-parfum">maserasi 2 sampai 4 minggu</Link> supaya molekulnya
          benar-benar menyatu sebelum dibotolkan. Hasilnya piramida aroma yang utuh dari pagi sampai
          malam. We compose, not cook.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Notes mana yang cocok buat kamu?</h2>
        <p>
          Tiap orang punya lapisan favorit. Ada yang jatuh cinta di gourmand yang manis, ada yang
          nyaman di floral lembut, ada yang cari base kayu yang dalam. Cara paling gampang nemuin
          punyamu adalah mulai dari karakter, bukan dari daftar notes.{" "}
          <Link href="/journal/cara-memilih-parfum-sesuai-kepribadian">Baca cara memilih parfum
          sesuai kepribadian</Link>, atau langsung ikut <Link href="/persona">kuisnya</Link>.
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
          Artikel berikutnya di Journal: cara pakai parfum biar tahan lama di cuaca Indonesia, dari
          titik semprot sampai trik biar base notes-nya awet seharian.
        </p>
      </div>
    </article>
  );
}
