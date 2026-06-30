"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const CartCtx = createContext(null);
const KEY = "domanic_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch (e) {}
  }, [items, ready]);

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.slug === product.slug);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], qty: copy[i].qty + qty };
        return copy;
      }
      return [
        ...prev,
        { slug: product.slug, name: product.name, price: product.price, image: product.image, qty },
      ];
    });
    setOpen(true);
  }, []);

  const removeItem = useCallback((slug) => {
    setItems((prev) => prev.filter((x) => x.slug !== slug));
  }, []);

  const setQty = useCallback((slug, qty) => {
    setItems((prev) =>
      prev
        .map((x) => (x.slug === slug ? { ...x, qty: Math.max(1, qty) } : x))
        .filter((x) => x.qty > 0)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((s, x) => s + x.qty, 0);
  const subtotal = items.reduce((s, x) => s + x.price * x.qty, 0);

  const value = {
    items,
    addItem,
    removeItem,
    setQty,
    clear,
    count,
    subtotal,
    isOpen,
    openCart: () => setOpen(true),
    closeCart: () => setOpen(false),
  };

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export const rupiah = (n) => "Rp " + (n || 0).toLocaleString("id-ID");
