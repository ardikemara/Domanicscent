import Link from "next/link";
import ArticleProductCta from "@/components/ArticleProductCta";
import { getArticle } from "@/lib/journal";

const meta = getArticle("parfum-wanita-tahan-lama");

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
    images: [{ url: "/images/journal/wanita-tahan-lama-artikel-hero.jpg", width: 1200, height: 800 }],
  },
  twitter: { card: "summary_large_image" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: meta.title,
  description: meta.description,
  datePublished: meta.date,
  image: ["https://www.domanicscent.com/images/journal/wanita-tahan-lama-artikel-hero.jpg"],
  author: { "@type": "Organization", name: "Domanic Scent" },
  publisher: { "@type": "Organization", name: "Domanic Scent", url: "https://www.domanicscent.com" },
  mainEntityOfPage: `https://www.domanicscent.com/journal/${meta.slug}`,
  inLanguage: "id-ID",
};

const articleFaqs = [
  {
    q: "Parfum wanita apa yang tahan lama?",
    a: "Yang konsentrasinya tinggi dan punya base notes berat. Extrait de parfum dengan dasar vanilla, sandalwood, musk, atau patchouli bertahan jauh lebih lama daripada EDT floral yang ringan. Kekuatan aroma di awal tidak menjamin ketahanan.",
  },
  {
    q: "Kenapa parfum floral cepat hilang?",
    a: "Karena floral dan citrus adalah notes ringan yang menguap cepat. Parfum floral bisa terasa indah di 30 menit pertama lalu memudar, kecuali ditopang base notes yang berat dan konsentrasi tinggi supaya ada yang menahan.",
  },
  {
    q: "Apakah parfum manis lebih tahan lama?",
    a: "Cenderung iya. Aroma manis seperti vanilla dan gourmand berasal dari molekul yang lebih berat, jadi bertahan lebih lama di kulit dibanding citrus atau floral ringan. Itu sebabnya parfum sweet sering terasa awet.",
  },
  {
    q: "Di mana sebaiknya menyemprot parfum?",
    a: "Di titik nadi: pergelangan tangan, leher, belakang telinga, dan lekukan siku. Paling optimal setelah mandi saat kulit masih lembap, dan jangan digosok supaya molekulnya tidak pecah.",
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
      <h1>Parfum Wanita Tahan Lama: Panduan Memilih yang Bertahan Seharian</h1>
      <p className="article__meta">{meta.dateDisplay} · {meta.readTime} baca</p>

      <p className="infopage__lead">
        Parfum wanita yang tahan lama bukan soal seberapa kuat aromanya, tapi soal konsentrasi dan
        base notes-nya. Banyak parfum floral terasa indah di awal lalu memudar dalam satu jam karena
        notes-nya ringan dan konsentrasinya rendah. Rahasianya ada di fondasi yang berat dan kadar
        minyak wangi yang tinggi.
      </p>

      <figure className="article__fig">
        <img src="/images/journal/wanita-tahan-lama-artikel-hero.jpg" alt="Parfum wanita tahan lama Domanic Whisper dengan base vanilla dan sandalwood yang bertahan seharian" width="1200" height="800" loading="lazy" />
        <figcaption>Kunci ketahanan bukan aroma kuat, tapi base notes dan konsentrasi.</figcaption>
      </figure>

      <section className="infopage__item">
        <h2>Kenapa parfum wanita sering cepat hilang</h2>
        <p>
          Aroma yang identik dengan parfum wanita, seperti floral dan citrus, kebetulan adalah notes
          yang paling ringan dan paling cepat menguap. Ditambah kebanyakan dijual sebagai EDT dengan
          konsentrasi rendah, wajar kalau wanginya hilang cepat, apalagi di cuaca panas.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Konsentrasi menentukan ketahanan</h2>
        <table className="article__table">
          <thead>
            <tr><th>Jenis</th><th>Kadar minyak wangi</th><th>Ketahanan</th></tr>
          </thead>
          <tbody>
            <tr><td>Eau de Toilette (EDT)</td><td>±5-15%</td><td>Beberapa jam</td></tr>
            <tr><td>Eau de Parfum (EDP)</td><td>±15-20%</td><td>Setengah hari</td></tr>
            <tr><td><b>Extrait de Parfum</b></td><td><b>±20-40%</b></td><td><b>Sampai malam</b></td></tr>
          </tbody>
        </table>
        <p>
          Lebih lengkap di{" "}
          <Link href="/journal/apa-itu-extrait-de-parfum">apa itu extrait de parfum</Link>.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Rahasianya ada di base notes</h2>
        <p>
          Yang bikin parfum wanita bertahan bukan floral-nya, tapi apa yang menopang di bawahnya.
          Vanilla, sandalwood, musk, dan patchouli adalah base notes berat yang menahan aroma tetap
          di kulit sampai malam. Parfum manis (sweet) sering terasa lebih awet justru karena vanilla
          dan gourmand-nya berat. Whisper, misalnya, floral yang lembut tapi ditopang vanilla dan
          sandalwood yang hangat.
        </p>
        <figure className="article__fig article__fig--notes">
          <img src="/images/journal/wanita-tahan-lama-artikel-notes.jpg" alt="Base notes yang bikin parfum wanita tahan lama: vanilla, sandalwood, musk" width="960" height="960" loading="lazy" />
          <figcaption>Vanilla, sandalwood, musk: fondasi yang menahan floral tetap di kulit.</figcaption>
        </figure>
      </section>

      <section className="infopage__item">
        <h2>Cara pakai dan kenapa maserasi penting</h2>
        <p>
          Semprot di titik nadi setelah mandi, jangan digosok (
          <Link href="/journal/cara-pakai-parfum-biar-tahan-lama">panduan lengkapnya di sini</Link>).
          Dan satu hal yang menentukan tapi jarang dibahas: kematangan formula. Parfum yang{" "}
          <Link href="/journal/maserasi-parfum">dimaserasi 2 sampai 4 minggu</Link> punya karakter
          yang lebih stabil dan tahan lama, bukan yang pecah di tengah jalan.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Sebenarnya aroma tidak punya gender</h2>
        <p>
          "Parfum wanita" itu label rak toko, bukan aturan. Whisper yang floral lembut atau Lily Wood
          yang fresh dengan fondasi woody sama-sama tahan lama, dan keduanya soal karaktermu, bukan
          gender. Cara paling jujur menemukan punyamu adalah{" "}
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
          Artikel berikutnya di Journal: kenapa aroma yang sama terasa beda di pagi dan malam.
        </p>
      </div>
    </article>
  );
}
