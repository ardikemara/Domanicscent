import Link from "next/link";
import LoginForm from "@/components/affiliate/LoginForm";

export const metadata = {
  title: "Masuk Affiliate · DOMANIC",
  robots: { index: false, follow: false },
};

export default function AffiliateLoginPage({ searchParams }) {
  const failed = searchParams?.e === "1";
  return (
    <div className="wrap affdaftar">
      <p className="eyebrow">Affiliate</p>
      <h1>Masuk dashboard affiliate.</h1>
      <p className="affdaftar__lead">
        Masukin email yang kamu pakai waktu daftar. Kami kirim link masuk ke email itu,
        tanpa password.
      </p>
      {failed && (
        <p className="affdaftar__err">
          Link masuknya nggak valid atau udah kedaluwarsa (berlaku 15 menit). Minta link baru di bawah ya.
        </p>
      )}
      <LoginForm />
      <p className="field__hint" style={{ marginTop: 18 }}>
        Belum jadi affiliate? <Link href="/affiliate/daftar">Daftar di sini</Link>.
      </p>
    </div>
  );
}
