import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProduct, rupiah } from "@/lib/products";
import { getPersonaContent } from "@/lib/personas";
import AddToCart from "@/components/AddToCart";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const p = getProduct(params.slug);
  if (!p) return {};
  return {
    title: `${p.persona} · ${p.name} · DOMANIC`,
    description: p.tagline,
  };
}

const WHY = [
  ["/images/why-created.jpg", "Created, not cooked", "Dimulai dari persona dan cerita, baru aromanya disusun."],
  ["/images/why-time.jpg", "Time-crafted", "Berminggu maserasi, berbulan revisi. Luxury nggak bisa instan."],
  ["/images/why-matured.jpg", "Fully matured", "Diistirahatkan 2 sampai 4 minggu sebelum dibotolkan."],
];

export default function PersonaDetailPage({ params }) {
  const p = getProduct(params.slug);
  const c = getPersonaContent(params.slug);
  if (!p || !c) return notFound();

  const traits = p.character.split("·").map((t) => t.trim());
  const others = products.filter((x) => x.slug !== p.slug);

  return (
    <div className="pz" style={{ "--accent": c.accent }}>
      {/* 1. HERO */}
      <section className={"pz-hero" + (c.heroEditorial ? " pz-hero--editorial" : "") + (c.heroEditorialLight ? " pz-hero--editorial-light" : "") + (c.heroEditorialBlush ? " pz-hero--editorial-blush" : "")} style={{ backgroundImage: `url(${c.heroImg})` }}>
        <div className="pz-hero__scrim" />
        <div className="pz-hero__inner">
          <div className="pz-hero__content">
            <span className="pz-eyebrow">{p.persona}</span>
            <h1>{p.name}</h1>
            <div className="pz-rule" />
            <p className="pz-hero__tag">{p.tagline}</p>
            <p className="pz-hero__sub">{c.heroSub}</p>
            <div className="pz-hero__cta">
              <AddToCart product={p} className="btn btn--solid" label="Add to bag" />
              <Link className="btn btn--ghost" href="/persona">Cari persona-mu</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PORTRAIT */}
      <section className="wrap pz-portrait">
        <span className="pz-eyebrow">Ini kamu kalau</span>
        <p className="pz-portrait__lead">{c.portrait}</p>
        <div className="pz-chips">
          {traits.map((t) => <span className="pz-chip" key={t}>{t}</span>)}
        </div>
      </section>

      {/* 3. SIGNATURE SCENT */}
      <section className="pz-scent">
        <div className="wrap pz-scent__grid">
          <div className="pz-scent__media">
            <img src={p.image} alt={`Domanic ${p.name}`} />
          </div>
          <div className="pz-scent__body">
            <span className="pz-eyebrow">Signature scent</span>
            <h2>{p.name}</h2>
            <p className="pz-scent__story">{p.noteStory}</p>
            <div className="pz-scent__meta">
              <span className="pz-price">{rupiah(p.price)}</span>
              <span className="pz-size">{p.concentration} · {p.size}</span>
            </div>
            <div className="pz-scent__cta">
              <AddToCart product={p} className="btn btn--solid" label="Add to bag" />
              <Link className="btn btn--ghost" href={`/products/${p.slug}`}>Lihat detail</Link>
            </div>
            <p className="pz-scent__gift">{c.gift}</p>
          </div>
        </div>
      </section>

      {/* 4. NOTES + DRY-DOWN */}
      <section className="wrap pz-notes">
        <div className="sec__head">
          <p className="pz-eyebrow">Scent notes</p>
          <h2>Gimana wanginya berjalan</h2>
        </div>
        <div className="pz-notes__grid">
          <div className="pz-notes__chart">
            <img src={c.chartImg} alt={`Botanical chart ${p.name}`} />
          </div>
          <div className="pz-notes__text">
            <div className="pz-notes__row">
              <h4>Top <span>0 sampai 15 menit</span></h4>
              <p>{p.notes.top.join(", ")}</p>
            </div>
            <div className="pz-notes__row">
              <h4>Heart <span>15 menit sampai 2 jam</span></h4>
              <p>{p.notes.mid.join(", ")}</p>
            </div>
            <div className="pz-notes__row">
              <h4>Base <span>2 jam ke atas</span></h4>
              <p>{p.notes.base.join(", ")}</p>
            </div>
            <p className="pz-drydown">Cara pakai: semprot di titik nadi (pergelangan, leher, belakang telinga), jangan digosok. Kasih waktu minimal 20 menit sebelum menilai, karena karakter aslinya keluar pas dry down.</p>
          </div>
        </div>
      </section>

      {/* 5. OCCASION */}
      <section className="pz-occasion">
        <div className="wrap">
          <div className="sec__head">
            <p className="pz-eyebrow">Kapan dipakai</p>
            <h2>Paling pas buat momen ini</h2>
          </div>
          <div className="pz-occasion__grid">
            {c.occasion.map((o) => (
              <div className="pz-occasion__card" key={o.label}>
                {o.img ? (
                  <>
                    <div className={"pz-occasion__media" + (c.occasionEditorial ? " pz-occasion__media--editorial" : "")}><img src={o.img} alt={o.label} /></div>
                    <p>{o.label}</p>
                  </>
                ) : (
                  <div className="pz-occasion__plain">{o.label}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. THE CRAFT */}
      <section className="wrap pz-craft">
        <div className="sec__head">
          <p className="pz-eyebrow">Why Domanic</p>
          <h2>Kenapa worth it</h2>
        </div>
        <div className="pz-craft__grid">
          {WHY.map(([img, h, d]) => (
            <div className="pz-craft__item" key={h}>
              <div className="pz-craft__media"><img src={img} alt={h} /></div>
              <h3>{h}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. PAIRS WELL */}
      <section className="pz-pairs">
        <div className="wrap">
          <div className="sec__head">
            <p className="pz-eyebrow">Enak dilayer sama</p>
            <h2>Pasangan yang harmonis</h2>
          </div>
          <div className="pz-pairs__grid">
            {c.pairs.map((pair) => {
              const q = getProduct(pair.slug);
              if (!q) return null;
              return (
                <Link className="pz-pairs__card" href={`/persona/${q.slug}`} key={q.slug}>
                  <div className="pz-pairs__media"><img src={q.image} alt={q.name} /></div>
                  <div className="pz-pairs__txt">
                    <h4>{q.name}</h4>
                    <p>{pair.note}</p>
                  </div>
                </Link>
              );
            })}
          </div>
          <p className="pz-pairs__tip">Cara layer: semprot yang ringan dulu sebagai base, baru tambah wangi yang lebih dalam di atasnya.</p>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="wrap pz-faq">
        <div className="sec__head">
          <p className="pz-eyebrow">Masih ragu?</p>
          <h2>Yang sering ditanya</h2>
        </div>
        <div className="pz-faq__list">
          {c.faq.map((f) => (
            <details className="pz-faq__item" key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
        <div className="pz-assure">
          <span>Extrait De Parfum</span>
          <span>Gratis ongkir di atas Rp 500.000</span>
          <span>Garansi 30 hari</span>
        </div>
      </section>

      {/* 9. OTHER PERSONAS */}
      <section className="pz-others">
        <div className="wrap">
          <div className="sec__head">
            <p className="pz-eyebrow">Bukan kamu?</p>
            <h2>Kenalan sama persona lain</h2>
          </div>
          <div className="pz-others__grid">
            {others.map((o) => (
              <Link className="pz-others__card" href={`/persona/${o.slug}`} key={o.slug}>
                <div className="pz-others__media"><img src={o.image} alt={o.name} /></div>
                <span className="pz-others__persona">{o.persona}</span>
                <h4>{o.name}</h4>
              </Link>
            ))}
          </div>
          <Link className="pz-others__retry" href="/persona">Ulang kuis 60 detik</Link>
        </div>
      </section>

      {/* 10. CLOSING CTA */}
      <section className="pz-closing">
        <div className="wrap pz-closing__inner">
          <h2>{p.name}</h2>
          <p>{p.tagline}</p>
          <AddToCart product={p} className="btn btn--solid" label={`Add to bag · ${rupiah(p.price)}`} />
        </div>
      </section>
    </div>
  );
}
