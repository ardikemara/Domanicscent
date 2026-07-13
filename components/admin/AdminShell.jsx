"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAdmin } from "@/app/admin/actions";

// Nav admin ngikutin roadmap. Modul yang belum jadi tampil "segera" (non-klik).
// Kalau modulnya kelar, kasih href + match, terus set ready: true.
const NAV = [
  { href: "/admin/orders", label: "Data Order", match: "/admin/orders", ready: true },
  { href: "/admin/customers", label: "Data Customer", match: "/admin/customers", ready: true },
  { href: "/admin/parfum", label: "Data Parfum", match: "/admin/parfum", ready: true },
  { href: "/admin/promo", label: "Promo", match: "/admin/promo", ready: true },
  { href: "/admin/analytic-promo", label: "Analytic Promo", match: "/admin/analytic-promo", ready: true },
  { href: "/admin/lead", label: "Data Lead", match: "/admin/lead", ready: true },
  { href: "/admin/affiliate", label: "Data Affiliate", match: "/admin/affiliate", ready: true },
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
            if (!n.ready) {
              return (
                <span key={n.label} className="admshell__link admshell__link--soon">
                  {n.label}
                  <em className="admshell__badge">segera</em>
                </span>
              );
            }
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
