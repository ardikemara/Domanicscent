import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap" style={{ padding: "120px 28px", textAlign: "center" }}>
      <p className="eyebrow">404</p>
      <h1 style={{ fontFamily: "var(--disp)", fontWeight: 400, fontSize: "2.4rem", color: "var(--umber)", margin: "14px 0 18px" }}>
        Halaman nggak ketemu
      </h1>
      <Link className="btn btn--solid" href="/">Kembali ke beranda</Link>
    </div>
  );
}
