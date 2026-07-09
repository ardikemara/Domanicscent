"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAdmin } from "@/app/admin/actions";

// Nav admin. Tambah item baru di sini kalau ada modul baru (produk, promo, dst).
const NAV = [
  { href: "/admin/orders", label: "Orders", match: "/admin/orders" },
];

export default function AdminShell({ children }) {
  const pathname = usePathname() || "";
  const [open, setOpen] = useState(false);

  // Halaman login tampil polos, tanpa sidebar.
  if (pathname === "/admin/login") return children;

  return (
    <div className="admshell">
      <button
        className="admshell__toggle"
        type="button"
        aria-label="Buka menu"
        onClick={() => setOpen((v) => !v)}
      >
        ☰
      </button>

      <aside className={`admshell__side ${open ? "is-open" : ""}`}>
        <div className="admshell__brand">
          DOMANIC
          <span>Admin</span>
        </div>

        <nav className="admshell__nav">
          {NAV.map((n) => {
            const active = pathname.startsWith(n.match);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`admshell__link ${active ? "admshell__link--active" : ""}`}
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <form action={logoutAdmin}>
          <button className="admshell__logout" type="submit">Keluar</button>
        </form>
      </aside>

      <section className="admshell__main">{children}</section>
    </div>
  );
}
