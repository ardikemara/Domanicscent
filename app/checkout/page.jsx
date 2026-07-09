"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart, rupiah } from "@/components/cart/CartContext";
import { createOrder, checkPromo, findDestinations, quoteShipping } from "@/app/checkout/actions";

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

  // Tujuan pengiriman (autocomplete RajaOngkir) + ongkir real-time JNE
  const [destQuery, setDestQuery] = useState("");
  const [destOptions, setDestOptions] = useState([]);
  const [dest, setDest] = useState(null); // { id, label }
  const [ship, setShip] = useState({ cost: null, etd: null, loading: false });
  const debounceRef = useRef(null);

  useEffect(() => {
    if (dest || destQuery.trim().length < 3) {
      setDestOptions([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const opts = await findDestinations(destQuery);
      setDestOptions(opts);
    }, 450);
    return () => clearTimeout(debounceRef.current);
  }, [destQuery, dest]);

  useEffect(() => {
    let alive = true;
    async function run() {
      if (items.length === 0) return;
      if (subtotal >= FREE_SHIP_MIN) {
        setShip({ cost: 0, etd: null, loading: false });
        return;
      }
      if (!dest) {
        setShip({ cost: null, etd: null, loading: false });
        return;
      }
      setShip((s) => ({ ...s, loading: true }));
      const q = await quoteShipping(dest.id, items.map((it) => ({ slug: it.slug, qty: it.qty })));
      if (!alive) return;
      setShip({ cost: q.cost, etd: q.etd, loading: false });
    }
    run();
    return () => {
      alive = false;
    };
  }, [dest, subtotal, items]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const shipping = subtotal >= FREE_SHIP_MIN ? 0 : ship.cost;
  const discount = promoState.valid ? promoState.discount : 0;
  const total = Math.max(0, subtotal - discount + (shipping || 0));

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
    if (subtotal < FREE_SHIP_MIN && !dest) {
      setError("Pilih kecamatan/kota tujuan dulu buat hitung ongkir.");
      return;
    }
    setSubmitting(true);
    const res = await createOrder({
      items: items.map((it) => ({ slug: it.slug, qty: it.qty })),
      customer: form,
      promoCode: promoState.valid ? promo : "",
      destination: dest,
    });
    if (!res.ok) {
      setSubmitting(false);
      setError(res.error || "Gagal membuat order.");
      return;
    }

    clear();
    // Semua pembayaran sekarang di halaman embedded /pay/[order].
    router.push(`/pay/${encodeURIComponent(res.orderNumber)}`);
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
          <div className="field field--dest">
            <label>Kecamatan / kota tujuan *</label>
            <input
              value={dest ? dest.label : destQuery}
              onChange={(e) => {
                setDest(null);
                setDestQuery(e.target.value);
              }}
              placeholder="Ketik minimal 3 huruf, mis. Pondok Gede"
              autoComplete="off"
            />
            {destOptions.length > 0 && !dest && (
              <ul className="dest__options">
                {destOptions.map((o) => (
                  <li key={o.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setDest(o);
                        setDestQuery("");
                        setDestOptions([]);
                      }}
                    >
                      {o.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className="field__hint">Dipakai buat hitung ongkir JNE dari gudang kami di Bekasi.</p>
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
            <div>
              <span>Ongkir{ship.etd ? ` (JNE, est. ${ship.etd} hari)` : " (JNE)"}</span>
              <span>
                {subtotal >= FREE_SHIP_MIN
                  ? "Gratis"
                  : ship.loading
                  ? "Menghitung..."
                  : shipping == null
                  ? "Pilih tujuan"
                  : rupiah(shipping)}
              </span>
            </div>
            <div className="grand"><span>Total</span><span>{rupiah(total)}</span></div>
          </div>

          {error && <p className="checkout__err">{error}</p>}

          <button className="btn btn--solid checkout__submit" type="button" onClick={submit} disabled={submitting}>
            {submitting ? "Memproses..." : "Bayar sekarang"}
          </button>
          <p className="checkout__paynote">
            Pembayaran aman via Midtrans. Bisa pakai QRIS, GoPay, atau transfer bank (Virtual Account).
          </p>
        </aside>
      </div>
    </div>
  );
}
