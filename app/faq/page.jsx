import Link from "next/link";

export const metadata = {
  title: "FAQ · Extrait de Parfum, Order, dan Pengiriman · DOMANIC",
  description:
    "Pertanyaan yang sering ditanya soal Domanic: apa itu extrait de parfum, apa itu maceration, cara order, pembayaran, dan pengiriman.",
  alternates: { canonical: "/faq" },
  openGraph: {
    type: "website",
    url: "/faq",
    title: "FAQ · DOMANIC",
    description: "Pertanyaan yang sering ditanya soal Domanic Scent.",
  },
};

const faqs = [
  {
    q: "Apa itu extrait de parfum?",
    a: "Extrait de parfum adalah konsentrasi parfum paling tinggi, di atas EDP (eau de parfum) dan EDT (eau de toilette). Kandungan minyak wanginya lebih pekat, jadi aromanya lebih dalam, lebih dekat ke kulit, dan lebih tahan lama. Semua parfum Domanic adalah extrait de parfum.",
  },
  {
    q: "Apa itu maceration dan kenapa Domanic melakukannya?",
    a: "Maceration adalah proses pematangan parfum setelah formula selesai. Setiap parfum Domanic diistirahatkan 2 sampai 4 minggu sebelum dibotolkan supaya molekulnya menyatu, alkoholnya melembut, dan transisi top ke base jadi smooth. Kami nggak menjual parfum yang masih mentah.",
  },
  {
    q: "Berapa lama wanginya tahan di kulit?",
    a: "Sebagai extrait de parfum, Domanic lebih tahan lama dibanding EDP atau EDT pada umumnya. Hasil persisnya bervariasi tergantung tipe kulit, cuaca, dan cara pakai. Tips: semprot di titik nadi setelah mandi, saat kulit masih sedikit lembap.",
  },
  {
    q: "Gimana cara memilih parfum yang cocok buat aku?",
    a: "Setiap Domanic dibuat dari satu persona. Cara paling gampang: ikut kuis singkat kami buat nemuin parfum yang sesuai kepribadianmu, cuma empat pertanyaan.",
  },
  {
    q: "Berapa harga dan ukurannya?",
    a: "Semua parfum Domanic berukuran 50 ml extrait de parfum, harganya Rp 329.000.",
  },
  {
    q: "Pembayarannya bisa pakai apa aja?",
    a: "QRIS, GoPay, OVO, virtual account bank, Visa, dan Mastercard.",
  },
  {
    q: "Ongkirnya berapa?",
    a: "Gratis ongkir untuk order di atas Rp 500.000. Di bawah itu, ongkir dihitung otomatis pakai tarif JNE dari gudang kami di Bekasi, jadi kamu bayar sesuai tujuanmu. Order pertama? Pakai kode DOMANIC10 buat 10% off.",
  },
  {
    q: "Kalau ada kendala sama order aku gimana?",
    a: "Domanic punya garansi 30 hari. Setelah order masuk, tim kami akan menghubungi via WhatsApp, dan lewat jalur yang sama kamu bisa sampaikan kendala apapun. Kami bantu sampai beres.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <div className="wrap infopage">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <p className="eyebrow">Help</p>
      <h1>Frequently asked questions</h1>
      <p className="infopage__lead">
        Hal-hal yang paling sering ditanya soal Domanic, dari extrait de parfum sampai pengiriman.
      </p>

      {faqs.map((f) => (
        <section key={f.q} className="infopage__item">
          <h2>{f.q}</h2>
          <p>
            {f.a}
            {f.q.includes("memilih") && (
              <> <Link href="/persona">Temukan parfum sesuai kepribadianmu di sini.</Link></>
            )}
          </p>
        </section>
      ))}

      <div className="infopage__foot">
        <p>
          Masih ada pertanyaan lain? Lihat <Link href="/shipping">info shipping dan returns</Link>, atau
          mulai dari <Link href="/#collection">collection kami</Link>.
        </p>
      </div>
    </div>
  );
}
