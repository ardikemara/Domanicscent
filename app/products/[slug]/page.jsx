import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProduct, rupiah } from "@/lib/products";
import AddToCart from "@/components/AddToCart";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const p = getProduct(params.slug);
  if (!p) return {};
  return {
    title: `${p.name} · DOMANIC`,
    description: p.tagline,
  };
}

export default function ProductPage({ params }) {
  const p = getProduct(params.slug);
  if (!p) return notFound();

  return (
    <div className="wrap pdp">
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

      <div className="pdp__story">
        <h3>The story</h3>
        <p>{p.story}</p>
      </div>
    </div>
  );
}
