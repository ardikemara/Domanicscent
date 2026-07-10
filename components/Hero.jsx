import Link from "next/link";

const Q = {
  velvet: {
    slug: "velvet-rum", color: "#3D2B21", bottle: "/images/mosaic/bottle-velvet.webp",
    tiles: [
      { img: "/images/mosaic/v-m1.webp", alt: "Menuang espresso malam hari" },
      { img: "/images/mosaic/v-macro.webp", alt: "Espresso dan dark chocolate" },
      { img: "/images/mosaic/v-obj.webp", alt: "Buku dan kacamata baca" },
      { img: "/images/mosaic/v-m2.webp", alt: "Siluet membaca di dekat lampu" },
      { img: "/images/mosaic/v-tex.webp", alt: "Tekstur knit cocoa" },
    ],
  },
  lily: {
    slug: "lily-wood", color: "#9FAE8C", bottle: "/images/mosaic/bottle-lily.webp",
    tiles: [
      { img: "/images/mosaic/l-tex.webp", alt: "Linen tertiup angin" },
      { img: "/images/mosaic/l-macro.webp", alt: "Leci dan bergamot segar" },
      { img: "/images/mosaic/l-m1.webp", alt: "Pagi di balkon" },
      { img: "/images/mosaic/l-m2.webp", alt: "Sepeda dan iced coffee" },
      { img: "/images/mosaic/l-obj.webp", alt: "Bayangan daun di dinding" },
    ],
  },
  whisper: {
    slug: "whisper", color: "#E3CDC1", bottle: "/images/mosaic/bottle-whisper.webp",
    tiles: [
      { img: "/images/mosaic/w-m1.webp", alt: "Cahaya lewat tirai sheer" },
      { img: "/images/mosaic/w-tex.webp", alt: "Tekstur silk ivory" },
      { img: "/images/mosaic/w-macro.webp", alt: "Melati dan pear" },
      { img: "/images/mosaic/w-m2.webp", alt: "Secangkir teh" },
      { img: "/images/mosaic/w-obj.webp", alt: "Mutiara dan gold" },
    ],
  },
  oud: {
    slug: "oud-majesty", color: "#262C38", bottle: "/images/mosaic/bottle-oud.webp",
    tiles: [
      { img: "/images/mosaic/o-bokeh.webp", alt: "City lights malam" },
      { img: "/images/mosaic/o-macro.webp", alt: "Peach dan wild rose" },
      { img: "/images/mosaic/o-m1.webp", alt: "Merapikan blazer" },
      { img: "/images/mosaic/o-obj.webp", alt: "Jam tangan dan cufflinks" },
      { img: "/images/mosaic/o-tex.webp", alt: "Tekstur wool midnight" },
    ],
  },
};

function Tile({ q, i, area, extra }) {
  const t = Q[q].tiles[i];
  return (
    <Link href={`/persona/${Q[q].slug}`} className={`mz__tile${extra ? " mz__tile--deskonly" : ""}`} style={{ gridArea: area }}>
      <img src={t.img} alt={t.alt} loading="eager" />
    </Link>
  );
}

function BottleTile({ q, area }) {
  const g = Q[q];
  return (
    <Link href={`/persona/${g.slug}`} className="mz__tile mz__tile--bottle" style={{ gridArea: area, background: g.color }}>
      <img src={g.bottle} alt={`Botol Domanic ${g.slug}`} loading="eager" />
    </Link>
  );
}

export default function Hero() {
  return (
    <section className="mz" aria-label="Domanic signature collection">
      {/* velvet quadrant */}
      <Tile q="velvet" i={0} area="v1" /><Tile q="velvet" i={1} area="v2" />
      <Tile q="velvet" i={2} area="v3" /><Tile q="velvet" i={3} area="v4" extra />
      <Tile q="velvet" i={4} area="v5" extra /><BottleTile q="velvet" area="vb" />
      {/* lily quadrant */}
      <Tile q="lily" i={0} area="l1" /><Tile q="lily" i={1} area="l2" />
      <Tile q="lily" i={2} area="l3" /><Tile q="lily" i={3} area="l4" extra />
      <Tile q="lily" i={4} area="l5" extra /><BottleTile q="lily" area="lb" />
      {/* whisper quadrant */}
      <Tile q="whisper" i={0} area="w1" /><Tile q="whisper" i={1} area="w2" />
      <Tile q="whisper" i={2} area="w3" /><Tile q="whisper" i={3} area="w4" extra />
      <Tile q="whisper" i={4} area="w5" extra /><BottleTile q="whisper" area="wb" />
      {/* oud quadrant */}
      <Tile q="oud" i={0} area="o1" /><Tile q="oud" i={1} area="o2" />
      <Tile q="oud" i={2} area="o3" /><Tile q="oud" i={3} area="o4" extra />
      <Tile q="oud" i={4} area="o5" extra /><BottleTile q="oud" area="ob" />

      <div className="mz__text" style={{ gridArea: "tx" }}>
        <span className="eyebrow">Extrait De Parfum · Signature Collection</span>
        <h1>A scent for <em>who you are.</em></h1>
        <p className="mz__sub">
          Extrait de parfum dari Indonesia, dibuat pelan dan fully macerated. Empat persona, satu yang paling kamu banget.
        </p>
        <div className="mz__cta">
          <Link className="btn btn--solid" href="/#collection">Lihat collection</Link>
          <Link className="btn btn--ghost" href="/persona">Cari persona-mu</Link>
        </div>
      </div>
    </section>
  );
}
