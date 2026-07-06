import Hero from "@/components/Hero";
import {
  Collection,
  PersonaTeaser,
  WhyDomanic,
  Story,
  Reassurance,
  Newsletter,
} from "@/components/Sections";

export const metadata = {
  alternates: { canonical: "/" },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Domanic Scent",
  url: "https://www.domanicscent.com",
  description:
    "Brand extrait de parfum lokal premium dari Indonesia. Setiap parfum dibuat dari persona dan fully macerated 2-4 minggu sebelum dibotolkan.",
  slogan: "Wear your identity",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "DOMANIC",
  url: "https://www.domanicscent.com",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Hero />
      <Collection />
      <PersonaTeaser />
      <WhyDomanic />
      <Story />
      <Reassurance />
      <Newsletter />
    </>
  );
}
