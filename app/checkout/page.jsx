"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart, rupiah } from "@/components/cart/CartContext";
import { createOrder, checkPromo } from "@/app/checkout/actions";

const SHIPPING_FLAT = 25000;
const FREE_SHIP_MIN = 500000;

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "", note: "" });
  const [promo, setPromo] = useState("");
  const [promoState, setPromoState] = useState({ discount: 0, message: "", valid: false });
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const shipping = subtotal >= FREE_SHIP_MIN ? 0 : subtotal > 0 ? SHIPPING_FLAT : 0;
  const discount = promoState.valid ? promoState.discount : 0;
  const total = Math.max(0, subtotal - discount + shipping);

  async function applyPromo() {
    setChecking(true);
    const res = await checkPromo(promo, subtotal);
    setPromoState({ discount: res.discount || 0, message: res.message || "", valid: !!res.valid });
    setChecking(false);
  }

  async function submit() {
    setError("");
    if (!form.name || !form.phone || !form.address) {
      setError("Nama, nomor HP, dan alamat wajib diisi.");
      return;
    }
    setSubmitting(true);
    const res = await createOrder({
      items: items.map((it) => ({ slug: it.slug, qty: it.qty })),
      customer: form,
      promoCode: promoState.valid ? promo : "",
    });
    setSubmitting(false);
    if (res.ok) {
      clear();
      router.push(`/thank-you?order=${encodeURIComponent(res.orderNumber)}`);
    } else {
      setError(res.error || "Gagal membuat order.");
    }
  }

  if (items.length === 0) {
    return (
      <div className="wrap checkout checkout--empty">
        <h1>Checkout</h1>
        <p>Keranjang kamu masih kosong.</p>
        <Link className="btn btn--solid" href="/#collection">Lihat collection</Link>
      </div>
    );
  }

  return (
    <div className="wrap checkout">
      <h1>Checkout</h1>
      <div className="checkout__grid">
        <div className="checkout__form">
          <h3>Detail pengiriman</h3>
          <div className="field">
            <label>Nama lengkap *</label>
            <input value={form.name} onChange={set("name")} placeholder="Nama kamu" />
          </div>
          <div className="field">
            <label>Nomor HP / WhatsApp *</label>
            <input value={form.phone} onChange={set("phone")} placeholder="08xxxxxxxxxx" />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={form.email} onChange={set("email")} placeholder="email@kamu.com" />
          </div>
          <div className="field">
            <label>Alamat lengkap *</label>
            <textarea value={form.address} onChange={set("address")} rows={3} placeholder="Jalan, nomor, kelurahan, kecamatan, kode pos" />
          </div>
          <div className="field">
            <label>Kota</label>
            <input value={form.city} onChange={set("city")} placeholder="Kota" />
          </div>
          <div className="field">
            <label>Catatan (opsional)</label>
            <textarea value={form.note} onChange={set("note")} rows={2} placeholder="Catatan buat kurir / hadiah" />
          </div>
        </div>

        <aside className="checkout__summary">
          <h3>Ringkasan order</h3>
          <div className="summary__items">
            {items.map((it) => (
              <div className="summary__row" key={it.slug}>
                <img src={it.image} alt={it.name} />
                <div>
                  <p className="summary__name">{it.name}</p>
                  <p className="summary__qty">{it.qty} × {rupiah(it.price)}</p>
                </div>
                <span className="summary__line">{rupiah(it.price * it.qty)}</span>
              </div>
            ))}
          </div>

          <div className="promo">
            <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Kode promo (mis. DOMANIC10)" />
            <button type="button" onClick={applyPromo} disabled={checking}>{checking ? "..." : "Pakai"}</button>
          </div>
          {promoState.message && (
            <p className={`promo__msg ${promoState.valid ? "ok" : "bad"}`}>{promoState.message}</p>
          )}

          <div className="summary__totals">
            <div><span>Subtotal</span><span>{rupiah(subtotal)}</span></div>
            {discount > 0 && <div className="disc"><span>Diskon</span><span>- {rupiah(discount)}</span></div>}
            <div><span>Ongkir</span><span>{shipping === 0 ? "Gratis" : rupiah(shipping)}</span></div>
            <div className="grand"><span>Total</span><span>{rupiah(total)}</span></div>
          </div>

          {error && <p className="checkout__err">{error}</p>}

          <button className="btn btn--solid checkout__submit" type="button" onClick={submit} disabled={submitting}>
            {submitting ? "Memproses..." : "Buat pesanan"}
          </button>
          <p className="checkout__bypass">
            Pembayaran masih di-bypass (belum ada gateway). Setelah pesan, tim Domanic akan menghubungi kamu via WhatsApp untuk pembayaran &amp; pengiriman.
          </p>
        </aside>
      </div>
    </div>
  );
}
