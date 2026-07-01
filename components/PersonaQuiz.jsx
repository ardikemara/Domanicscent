"use client";

import { useState } from "react";
import Link from "next/link";
import { products } from "@/lib/products";

// answer keys map to product slug
const QUESTIONS = [
  {
    q: "Malam yang ideal buat kamu?",
    options: [
      ["Ngopi sambil baca sampai larut", "velvet-rum"],
      ["Jalan ke tempat baru, ngejar pengalaman", "lily-wood"],
      ["Dinner intim yang tenang dan elegan", "whisper"],
      ["Rooftop rame, jadi pusat perhatian", "oud-majesty"],
    ],
  },
  {
    q: "Aroma yang bikin kamu nyaman?",
    options: [
      ["Manis hangat: cokelat, kopi, vanila", "velvet-rum"],
      ["Segar hijau: buah, daun, kayu", "lily-wood"],
      ["Floral lembut yang halus", "whisper"],
      ["Buah bold yang sensual dan dalam", "oud-majesty"],
    ],
  },
  {
    q: "Orang biasa ngegambarin kamu sebagai?",
    options: [
      ["Dalam, tenang, sedikit misterius", "velvet-rum"],
      ["Bebas, spontan, penasaran", "lily-wood"],
      ["Anggun, kalem, penuh kelas", "whisper"],
      ["Percaya diri, magnetik, berani", "oud-majesty"],
    ],
  },
  {
    q: "Kapan kamu paling pengen wangi enak?",
    options: [
      ["Fokus kerja atau me-time malam", "velvet-rum"],
      ["Weekend di luar ruangan", "lily-wood"],
      ["Acara spesial yang berkesan", "whisper"],
      ["Keluar malam, biar diinget", "oud-majesty"],
    ],
  },
];

export default function PersonaQuiz() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({});
  const [done, setDone] = useState(false);

  const choose = (slug) => {
    const next = { ...scores, [slug]: (scores[slug] || 0) + 1 };
    setScores(next);
    if (step + 1 >= QUESTIONS.length) {
      setDone(true);
    } else {
      setStep(step + 1);
    }
  };

  const reset = () => {
    setStep(0);
    setScores({});
    setDone(false);
  };

  if (done) {
    // pick winner, tie-break by product order
    let winner = products[0].slug;
    let best = -1;
    for (const p of products) {
      const s = scores[p.slug] || 0;
      if (s > best) {
        best = s;
        winner = p.slug;
      }
    }
    const p = products.find((x) => x.slug === winner);
    return (
      <div className="qz__result">
        <span className="eyebrow">Persona-mu</span>
        <h2>{p.name}</h2>
        <p className="persona">{p.persona}</p>
        <div className="qz__resultimg">
          <img src={p.image} alt={`Domanic ${p.name}`} />
        </div>
        <p className="lead">{p.tagline}</p>
        <div>
          <Link className="btn btn--solid" href={`/persona/${p.slug}`}>Kenalan sama {p.name}</Link>
          <Link className="btn btn--ghost" href="/#collection">Lihat semua</Link>
        </div>
        <button className="qz__retry" type="button" onClick={reset}>Ulangi kuis</button>
      </div>
    );
  }

  const current = QUESTIONS[step];
  const pct = Math.round((step / QUESTIONS.length) * 100);

  return (
    <>
      <div className="qz__progress"><span style={{ width: `${pct}%` }} /></div>
      <div className="qz__card">
        <p className="qz__q">{current.q}</p>
        <div className="qz__opts">
          {current.options.map(([label, slug]) => (
            <button key={label} className="qz__opt" type="button" onClick={() => choose(slug)}>
              {label}
            </button>
          ))}
        </div>
        <p className="qz__count">Pertanyaan {step + 1} dari {QUESTIONS.length}</p>
      </div>
    </>
  );
}
