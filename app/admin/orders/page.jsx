import { redirect } from "next/navigation";
import { getSql } from "@/lib/db";
import { rupiah } from "@/lib/products";
import { isAdmin } from "@/lib/adminAuth";
import OrdersTable from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders · Admin DOMANIC", robots: { index: false, follow: false } };

async function fetchData(q, pay) {
  const sql = getSql();
  const like = q ? `%${q}%` : null;
  const orders = await sql`
    select order_number, name, phone, total, payment_status, status, tracking_number, created_at
    from domanic.orders
    where (${like}::text is null or order_number ilike ${like} or name ilike ${like} or phone ilike ${like})
      and (${pay || null}::text is null or payment_status = ${pay || null})
    order by created_at desc
    limit 100`;
  const [month] = await sql`
    select count(*) filter (where payment_status = 'paid') as paid_count,
           coalesce(sum(total) filter (where payment_status = 'paid'), 0) as revenue,
           count(*) as all_count
    from domanic.orders
    where created_at >= date_trunc('month', now() at time zone 'Asia/Jakarta')`;
  return { orders, month };
}

export default async function AdminOrders({ searchParams }) {
  if (!isAdmin()) redirect("/admin/login");
  const q = (searchParams?.q || "").trim();
  const pay = (searchParams?.pay || "").trim();
  const { orders, month } = await fetchData(q, pay);

  return (
    <div className="wrap adm">
      <div className="adm__top">
        <div>
          <p className="eyebrow">Admin · Orders</p>
          <h1>Data order.</h1>
        </div>
      </div>

      <div className="adm__stats">
        <div className="adm__stat"><span>Order bulan ini</span><b>{month.all_count}</b></div>
        <div className="adm__stat"><span>Lunas</span><b>{month.paid_count}</b></div>
        <div className="adm__stat"><span>Revenue (lunas)</span><b>{rupiah(month.revenue)}</b></div>
      </div>

      <form className="adm__filters" method="get">
        <input name="q" defaultValue={q} placeholder="Cari nomor order / nama / HP" />
        <select name="pay" defaultValue={pay}>
          <option value="">Semua pembayaran</option>
          <option value="paid">Lunas</option>
          <option value="pending">Menunggu</option>
          <option value="unpaid">Belum bayar</option>
          <option value="expired">Kedaluwarsa</option>
          <option value="failed">Gagal</option>
        </select>
        <button className="btn btn--ghost" type="submit">Filter</button>
      </form>

      <OrdersTable orders={orders} />
    </div>
  );
}
