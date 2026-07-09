import { redirect } from "next/navigation";
import { getSql } from "@/lib/db";
import { isAdmin } from "@/lib/adminAuth";
import CustomersTable from "@/components/admin/CustomersTable";

export const dynamic = "force-dynamic";
export const metadata = { title: "Customers · Admin DOMANIC", robots: { index: false, follow: false } };

async function fetchData(q) {
  const sql = getSql();
  const like = q ? `%${q}%` : null;
  const rows = await sql`
    select c.id, c.name, c.phone, c.email, c.address, c.city, c.notes, c.created_at,
           count(o.id)::int as order_count,
           coalesce(sum(o.total) filter (where o.payment_status = 'paid'), 0)::int as spent
    from domanic.customers c
    left join domanic.orders o on o.customer_id = c.id
    where (${like}::text is null or c.name ilike ${like} or c.phone ilike ${like} or c.email ilike ${like})
    group by c.id
    order by c.created_at desc
    limit 100`;

  // Order tiap customer buat drawer (satu query, lalu kelompokin).
  const ids = rows.map((r) => r.id);
  const ordersByCust = {};
  if (ids.length) {
    const os = await sql`
      select customer_id, order_number, status, payment_status, total, created_at
      from domanic.orders
      where customer_id in ${sql(ids)}
      order by created_at desc`;
    for (const ord of os) {
      (ordersByCust[ord.customer_id] ||= []).push({
        order_number: ord.order_number, status: ord.status,
        payment_status: ord.payment_status, total: ord.total, created_at: ord.created_at,
      });
    }
  }
  const customers = rows.map((r) => ({ ...r, orders: ordersByCust[r.id] || [] }));

  const [stat] = await sql`
    select count(*)::int as total,
           count(*) filter (where created_at >= date_trunc('month', now() at time zone 'Asia/Jakarta'))::int as baru
    from domanic.customers`;
  const [rep] = await sql`
    select count(*)::int as repeat_count from (
      select customer_id from domanic.orders
      where customer_id is not null group by customer_id having count(*) > 1
    ) t`;

  return { customers, stat, repeat: rep.repeat_count };
}

export default async function AdminCustomers({ searchParams }) {
  if (!isAdmin()) redirect("/admin/login");
  const q = (searchParams?.q || "").trim();
  const { customers, stat, repeat } = await fetchData(q);

  return (
    <div className="wrap adm">
      <div className="adm__top">
        <div>
          <p className="eyebrow">Admin · Customers</p>
          <h1>Data customer.</h1>
        </div>
      </div>

      <div className="adm__stats">
        <div className="adm__stat"><span>Total customer</span><b>{stat.total}</b></div>
        <div className="adm__stat"><span>Baru bulan ini</span><b>{stat.baru}</b></div>
        <div className="adm__stat"><span>Repeat buyer</span><b>{repeat}</b></div>
      </div>

      <form className="adm__filters" method="get">
        <input name="q" defaultValue={q} placeholder="Cari nama / HP / email" />
        <button className="btn btn--ghost" type="submit">Cari</button>
      </form>

      <CustomersTable key={q} customers={customers} />
    </div>
  );
}
