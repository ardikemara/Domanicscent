import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProduct, rupiah } from "@/lib/products";
import AddToCart from "@/components/AddToCart";
import ScentNotes from "@/components/ScentNotes";
import ScentStory from "@/components/ScentStory";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const p = getProduct(params.slug);
  if (!p) return {};
  const title = p.seo?.title || `${p.name} · DOMANIC`;
  const description = p.seo?.description || p.tagline;
  return {
    title,
    description,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: {
      type: "website",
      url: `/products/${p.slug}`,
      title,
      description,
      images: [{ url: p.image, width: 1200, height: 900, alt: `Domanic ${p.name}, ${p.concentration}` }],
    },
    twitter: { card: "summary_large_image" },
  };
}

function productJsonLd(p) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Domanic ${p.name}`,
    image: [`https://www.domanicscent.com${p.image}`],
    description: p.seo?.description || p.tagline,
    brand: { "@type": "Brand", name: "Domanic Scent" },
    category: "Extrait de Parfum",
    offers: {
      "@type": "Offer",
      url: `https://www.domanicscent.com/products/${p.slug}`,
      priceCurrency: "IDR",
      price: p.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

export default function ProductPage({ params }) {
  const p = getProduct(params.slug);
  if (!p) return notFound();

  return (
    <div className="wrap pdp">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(p)) }}
      />
      <Link href="/#collection" className="pdp__back">← Kembali ke collection</Link>

      <div className="pdp__top">
        <div className="pdp__media">
          <img src={p.image} alt={`Domanic ${p.name}`} />
        </div>
        <div>
          <p className="pdp__persona">{p.persona}</p>
          <h1>{p.name}</h1>
          <p className="pdp__char">{p.character}</p>
          <p className="pdp__tag">{p.tagline}</p>

          <div className="pdp__meta">
            <span className="pdp__price">{rupiah(p.price)}</span>
            <span className="pdp__size">{p.concentration} · {p.size}</span>
          </div>

          <div className="pdp__cta">
            <AddToCart product={p} className="btn btn--solid" label="Add to bag" />
            <Link className="btn btn--ghost" href="/persona">Cari persona-mu</Link>
          </div>
          <p className="pdp__note">Gratis ongkir di atas Rp 500.000 · Garansi 30 hari</p>

          <div className="pdp__detailrow">
            <div className="pdp__detail">
              <b>Best worn</b>
              <span>{p.bestWorn}</span>
            </div>
            <div className="pdp__detail">
              <b>Persona</b>
              <span>{p.persona}</span>
            </div>
          </div>
        </div>
      </div>

      {p.noteScene ? (
        <ScentStory product={p} />
      ) : p.noteImg ? (
        <ScentNotes product={p} />
      ) : (
        <div className="pyramid">
          <div className="pyramid__col">
            <h4>Top notes</h4>
            <ul>{p.notes.top.map((n) => <li key={n}>{n}</li>)}</ul>
          </div>
          <div className="pyramid__col">
            <h4>Heart notes</h4>
            <ul>{p.notes.mid.map((n) => <li key={n}>{n}</li>)}</ul>
          </div>
          <div className="pyramid__col">
            <h4>Base notes</h4>
            <ul>{p.notes.base.map((n) => <li key={n}>{n}</li>)}</ul>
          </div>
        </div>
      )}

      <div className="pdp__story">
        <h3>The story</h3>
        <p>{p.story}</p>
      </div>
    </div>
  );
}
