import Link from "next/link";
import ArticleProductCta from "@/components/ArticleProductCta";
import { getArticle } from "@/lib/journal";

const meta = getArticle("parfum-untuk-the-graceful-muse");

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
    images: [{ url: "/images/journal/graceful-muse-artikel-hero.jpg", width: 1200, height: 800 }],
  },
  twitter: { card: "summary_large_image" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: meta.title,
  description: meta.description,
  datePublished: meta.date,
  image: ["https://www.domanicscent.com/images/journal/graceful-muse-artikel-hero.jpg"],
  author: { "@type": "Organization", name: "Domanic Scent" },
  publisher: { "@type": "Organization", name: "Domanic Scent", url: "https://www.domanicscent.com" },
  mainEntityOfPage: `https://www.domanicscent.com/journal/${meta.slug}`,
  inLanguage: "id-ID",
};

const articleFaqs = [
  {
    q: "Parfum apa yang cocok untuk wanita yang anggun dan elegan?",
    a: "Parfum floral lembut dengan dasar vanilla dan sandalwood biasanya paling pas. Aroma seperti ini terasa feminin dan halus, berkesan tanpa perlu berisik, cocok untuk kepribadian yang anggun dan tenang.",
  },
  {
    q: "Apa itu parfum vanilla?",
    a: "Parfum vanilla adalah parfum yang aroma vanilla-nya menonjol, biasanya di base notes. Vanilla memberi kesan hangat, manis lembut, dan menenangkan. Sering dipadukan dengan floral atau kayu supaya tidak terlalu manis dan tetap elegan.",
  },
  {
    q: "Kenapa Whisper cocok untuk acara spesial?",
    a: "Karena karakternya floral lembut dan elegan, Whisper terasa pas untuk momen yang butuh kesan anggun, dari acara siang sampai malam. Wanginya halus dan intim, bukan yang memenuhi ruangan, jadi berkesan tanpa berlebihan.",
  },
  {
    q: "Whisper wanginya seperti apa?",
    a: "Dibuka lembut dengan pir dan mirabelle, lalu melati dan freesia mekar anggun di tengah, dan ditutup vanilla serta sandalwood yang hangat. Sebagai extrait de parfum, transisinya pelan dan tahan lama di kulit.",
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
      <h1>Parfum untuk The Graceful Muse</h1>
      <p className="article__meta">{meta.dateDisplay} · {meta.readTime} baca</p>

      <p className="infopage__lead">
        Parfum yang cocok untuk The Graceful Muse adalah parfum vanilla floral yang lembut dan elegan,
        floral yang mekar anggun dengan dasar vanilla yang hangat. Buat kamu yang anggun dan tenang,
        wangimu bukan yang teriak, tapi yang membekas halus setelah kamu lewat. Di Domanic, itu
        Whisper.
      </p>

      <figure className="article__fig">
        <img src="/images/journal/graceful-muse-artikel-hero.jpg" alt="Suasana elegan The Graceful Muse dengan extrait de parfum vanilla floral Domanic Whisper" width="1200" height="800" loading="lazy" />
        <figcaption>Keanggunan yang nggak perlu bersuara keras. Itu The Graceful Muse.</figcaption>
      </figure>

      <section className="infopage__item">
        <h2>Siapa The Graceful Muse</h2>
        <p>
          Kamu tenang, anggun, dan berkesan tanpa berusaha. Kehadiranmu halus tapi diingat, seperti
          orang yang bicara pelan tapi semua orang mendengar. Kepribadian seperti ini butuh wangi yang
          feminin dan lembut, bukan yang manis berlebihan atau berat menuntut perhatian.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Kenapa parfum vanilla floral yang cocok</h2>
        <p>
          Vanilla memberi kehangatan yang menenangkan, sementara floral lembut memberi keanggunan.
          Gabungan keduanya menghasilkan wangi yang elegan dan intim, dekat ke kulit, bukan yang
          menyebar memenuhi ruangan. Ini sejalan dengan cara The Graceful Muse hadir: halus, tenang,
          dan membekas.
        </p>
        <table className="article__table">
          <thead>
            <tr><th>Lapisan</th><th>Aroma Whisper</th></tr>
          </thead>
          <tbody>
            <tr><td>Top notes</td><td>Pir dan mirabelle yang lembut</td></tr>
            <tr><td>Middle notes</td><td>Egyptian jasmine, freesia (floral)</td></tr>
            <tr><td>Base notes</td><td>Vanilla dan sandalwood yang hangat</td></tr>
          </tbody>
        </table>
        <p>
          Karena Whisper adalah{" "}
          <Link href="/journal/apa-itu-extrait-de-parfum">extrait de parfum</Link>, transisi antar{" "}
          <Link href="/journal/arti-top-middle-base-notes">lapisan notes</Link> terasa pelan dan
          halus, dari floral yang mekar sampai vanilla yang menutup dengan tenang.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Kapan paling pas dipakai</h2>
        <p>
          Whisper cocok buat momen yang butuh kesan anggun: acara spesial, dari siang ke malam,
          dinner, atau saat kamu pengen merasa elegan tanpa berlebihan. Cukup beberapa semprot di
          titik nadi, dan keanggunannya menemani seharian.
        </p>
        <figure className="article__fig article__fig--notes">
          <img src="/images/journal/graceful-muse-artikel-scene.jpg" alt="Whisper dipakai untuk momen elegan, extrait de parfum vanilla floral Domanic" width="960" height="960" loading="lazy" />
          <figcaption>Halus, feminin, dan berkesan. Wangi buat momen yang anggun.</figcaption>
        </figure>
      </section>

      <section className="infopage__item">
        <h2>Belum yakin ini kamu?</h2>
        <p>
          Kalau kamu ragu masuk persona yang mana, mulai dari karaktermu, bukan dari daftar notes.{" "}
          <Link href="/journal/cara-memilih-parfum-sesuai-kepribadian">Baca cara memilih parfum
          sesuai kepribadian</Link>, ikut <Link href="/persona">kuisnya</Link>, atau langsung lihat{" "}
          <Link href="/products/whisper">Whisper</Link> lebih dekat.
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
          Empat persona, empat wangi. Temukan punyamu lewat <Link href="/persona">kuis persona</Link>,
          dan biarkan karaktermu yang menentukan aromanya.
        </p>
      </div>
    </article>
  );
}
