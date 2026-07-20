import Link from "next/link";
import ArticleProductCta from "@/components/ArticleProductCta";
import { getArticle } from "@/lib/journal";

const meta = getArticle("cara-pakai-parfum-biar-tahan-lama");

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
    images: [{ url: "/images/journal/pakai-parfum-artikel-hero.jpg", width: 1200, height: 800 }],
  },
  twitter: { card: "summary_large_image" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: meta.title,
  description: meta.description,
  datePublished: meta.date,
  image: ["https://www.domanicscent.com/images/journal/pakai-parfum-artikel-hero.jpg"],
  author: { "@type": "Organization", name: "Domanic Scent" },
  publisher: { "@type": "Organization", name: "Domanic Scent", url: "https://www.domanicscent.com" },
  mainEntityOfPage: `https://www.domanicscent.com/journal/${meta.slug}`,
  inLanguage: "id-ID",
};

const articleFaqs = [
  {
    q: "Gimana cara pakai parfum biar tahan lama?",
    a: "Semprot di titik nadi (pergelangan tangan, leher, belakang telinga) saat kulit masih lembap setelah mandi, jangan digosok, dan pilih konsentrasi tinggi seperti extrait de parfum. Kulit lembap dan berminyak mengikat wangi lebih lama dibanding kulit kering.",
  },
  {
    q: "Kenapa parfum cepat hilang di cuaca panas?",
    a: "Panas dan lembap bikin molekul aroma menguap lebih cepat, apalagi parfum berkadar alkohol tinggi seperti EDT. Di iklim tropis Indonesia, extrait de parfum yang kadar minyaknya tinggi dan alkoholnya rendah jauh lebih tahan.",
  },
  {
    q: "Apakah menggosok pergelangan tangan bikin parfum lebih awet?",
    a: "Justru sebaliknya. Menggosok memecah molekul aroma dan mempercepat top notes menguap, jadi wanginya malah cepat hilang. Cukup semprot dan biarkan kering sendiri.",
  },
  {
    q: "Berapa semprot yang ideal untuk extrait de parfum?",
    a: "Karena pekat, 2 sampai 4 semprot di titik nadi sudah cukup untuk seharian. Lebih dari itu bukan bikin lebih tahan, cuma bikin lebih kuat di awal.",
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
      <h1>Cara Pakai Parfum Biar Tahan Lama di Cuaca Indonesia</h1>
      <p className="article__meta">{meta.dateDisplay} · {meta.readTime} baca</p>

      <p className="infopage__lead">
        Cara pakai parfum biar tahan lama adalah dengan menyemprot di titik nadi saat kulit masih
        lembap, tidak menggosoknya, dan memilih konsentrasi tinggi seperti extrait de parfum. Di
        cuaca panas dan lembap Indonesia, tiga hal ini yang menentukan wangimu bertahan sampai malam
        atau hilang sebelum makan siang.
      </p>

      <figure className="article__fig">
        <img src="/images/journal/pakai-parfum-artikel-hero.jpg" alt="Menyemprot extrait de parfum Domanic di pergelangan tangan sebagai titik nadi biar tahan lama" width="1200" height="800" loading="lazy" />
        <figcaption>Titik nadi, kulit lembap, tanpa digosok. Tiga hal kecil yang bikin beda.</figcaption>
      </figure>

      <section className="infopage__item">
        <h2>Semprot di titik nadi, bukan di baju</h2>
        <p>
          Titik nadi adalah tempat pembuluh darah dekat permukaan kulit, jadi lebih hangat dan
          membantu wangi menyebar pelan sepanjang hari. Fokus di sini, bukan di baju yang malah bikin
          wangi mati begitu ganti pakaian:
        </p>
        <table className="article__table">
          <thead>
            <tr><th>Titik semprot</th><th>Kenapa efektif</th></tr>
          </thead>
          <tbody>
            <tr><td>Pergelangan tangan</td><td>Hangat, sering dekat dengan hidung orang lain</td></tr>
            <tr><td>Leher &amp; belakang telinga</td><td>Menyebar tiap kamu bergerak</td></tr>
            <tr><td>Lekukan siku dalam</td><td>Hangat dan tersembunyi, wangi awet</td></tr>
            <tr><td>Belakang lutut (opsional)</td><td>Aroma naik pelan dari bawah</td></tr>
          </tbody>
        </table>
      </section>

      <section className="infopage__item">
        <h2>Pakai saat kulit lembap, jangan digosok</h2>
        <p>
          Waktu terbaik menyemprot parfum adalah setelah mandi, saat kulit masih sedikit lembap.
          Kulit yang lembap dan sedikit berminyak mengikat molekul aroma lebih lama dibanding kulit
          kering. Kalau kulitmu cenderung kering, oles pelembap tanpa pewangi dulu sebelum semprot.
        </p>
        <p>
          Dan ini yang paling sering salah: <b>jangan gosok pergelangan tangan setelah semprot</b>.
          Menggosok memecah molekul aroma dan mempercepat <Link href="/journal/arti-top-middle-base-notes">top
          notes</Link> menguap. Cukup semprot, biarkan kering sendiri.
        </p>
        <figure className="article__fig article__fig--notes">
          <img src="/images/journal/pakai-parfum-artikel-notes.jpg" alt="Extrait de parfum Domanic Lily Wood dibiarkan kering sendiri di pergelangan tangan tanpa digosok" width="960" height="960" loading="lazy" />
          <figcaption>Biarkan kering sendiri. Digosok justru bikin wangi cepat hilang.</figcaption>
        </figure>
      </section>

      <section className="infopage__item">
        <h2>Kenapa cuaca Indonesia bikin parfum cepat hilang</h2>
        <p>
          Panas dan lembap mempercepat penguapan. Parfum berkadar alkohol tinggi seperti EDT paling
          kena dampaknya, makanya wangi yang enak di mall bisa hilang sebelum siang. Solusinya ada di
          konsentrasi: makin tinggi kadar minyak wangi dan makin rendah alkoholnya, makin tahan di
          cuaca tropis. Ini bedanya bisa kamu baca lengkap di{" "}
          <Link href="/journal/perbedaan-edp-dan-edt">perbedaan EDP dan EDT</Link>. Istilah
          performa seperti{" "}
          <Link href="/journal/kamus-istilah-parfum#longevity">longevity</Link> dan{" "}
          <Link href="/journal/kamus-istilah-parfum#sillage">sillage</Link> bisa kamu cek di kamus
          istilah parfum.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Kenapa extrait Domanic tahan lebih lama</h2>
        <p>
          Semua parfum Domanic adalah{" "}
          <Link href="/journal/apa-itu-extrait-de-parfum">extrait de parfum</Link>, konsentrasi
          paling tinggi dengan alkohol paling rendah, jadi memang dirancang untuk bertahan di iklim
          seperti Indonesia. Ditambah tiap batch dimaserasi 2 sampai 4 minggu supaya karakternya
          matang dan stabil. Cukup 2 sampai 4 semprot di titik nadi, aromanya menemani sampai malam.
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
          Artikel berikutnya di Journal: parfum untuk kamu yang paling hidup pas malam sepi, The
          Midnight Intellectual.
        </p>
      </div>
    </article>
  );
}
