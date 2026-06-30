import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero">
      <img className="hero__bg" src="/images/hero.jpg" alt="Koleksi 4 parfum Domanic di atas kain silk" />
      <div className="hero__scrim" />
      <div className="hero__inner">
        <div className="hero__content">
          <span className="eyebrow">Extrait De Parfum · Signature Collection</span>
          <h1>A scent for <em>who you are.</em></h1>
          <div className="rule rule--left" />
          <p className="hero__sub">
            Wangi untuk jadi dirimu. Empat parfum, empat persona, satu yang paling kamu banget.
          </p>
          <div className="hero__cta">
            <Link className="btn btn--solid" href="/#collection">Lihat collection</Link>
            <Link className="btn btn--ghost" href="/persona">Cari persona-mu</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
