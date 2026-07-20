import ArticleProductCta from "@/components/ArticleProductCta";
import KamusGlossary from "@/components/KamusGlossary";
import { glossaryTerms } from "@/lib/glossary";

export const metadata = {
  title: "Kamus Istilah Parfum: 54 Istilah yang Perlu Kamu Tahu · DOMANIC",
  description:
    "Kamus lengkap istilah parfum dalam bahasa Indonesia. Dari sillage, dry down, maserasi, sampai slang komunitas seperti nempel dan meledak.",
  alternates: { canonical: "/journal/kamus-istilah-parfum" },
  openGraph: {
    type: "article",
    url: "/journal/kamus-istilah-parfum",
    title: "Kamus Istilah Parfum: 54 Istilah yang Perlu Kamu Tahu",
    description:
      "Kamus lengkap istilah parfum dalam bahasa Indonesia. Dari sillage, dry down, maserasi, sampai slang komunitas seperti nempel dan meledak.",
  },
  twitter: { card: "summary_large_image" },
};

const glossaryJsonLd = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "Kamus Istilah Parfum",
  description: "Kamus lengkap istilah parfum dalam bahasa Indonesia",
  url: "https://www.domanicscent.com/journal/kamus-istilah-parfum",
  inLanguage: "id-ID",
  hasDefinedTerm: glossaryTerms.map((t) => ({
    "@type": "DefinedTerm",
    name: t.term,
    description: t.definition,
    url: `https://www.domanicscent.com/journal/kamus-istilah-parfum#${t.id}`,
    inDefinedTermSet: "https://www.domanicscent.com/journal/kamus-istilah-parfum",
  })),
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Kamus Istilah Parfum: 54 Istilah yang Perlu Kamu Tahu",
  description:
    "Kamus lengkap istilah parfum dalam bahasa Indonesia. Dari sillage, dry down, maserasi, sampai slang komunitas seperti nempel dan meledak.",
  datePublished: "2026-07-15",
  author: { "@type": "Organization", name: "Domanic Scent" },
  publisher: { "@type": "Organization", name: "Domanic Scent", url: "https://www.domanicscent.com" },
  mainEntityOfPage: "https://www.domanicscent.com/journal/kamus-istilah-parfum",
  inLanguage: "id-ID",
};

export default function KamusPage() {
  return (
    <article className="wrap infopage article kamuspage">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(glossaryJsonLd) }}
      />
      <p className="eyebrow">Rujukan</p>
      <h1>Kamus Istilah Parfum</h1>

      <p className="infopage__lead">
        Dunia parfum punya bahasanya sendiri. Sillage, dry down, maserasi, notes. Istilah-istilah
        ini sering dipakai seolah semua orang sudah paham, padahal buat yang baru mulai, semuanya
        terdengar asing.
      </p>
      <p>
        Kamus ini kami susun sebagai rujukan terbuka: 54 istilah parfum, dari yang paling teknis
        sampai slang yang cuma dipakai komunitas fragrance Indonesia. Gratis dipakai, gratis
        dirujuk. Kalau ada istilah yang belum masuk, kabari kami.
      </p>

      <KamusGlossary />

      <ArticleProductCta />
    </article>
  );
}
