import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/adminAuth";
import { loginAdmin } from "@/app/admin/actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Login · DOMANIC", robots: { index: false, follow: false } };

export default function AdminLogin({ searchParams }) {
  if (isAdmin()) redirect("/admin/orders");
  const failed = searchParams?.e === "1";
  return (
    <div className="wrap adm adm--login">
      <p className="eyebrow">Admin</p>
      <h1>Masuk ke dashboard.</h1>
      <form action={loginAdmin} className="adm__loginform">
        <div className="field">
          <label>Password</label>
          <input type="password" name="password" autoFocus autoComplete="current-password" />
        </div>
        {failed && <p className="adm__err">Password salah.</p>}
        <button className="btn btn--solid" type="submit">Masuk</button>
      </form>
    </div>
  );
}
