import Link from "next/link";
import { rupiah } from "@/lib/products";
import AddToCart from "@/components/AddToCart";

export default function ProductCard({ p }) {
  return (
    <article className="card">
      <Link href={`/products/${p.slug}`} className="card__media">
        <img src={p.image} alt={`Domanic ${p.name}`} loading="lazy" />
      </Link>
      <div className="card__body">
        <p className="card__persona">{p.persona}</p>
        <h3 className="card__name">
          <Link href={`/products/${p.slug}`}>{p.name}</Link>
        </h3>
        <p className="card__char">{p.character}</p>
        <p className="card__tag">{p.tagline}</p>
        <div className="card__foot">
          <span className="card__price">{rupiah(p.price)}</span>
          <AddToCart product={p} className="card__add" label="Add to bag" />
        </div>
      </div>
    </article>
  );
}
