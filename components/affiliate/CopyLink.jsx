"use client";

import { useState } from "react";

export default function CopyLink({ link, slug }) {
  const [copied, setCopied] = useState("");

  async function copy(text, key) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    } catch {}
  }

  return (
    <div className="affdash__link">
      <div className="affdash__linkrow">
        <span className="affdash__url">{link}</span>
        <button className="btn btn--solid" type="button" onClick={() => copy(link, "main")}>
          {copied === "main" ? "Kesalin ✓" : "Copy link"}
        </button>
      </div>
      <p className="field__hint">
        Mau share halaman produk langsung? Tambahkan <b>?ref={slug}</b> di akhir URL mana pun,
        contoh: domanicscent.com/products/velvet-rum?ref={slug}
        <button className="adm__linkbtn" type="button"
          onClick={() => copy(`https://www.domanicscent.com/products/velvet-rum?ref=${slug}`, "prod")}>
          {copied === "prod" ? "kesalin ✓" : "copy contoh"}
        </button>
      </p>
    </div>
  );
}
