import Link from "next/link";

export const metadata = {
  title: "Shipping & Returns · DOMANIC",
  description:
    "Info pengiriman dan returns Domanic Scent. Gratis ongkir di atas Rp 500.000, flat Rp 25.000 ke seluruh Indonesia, garansi 30 hari.",
  alternates: { canonical: "/shipping" },
  openGraph: {
    type: "website",
    url: "/shipping",
    title: "Shipping & Returns · DOMANIC",
    description: "Info pengiriman dan returns Domanic Scent.",
  },
};

export default function ShippingPage() {
  return (
    <div className="wrap infopage">
      <p className="eyebrow">Help</p>
      <h1>Shipping &amp; returns</h1>
      <p className="infopage__lead">
        Semua yang perlu kamu tahu soal pengiriman dan kalau ada kendala sama order-mu.
      </p>

      <section className="infopage__item">
        <h2>Ongkos kirim</h2>
        <p>
          Gratis ongkir untuk order di atas Rp 500.000. Di bawah itu, ongkir flat Rp 25.000 ke seluruh
          Indonesia. Untuk order pertama, pakai kode <b>DOMANIC10</b> buat 10% off.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Proses order</h2>
        <p>
          Setelah checkout, kamu langsung dapat nomor order. Tim kami akan menghubungi via WhatsApp untuk
          konfirmasi sebelum paket dikirim. Setiap botol Domanic sudah fully macerated 2 sampai 4 minggu,
          jadi yang sampai ke kamu adalah parfum yang benar-benar matang.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Packaging</h2>
        <p>
          Botol dikemas aman dengan lapisan pelindung supaya extrait de parfum-mu sampai dalam kondisi
          sempurna.
        </p>
      </section>

      <section className="infopage__item">
        <h2>Returns dan garansi</h2>
        <p>
          Domanic punya garansi 30 hari. Kalau paketmu sampai dalam kondisi rusak atau ada kendala lain,
          hubungi tim kami lewat WhatsApp yang sama dengan konfirmasi order-mu. Kami bantu sampai beres.
        </p>
      </section>

      <div className="infopage__foot">
        <p>
          Pertanyaan lain soal produk? Cek <Link href="/faq">FAQ</Link> atau langsung
          {" "}<Link href="/persona">temukan parfum sesuai kepribadianmu</Link>.
        </p>
      </div>
    </div>
  );
}
