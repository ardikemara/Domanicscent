import Link from "next/link";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import NewsletterForm from "@/components/NewsletterForm";

export function Collection() {
  return (
    <section className="sec collection" id="collection">
      <div className="wrap">
        <div className="sec__head">
          <p className="eyebrow">Empat parfum · Satu jadi milikmu</p>
          <h2>The Signature Collection</h2>
          <div className="rule" />
        </div>
        <div className="grid4">
          {products.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function PersonaTeaser() {
  return (
    <section className="quiz" id="persona">
      <div className="wrap quiz__inner">
        <p className="eyebrow">Bingung mulai dari mana?</p>
        <h2>Find your persona</h2>
        <p>Jawab beberapa pertanyaan, nanti kami cariin Domanic yang paling kerasa kamu.</p>
        <div className="chips">
          <span className="chip">The Midnight Intellectual</span>
          <span className="chip">The Free-Spirited Explorer</span>
          <span className="chip">The Graceful Muse</span>
          <span className="chip">The Bold Charmer</span>
        </div>
        <Link className="btn btn--solid" href="/persona">Mulai kuis 60 detik</Link>
      </div>
    </section>
  );
}

export function WhyDomanic() {
  const items = [
    {
      img: "/images/why-created.jpg",
      alt: "Tangan meracik formula parfum dengan pipet",
      h: "Created, not cooked",
      p: "Setiap wangi dimulai dari persona dan cerita, baru aromanya disusun. Kami bikin identitas, bukan resep.",
    },
    {
      img: "/images/why-time.jpg",
      alt: "Menandai tanggal maserasi di kalender",
      h: "Time-crafted",
      p: "Kami ikut ritme luxury house: berminggu maserasi, berbulan revisi. Karena luxury nggak bisa instan.",
    },
    {
      img: "/images/why-matured.jpg",
      alt: "Botol Domanic diistirahatkan di rak untuk matang",
      h: "Fully matured",
      p: "Tiap batch diistirahatkan 2 sampai 4 minggu biar notes-nya nyatu, alkoholnya melembut, karakternya keluar penuh.",
    },
  ];
  return (
    <section className="sec why" id="why">
      <div className="wrap">
        <div className="sec__head">
          <p className="eyebrow">Why Domanic</p>
          <h2>Bedanya ada di proses, pelan tapi sungguh-sungguh</h2>
          <div className="rule" />
        </div>
        <div className="usp">
          {items.map((it) => (
            <div className="usp__item" key={it.h}>
              <div className="usp__media"><img src={it.img} alt={it.alt} /></div>
              <div className="usp__txt">
                <h3>{it.h}</h3>
                <p>{it.p}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Story() {
  return (
    <section className="story" id="story">
      <div className="wrap story__inner">
        <p className="eyebrow">Fragrance as identity</p>
        <blockquote>Setiap wangi adalah bab. Setiap bab adalah kamu.</blockquote>
        <p>
          Wangi nggak bisa difoto, tapi karakter bisa. Tiap Domanic dibikin biar kerasa kayak sosok
          yang kamu kenali begitu dipakai, dan terus nempel di ingatan.
        </p>
        <cite>Welcome to Domanic</cite>
      </div>
    </section>
  );
}

export function Reassurance() {
  const items = [
    ["Extrait De Parfum", "Konsentrasi tertinggi, tahan lama"],
    ["Matured, never rushed", "Diistirahatkan sampai smooth"],
    ["Gratis ongkir", "Order pertama & di atas Rp 500.000"],
    ["Garansi 30 hari", "Nggak cocok? Retur gampang"],
  ];
  return (
    <section className="sec">
      <div className="wrap assure">
        {items.map(([h, p]) => (
          <div className="assure__item" key={h}>
            <h4>{h}</h4>
            <p>{p}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Newsletter() {
  return (
    <section className="news">
      <div className="wrap news__inner">
        <p className="eyebrow">Stay in the story</p>
        <h2>Temukan persona profile-mu</h2>
        <p>Gabung buat early drops, styling notes, dan promo khusus member.</p>
        <NewsletterForm />
      </div>
    </section>
  );
}
