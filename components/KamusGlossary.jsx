"use client";

import { useState } from "react";
import Link from "next/link";
import { glossaryCategories, glossaryTerms } from "@/lib/glossary";

// Client component, tapi tetap di-prerender Next.js: dengan query kosong
// seluruh 54 istilah ikut masuk HTML hasil build (penting buat Google).

export default function KamusGlossary() {
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const q = query.trim().toLowerCase();
  const matches = (t) =>
    !q ||
    t.term.toLowerCase().includes(q) ||
    (t.aka && t.aka.toLowerCase().includes(q)) ||
    t.definition.toLowerCase().includes(q);

  const copyAnchorLink = (id) => {
    const url = `https://www.domanicscent.com/journal/kamus-istilah-parfum#${id}`;
    if (navigator.clipboard) navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const totalShown = glossaryTerms.filter(matches).length;

  return (
    <div className="kamus">
      <div className="kamus__search">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari istilah, misal: sillage, nempel, oud..."
          aria-label="Cari istilah parfum"
        />
        {q && (
          <p className="kamus__count">
            {totalShown > 0
              ? `${totalShown} istilah ditemukan`
              : "Tidak ketemu. Coba kata lain, atau kabari kami istilah yang belum masuk."}
          </p>
        )}
      </div>

      <nav className="kamus__nav" aria-label="Kategori istilah">
        {glossaryCategories.map((c) => (
          <a key={c.id} href={`#${c.id}`} className="kamus__navbtn">
            {c.name}
          </a>
        ))}
      </nav>

      {glossaryCategories.map((cat) => {
        const terms = glossaryTerms.filter(
          (t) => t.category === cat.id && matches(t)
        );
        if (q && terms.length === 0) return null;
        return (
          <section key={cat.id} className="kamus__section">
            <h2 id={cat.id} className="kamus__cat">{cat.name}</h2>
            {terms.map((term) => (
              <article key={term.id} className="kamus__card">
                <h3 id={term.id} className="kamus__term">
                  {term.term}
                  <button
                    type="button"
                    onClick={() => copyAnchorLink(term.id)}
                    aria-label={`Salin link ke ${term.term}`}
                    className="kamus__anchor"
                  >
                    {copiedId === term.id ? (
                      <span className="kamus__copied">Link disalin</span>
                    ) : (
                      "🔗"
                    )}
                  </button>
                </h3>
                {term.aka && <p className="kamus__aka">Juga disebut: {term.aka}</p>}
                <p className="kamus__def">{term.definition}</p>
                {term.distinction && (
                  <p className="kamus__distinction">{term.distinction}</p>
                )}
                {term.related && (
                  <p className="kamus__related">
                    Baca juga:{" "}
                    <Link href={term.related.href}>{term.related.label}</Link>
                  </p>
                )}
              </article>
            ))}
          </section>
        );
      })}
    </div>
  );
}
