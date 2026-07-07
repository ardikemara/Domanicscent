import Link from "next/link";

const ctaProducts = [
  { slug: "velvet-rum", name: "Velvet Rum", line: "Gourmand, dark, sensual", img: "/images/velvet-card-photo.webp" },
  { slug: "lily-wood", name: "Lily Wood", line: "Fresh buat sehari-hari", img: "/images/lily-card-photo.webp" },
  { slug: "whisper", name: "Whisper", line: "Floral lembut, elegan", img: "/images/whisper-card-photo.webp" },
  { slug: "oud-majesty", name: "Oud Majesty", line: "Parfum oud, bold", img: "/images/oud-card-photo.webp" },
];

export default function ArticleProductCta() {
  return (
    <section className="article__products">
      <p className="eyebrow">Lihat produknya</p>
      <h2>Empat extrait de parfum Domanic</h2>
      <div className="article__prodgrid">
        {ctaProducts.map((c) => (
          <Link key={c.slug} href={`/products/${c.slug}`} className="article__prodcard">
            <img src={c.img} alt={`Domanic ${c.name}, extrait de parfum`} width="400" height="500" loading="lazy" />
            <b>{c.name}</b>
            <span>{c.line}</span>
            <span className="article__prodprice">Rp 329.000 · 50 ml</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
