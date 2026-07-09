import { redirect } from "next/navigation";
import { getSql } from "@/lib/db";
import { products } from "@/lib/products";
import { isAdmin } from "@/lib/adminAuth";
import PromoTable from "@/components/admin/PromoTable";

export const dynamic = "force-dynamic";
export const metadata = { title: "Promo · Admin DOMANIC", robots: { index: false, follow: false } };

async function fetchData() {
  const sql = getSql();
  const rows = await sql`
    select id, code, type, value, min_spend, active, starts_at, ends_at, usage_limit, used_count, product_slugs, created_at
    from domanic.promo_codes
    order by created_at desc`;
  const promos = rows.map((r) => ({ ...r }));
  const total = promos.length;
  const activeCount = promos.filter((p) => p.active).length;
  const totalUsed = promos.reduce((t, p) => t + (p.used_count || 0), 0);
  return { promos, total, activeCount, totalUsed };
}

export default async function AdminPromo() {
  if (!isAdmin()) redirect("/admin/login");
  const { promos, total, activeCount, totalUsed } = await fetchData();

  return (
    <div className="wrap adm">
      <div className="adm__top">
        <div>
          <p className="eyebrow">Admin · Promo</p>
          <h1>Kode promo.</h1>
        </div>
      </div>

      <div className="adm__stats">
        <div className="adm__stat"><span>Total promo</span><b>{total}</b></div>
        <div className="adm__stat"><span>Aktif</span><b>{activeCount}</b></div>
        <div className="adm__stat"><span>Total pemakaian</span><b>{totalUsed}</b></div>
      </div>

      <PromoTable promos={promos} productList={products.map((p) => ({ slug: p.slug, name: p.name }))} />
    </div>
  );
}
