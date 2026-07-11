"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const LINKS = [
  { href: "/#collection", label: "Collection" },
  { href: "/persona", label: "Find Your Persona" },
  { href: "/#why", label: "Why Domanic" },
  { href: "/#story", label: "Our Story" },
  { href: "/journal", label: "Journal" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button className="navburger" type="button" aria-label="Buka menu" aria-expanded={open} onClick={() => setOpen(true)}>
        <span /><span /><span />
      </button>

      {mounted && open && createPortal(
        <div className="mobmenu" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="mobmenu__overlay" onClick={() => setOpen(false)} />
          <nav className="mobmenu__panel">
            <button className="mobmenu__close" type="button" aria-label="Tutup" onClick={() => setOpen(false)}>×</button>
            <span className="mobmenu__brand">DOMANIC</span>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="mobmenu__link" onClick={() => setOpen(false)}>{l.label}</Link>
            ))}
          </nav>
        </div>,
        document.body
      )}
    </>
  );
}
