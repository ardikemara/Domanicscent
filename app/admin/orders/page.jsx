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
  const rows = await sql`
    select o.id, o.order_number, o.name, o.phone,
           o.subtotal, o.discount, o.shipping, o.total, o.promo_code,
           o.payment_status, o.payment_method, o.status, o.tracking_number,
           o.shipping_address, o.shipping_city, o.shipping_etd, o.note,
           o.midtrans_transaction_id, o.komerce_payment_id, o.komship_order_no, o.komship_status,
           o.shipping_destination_id, o.paid_at, o.shipped_at, o.created_at,
           c.email
    from domanic.orders o
    left join domanic.customers c on c.id = o.customer_id
    where (${like}::text is null or o.order_number ilike ${like} or o.name ilike ${like} or o.phone ilike ${like})
      and (${pay || null}::text is null or o.payment_status = ${pay || null})
    order by o.created_at desc
    limit 100`;

  // Ambil semua item order yang ke-list dalam satu query, lalu kelompokin.
  const ids = rows.map((r) => r.id);
  const itemsByOrder = {};
  if (ids.length) {
    const items = await sql`
      select order_id, product_name, qty, unit_price, line_total
      from domanic.order_items
      where order_id in ${sql(ids)}`;
    for (const it of items) {
      (itemsByOrder[it.order_id] ||= []).push({
        product_name: it.product_name, qty: it.qty,
        unit_price: it.unit_price, line_total: it.line_total,
      });
    }
  }
  // Plain object + item nempel, aman diserialisasi ke komponen client.
  const orders = rows.map((r) => ({ ...r, items: itemsByOrder[r.id] || [] }));

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

      <OrdersTable key={`${q}|${pay}`} orders={orders} />
    </div>
  );
}
