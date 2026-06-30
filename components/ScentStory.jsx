// Scent notes as a story: narrative on the left, ingredient sketch on the right.
// Responsive: on mobile the sketch stacks on top, story below.

export default function ScentStory({ product }) {
  if (!product.noteScene) return null;

  return (
    <section className="scent" aria-label="Scent notes">
      <div className="scent__text">
        <p className="scent__eyebrow">The Composition</p>
        <h3>Scent Notes</h3>
        <p className="scent__story">{product.noteStory}</p>

        <div className="scent__layers">
          <div className="scent__layer">
            <span className="scent__tag">Top</span>
            <span className="scent__list">{product.notes.top.join(", ")}</span>
          </div>
          <div className="scent__layer">
            <span className="scent__tag">Heart</span>
            <span className="scent__list">{product.notes.mid.join(", ")}</span>
          </div>
          <div className="scent__layer">
            <span className="scent__tag">Base</span>
            <span className="scent__list">{product.notes.base.join(", ")}</span>
          </div>
        </div>
      </div>

      <div className="scent__media">
        <img src={product.noteScene} alt={`Bahan-bahan ${product.name}`} loading="lazy" />
      </div>
    </section>
  );
}
