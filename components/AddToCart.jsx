"use client";

import { useCart } from "@/components/cart/CartContext";
import { trackAddToCart } from "@/lib/analytics";

export default function AddToCart({ product, className = "btn btn--solid", label = "Add to bag" }) {
  const { addItem } = useCart();
  return (
    <button
      className={className}
      type="button"
      onClick={() => {
        addItem(product, 1);
        // fire setelah cart ke-update, sekali per klik
        trackAddToCart(product, 1);
      }}
    >
      {label}
    </button>
  );
}
