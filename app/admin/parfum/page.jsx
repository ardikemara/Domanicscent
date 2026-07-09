import { redirect } from "next/navigation";
import { getSql } from "@/lib/db";
import { products, rupiah } from "@/lib/products";
import { isAdmin } from "@/lib/adminAuth";
import ParfumTable from "@/components/admin/ParfumTable";

export const dynamic = "force-dynamic";
export const metadata = { title: "Parfum · Admin DOMANIC", robots: { index: false, follow: false } };

async function fetchData() {
  const sql = getSql();

  // Ringkasan penjualan per slug. Lunas = terjual+revenue; pending = potensi.
  const sales = await sql`
    select oi.product_slug,
           coalesce(sum(oi.qty) filter (where o.payment_status = 'paid'), 0)::int as units,
           coalesce(sum(oi.line_total) filter (where o.payment_status = 'paid'), 0)::int as revenue,
           count(distinct oi.order_id) filter (where o.payment_status = 'paid')::int as order_count,
           coalesce(sum(oi.qty) filter (where o.payment_status in ('pending','unpaid')), 0)::int as pending_units,
           coalesce(sum(oi.line_total) filter (where o.payment_status in ('pending','unpaid')), 0)::int as pending_revenue
    from domanic.order_items oi
    join domanic.orders o on o.id = oi.order_id
    group by oi.product_slug`;
  const salesBySlug = {};
  for (const s of sales) salesBySlug[s.product_slug] = s;

  // Stok awal per parfum (baris cuma ada kalau udah pernah di-set).
  const stockRows = await sql`select slug, base_stock from domanic.product_stock`;
  const stockBySlug = {};
  for (const r of stockRows) stockBySlug[r.slug] = r.base_stock;

  // Daftar order per parfum buat drawer (semua status).
  const lines = await sql`
    select oi.product_slug, oi.qty, o.order_number, o.status, o.payment_status, o.created_at
    from domanic.order_items oi
    join domanic.orders o on o.id = oi.order_id
    order by o.created_at desc`;
  const ordersBySlug = {};
  for (const l of lines) {
    (ordersBySlug[l.product_slug] ||= []).push({
      order_number: l.order_number, qty: l.qty,
      status: l.status, payment_status: l.payment_status, created_at: l.created_at,
    });
  }

  const items = products.map((p) => {
    const s = salesBySlug[p.slug];
    const units = s?.units || 0;
    const baseStock = Object.prototype.hasOwnProperty.call(stockBySlug, p.slug) ? stockBySlug[p.slug] : null;
    return {
      slug: p.slug, name: p.name, persona: p.persona, character: p.character,
      price: p.price, size: p.size, concentration: p.concentration, image: p.image,
      bestWorn: p.bestWorn || null, notes: p.notes || null,
      units, revenue: s?.revenue || 0, orderCount: s?.order_count || 0,
      pendingUnits: s?.pending_units || 0, pendingRevenue: s?.pending_revenue || 0,
      baseStock, stock: baseStock === null ? null : baseStock - units,
      orders: ordersBySlug[p.slug] || [],
    };
  });
  items.sort((a, b) => b.units - a.units);

  const totalUnits = items.reduce((t, i) => t + i.units, 0);
  const totalRevenue = items.reduce((t, i) => t + i.revenue, 0);
  const pendingRevenue = items.reduce((t, i) => t + i.pendingRevenue, 0);
  const best = items.find((i) => i.units > 0)?.name || "-";

  return { items, totalUnits, totalRevenue, pendingRevenue, best };
}

export default async function AdminParfum() {
  if (!isAdmin()) redirect("/admin/login");
  const { items, totalUnits, totalRevenue, pendingRevenue, best } = await fetchData();

  return (
    <div className="wrap adm">
      <div className="adm__top">
        <div>
          <p className="eyebrow">Admin · Parfum</p>
          <h1>Data parfum.</h1>
        </div>
      </div>

      <div className="adm__stats">
        <div className="adm__stat"><span>Total terjual (lunas)</span><b>{totalUnits} pcs</b></div>
        <div className="adm__stat"><span>Revenue produk</span><b>{rupiah(totalRevenue)}</b></div>
        <div className="adm__stat"><span>Potensi pending</span><b>{rupiah(pendingRevenue)}</b></div>
        <div className="adm__stat"><span>Best seller</span><b>{best}</b></div>
      </div>

      <ParfumTable items={items} />
    </div>
  );
}
