import DaftarForm from "@/components/affiliate/DaftarForm";

export const metadata = {
  title: "Daftar Affiliate · DOMANIC",
  description:
    "Gabung program affiliate Domanic: share link kamu, dapat komisi 15% dari tiap penjualan. Cashout mulai Rp 250.000.",
};

export default function AffiliateDaftarPage() {
  return (
    <div className="wrap affdaftar">
      <p className="eyebrow">Affiliate Program</p>
      <h1>Share wanginya, dapat komisinya.</h1>
      <p className="affdaftar__lead">
        Daftar jadi affiliate Domanic. Setelah di-approve, kamu dapat link toko sendiri
        (domanicscent.com/r/username-kamu). Tiap penjualan dari link itu, kamu dapat
        <b> komisi 15%</b> dari harga produk. Pencairan mulai Rp 250.000, diproses 3 hari kerja.
      </p>
      <DaftarForm />
    </div>
  );
}
