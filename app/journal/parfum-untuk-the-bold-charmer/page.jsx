import Link from "next/link";
import ArticleProductCta from "@/components/ArticleProductCta";
import { getArticle } from "@/lib/journal";

const meta = getArticle("parfum-untuk-the-bold-charmer");

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
    images: [{ url: "/images/journal/bold-charmer-artikel-hero.jpg", width: 1200, height: 800 }],
  },
  twitter: { card: "summary_large_image" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: meta.title,
  description: meta.description,
  datePublished: meta.date,
  image: ["https://www.domanicscent.com/images/journal/bold-charmer-artikel-hero.jpg"],
  author: { "@type": "Organization", name: "Domanic Scent" },
  publisher: { "@type": "Organization", name: "Domanic Scent", url: "https://www.domanicscent.com" },
  mainEntityOfPage: `https://www.domanicscent.com/journal/${meta.slug}`,
  inLanguage: "id-ID",
};

const articleFaqs = [
  {
    q: "Apa itu parfum oud?",
    a: "Parfum oud adalah parfum yang aroma utamanya berasal dari oud, atau kayu gaharu, resin wangi dari pohon Aquilaria. Karakternya dalam, hangat, sedikit smoky, dan sangat berkarakter. Oud sering disebut emas cair di dunia parfum karena langka dan mahal.",
  },
  {
    q: "Kenapa parfum oud mahal?",
    a: "Karena bahan bakunya langka. Kayu gaharu yang menghasilkan resin wangi hanya terbentuk pada pohon Aquilaria yang terinfeksi jamur secara alami, dan prosesnya butuh bertahun-tahun. Makin murni oud-nya, makin tinggi harganya.",
  },
  {
    q: "Parfum oud cocok dipakai kapan?",
    a: "Paling hidup di malam hari, acara spesial, dan momen yang butuh kehadiran: dinner penting, party, atau saat kamu ingin diingat. Karakternya terlalu berkarakter untuk jadi wangi kantor harian, dan justru itu kekuatannya.",
  },
  {
    q: "Apakah parfum oud terlalu kuat?",
    a: "Oud murni memang intens, tapi parfum oud modern menyeimbangkannya dengan notes buah, floral, atau musk supaya tetap wearable. Oud Majesty misalnya dibuka peach dan apple blossom yang manis sebelum turun ke oud yang dalam. Cukup 2 sampai 3 semprot.",
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
      <h1>Parfum untuk The Bold Charmer</h1>
      <p className="article__meta">{meta.dateDisplay} · {meta.readTime} baca</p>

      <p className="infopage__lead">
        Parfum yang cocok untuk The Bold Charmer adalah parfum{" "}
        <Link href="/journal/kamus-istilah-parfum#oud">oud</Link>, aroma kayu gaharu yang dalam dan
        magnetik, ditopang musk dan{" "}
        <Link href="/journal/kamus-istilah-parfum#patchouli">patchouli</Link> yang kuat. Buat kamu yang berani, percaya diri, dan
        terbiasa bikin orang menoleh begitu masuk ruangan, wangimu harus ikut bikin statement. Di
        Domanic, itu Oud Majesty.
      </p>

      <figure className="article__fig">
        <img src="/images/journal/bold-charmer-artikel-hero.jpg" alt="Suasana percaya diri The Bold Charmer dengan extrait de parfum oud Domanic Oud Majesty" width="1200" height="800" loading="lazy" />
        <figcaption>Masuk ruangan dan semua orang menoleh. Itu The Bold Charmer.</figcaption>
      </figure>

      <section className="infopage__item">
        <h2>Siapa The Bold Charmer</h2>
        <p>
          Kamu berani, magnetik, dan nggak butuh banyak kata buat menarik perhatian. Kehadiranmu
          sendiri sudah statement. Kepribadian seperti ini butuh wangi yang berani ambil ruang, bukan
          yang sopan menunggu ditanya.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Apa itu oud, dan kenapa aromanya begitu kuat?</h2>
        <p>
          Oud, atau kayu gaharu, adalah resin wangi yang terbentuk di pohon Aquilaria ketika pohonnya
          terinfeksi jamur secara alami. Prosesnya butuh bertahun-tahun dan tidak bisa dipaksa,
          makanya oud jadi salah satu bahan termahal di dunia parfum. Aromanya dalam, hangat, sedikit
          smoky, dan punya kehadiran yang susah diabaikan. Di dunia parfum, oud bukan sekadar notes,
          dia karakter.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Kenapa musk dan patchouli jadi pasangan oud?</h2>
        <p>
          Oud yang berdiri sendiri bisa terasa terlalu mentah. Musk memberi kehalusan yang bersih,
          patchouli memberi kedalaman yang gelap dan earthy. Bertiga, mereka membentuk base yang
          kuat, tahan lama, dan tetap wearable. Ini juga alasan parfum oud hampir selalu awet di
          kulit: ketiganya molekul berat yang menguap paling lambat.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Perjalanan aroma Oud Majesty</h2>
        <table className="article__table">
          <thead>
            <tr><th>Lapisan</th><th>Aroma Oud Majesty</th></tr>
          </thead>
          <tbody>
            <tr><td>Top notes</td><td>Peach dan apple blossom yang manis, magnetik</td></tr>
            <tr><td>Middle notes</td><td>Pineapple blossom, percikan playful</td></tr>
            <tr><td>Base notes</td><td>Wild rose, musk, patchouli, dan oud yang dalam</td></tr>
          </tbody>
        </table>
        <p>
          Dibuka manis dan menarik perhatian, ditutup dalam dan susah dilupakan. Karena Oud Majesty
          adalah <Link href="/journal/apa-itu-extrait-de-parfum">extrait de parfum</Link>, transisi
          antar <Link href="/journal/arti-top-middle-base-notes">lapisan notes</Link>-nya pelan dan
          kaya, dari pembuka yang playful sampai dry down yang berkarakter.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Kapan memakai parfum oud?</h2>
        <p>
          Malam hari, acara spesial, dan momen yang butuh kehadiran: dinner penting, party, atau
          panggung apa pun yang jadi milikmu. Aroma berat seperti oud memang paling hidup saat{" "}
          <Link href="/journal/parfum-malam-dan-parfum-pagi">malam</Link>, ketika suasananya intim
          dan wangimu boleh bicara lebih keras. Cukup 2 sampai 3 semprot di titik nadi.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Belum yakin ini kamu?</h2>
        <p>
          Kalau kamu ragu masuk persona yang mana, mulai dari karaktermu, bukan dari daftar notes.{" "}
          <Link href="/persona">Ikut kuis persona</Link>, atau langsung lihat{" "}
          <Link href="/products/oud-majesty">Oud Majesty</Link> lebih dekat.
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
          Empat persona Domanic kini lengkap. Temukan punyamu lewat{" "}
          <Link href="/persona">kuis persona</Link>, dan biarkan karaktermu yang menentukan aromanya.
        </p>
      </div>
    </article>
  );
}
