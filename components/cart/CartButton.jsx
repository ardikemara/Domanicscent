"use client";

import { useCart } from "@/components/cart/CartContext";

export default function CartButton() {
  const { count, openCart } = useCart();
  return (
    <button className="nav__cart" type="button" onClick={openCart} aria-label="Buka keranjang">
      Bag ({count})
    </button>
  );
}
