// Scent Notes — responsive CSS grid of fragrance ingredients, grouped by Top/Heart/Base.
// Names always sit below the photo (consistent position). Continuous CSS grid lines.
// Falls back to nothing if the product has no note images (caller renders text pyramid).

export default function ScentNotes({ product }) {
  const map = product.noteImg;
  if (!map) return null;

  const groups = [
    { label: "Top Notes", items: product.notes.top },
    { label: "Heart Notes", items: product.notes.mid },
    { label: "Base Notes", items: product.notes.base },
  ];

  return (
    <section className="notes" aria-label="Scent notes">
      <div className="notes__head">
        <p className="notes__eyebrow">The Composition</p>
        <h3>Scent Notes</h3>
      </div>

      {groups.map((g) => (
        <div className="notes__group" key={g.label}>
          <p className="notes__label">{g.label}</p>
          <div className="notes__grid" style={{ "--cols": g.items.length }}>
            {g.items.map((n) => (
              <figure className="note" key={n}>
                <div className="note__img">
                  <img
                    src={`/notes/${product.slug}/${map[n]}.jpg`}
                    alt={n}
                    loading="lazy"
                  />
                </div>
                <figcaption className="note__name">{n}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
