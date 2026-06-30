"use client";

import Link from "next/link";
import { useCart, rupiah } from "@/components/cart/CartContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, setQty, removeItem, subtotal, count } = useCart();

  return (
    <div className={`drawer ${isOpen ? "drawer--open" : ""}`} aria-hidden={!isOpen}>
      <div className="drawer__overlay" onClick={closeCart} />
      <aside className="drawer__panel" role="dialog" aria-label="Keranjang">
        <div className="drawer__head">
          <span>Keranjang ({count})</span>
          <button className="drawer__close" type="button" onClick={closeCart} aria-label="Tutup">×</button>
        </div>

        {items.length === 0 ? (
          <div className="drawer__empty">
            <p>Keranjang masih kosong.</p>
            <Link className="btn btn--solid" href="/#collection" onClick={closeCart}>Lihat collection</Link>
          </div>
        ) : (
          <>
            <div className="drawer__items">
              {items.map((it) => (
                <div className="drawer__item" key={it.slug}>
                  <img src={it.image} alt={it.name} />
                  <div className="drawer__itembody">
                    <p className="drawer__name">{it.name}</p>
                    <p className="drawer__price">{rupiah(it.price)}</p>
                    <div className="drawer__qty">
                      <button type="button" onClick={() => setQty(it.slug, it.qty - 1)} aria-label="Kurangi">−</button>
                      <span>{it.qty}</span>
                      <button type="button" onClick={() => setQty(it.slug, it.qty + 1)} aria-label="Tambah">+</button>
                      <button className="drawer__remove" type="button" onClick={() => removeItem(it.slug)}>Hapus</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer__foot">
              <div className="drawer__sub">
                <span>Subtotal</span>
                <span>{rupiah(subtotal)}</span>
              </div>
              <p className="drawer__note">Ongkir &amp; promo dihitung di checkout.</p>
              <Link className="btn btn--solid drawer__checkout" href="/checkout" onClick={closeCart}>
                Lanjut ke checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
