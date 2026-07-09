import { redirect } from "next/navigation";
import { getSql } from "@/lib/db";
import { rupiah } from "@/lib/products";
import { isAdmin } from "@/lib/adminAuth";
import AnalyticPromoTable from "@/components/admin/AnalyticPromoTable";

export const dynamic = "force-dynamic";
export const metadata = { title: "Analytic Promo · Admin DOMANIC", robots: { index: false, follow: false } };

async function fetchData() {
  const sql = getSql();

  const agg = await sql`
    select upper(promo_code) as code,
      count(*)::int as orders_all,
      count(*) filter (where payment_status = 'paid')::int as orders_paid,
      coalesce(sum(discount) filter (where payment_status = 'paid'), 0)::int as discount_paid,
      coalesce(sum(total) filter (where payment_status = 'paid'), 0)::int as revenue_paid
    from domanic.orders
    where promo_code is not null and trim(promo_code) <> ''
    group by upper(promo_code)`;
  const aggByCode = {};
  for (const a of agg) aggByCode[a.code] = a;

  const promos = await sql`
    select id, code, type, value, active, usage_limit, used_count
    from domanic.promo_codes order by created_at desc`;

  const ordRows = await sql`
    select upper(promo_code) as code, order_number, status, payment_status, discount, total, created_at
    from domanic.orders
    where promo_code is not null and trim(promo_code) <> ''
    order by created_at desc`;
  const ordersByCode = {};
  for (const o of ordRows) {
    (ordersByCode[o.code] ||= []).push({
      order_number: o.order_number, status: o.status, payment_status: o.payment_status,
      discount: o.discount, total: o.total, created_at: o.created_at,
    });
  }

  const seen = new Set();
  const items = promos.map((p) => {
    const code = (p.code || "").toUpperCase();
    seen.add(code);
    const a = aggByCode[code] || {};
    return {
      id: p.id, code: p.code, type: p.type, value: p.value, active: p.active, usage_limit: p.usage_limit,
      orders_all: a.orders_all || 0, orders_paid: a.orders_paid || 0,
      discount_paid: a.discount_paid || 0, revenue_paid: a.revenue_paid || 0,
      deleted: false, orders: ordersByCode[code] || [],
    };
  });
  // Order yang pakai kode promo yang udah dihapus dari tabel promo_codes.
  for (const code of Object.keys(aggByCode)) {
    if (seen.has(code)) continue;
    const a = aggByCode[code];
    items.push({
      id: null, code, type: null, value: null, active: null, usage_limit: null,
      orders_all: a.orders_all, orders_paid: a.orders_paid,
      discount_paid: a.discount_paid, revenue_paid: a.revenue_paid,
      deleted: true, orders: ordersByCode[code] || [],
    });
  }
  items.sort((x, y) => y.orders_all - x.orders_all);

  const totalOrdersPaid = items.reduce((t, i) => t + i.orders_paid, 0);
  const totalDiscount = items.reduce((t, i) => t + i.discount_paid, 0);
  const totalRevenue = items.reduce((t, i) => t + i.revenue_paid, 0);

  return { items, totalOrdersPaid, totalDiscount, totalRevenue };
}

export default async function AdminAnalyticPromo() {
  if (!isAdmin()) redirect("/admin/login");
  const { items, totalOrdersPaid, totalDiscount, totalRevenue } = await fetchData();

  return (
    <div className="wrap adm">
      <div className="adm__top">
        <div>
          <p className="eyebrow">Admin · Analytic Promo</p>
          <h1>Analytic promo.</h1>
        </div>
      </div>

      <div className="adm__stats">
        <div className="adm__stat"><span>Order berpromo (lunas)</span><b>{totalOrdersPaid}</b></div>
        <div className="adm__stat"><span>Total diskon dikasih</span><b>{rupiah(totalDiscount)}</b></div>
        <div className="adm__stat"><span>Revenue dari promo</span><b>{rupiah(totalRevenue)}</b></div>
      </div>

      <AnalyticPromoTable items={items} />
    </div>
  );
}
