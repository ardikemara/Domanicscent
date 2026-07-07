import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="wrap foot">
        <div>
          <div className="foot__brand">DOMANIC</div>
          <p>A scent for who you are. Extrait de parfum, dibikin pelan di Indonesia.</p>
        </div>
        <div>
          <h5>Shop</h5>
          <ul>
            <li><Link href="/products/velvet-rum">Velvet Rum</Link></li>
            <li><Link href="/products/lily-wood">Lily Wood</Link></li>
            <li><Link href="/products/whisper">Whisper</Link></li>
            <li><Link href="/products/oud-majesty">Oud Majesty</Link></li>
          </ul>
        </div>
        <div>
          <h5>Help</h5>
          <ul>
            <li><Link href="/shipping">Shipping &amp; returns</Link></li>
            <li><Link href="/#">Lacak order</Link></li>
            <li><Link href="/#">Kontak</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h5>Brand</h5>
          <ul>
            <li><Link href="/#story">Our story</Link></li>
            <li><Link href="/persona">Find your persona</Link></li>
            <li><Link href="/#">Instagram</Link></li>
            <li><Link href="/journal">Journal</Link></li>
          </ul>
        </div>
      </div>
      <div className="wrap foot__bar">
        <span>© 2026 Domanic Scent. All rights reserved.</span>
        <div className="pays">
          <span>QRIS</span><span>GoPay</span><span>OVO</span><span>VA Bank</span><span>Visa</span><span>Mastercard</span>
        </div>
      </div>
    </footer>
  );
}
