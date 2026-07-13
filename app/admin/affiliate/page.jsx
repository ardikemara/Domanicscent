import { redirect } from "next/navigation";
import { getSql } from "@/lib/db";
import { isAdmin } from "@/lib/adminAuth";
import AffiliatesTable from "@/components/admin/AffiliatesTable";

export const dynamic = "force-dynamic";
export const metadata = { title: "Data Affiliate · Admin DOMANIC", robots: { index: false, follow: false } };

async function fetchData() {
  const sql = getSql();
  const rows = await sql`
    select a.id, a.slug, a.name, a.email, a.phone, a.social_url,
           a.bank_name, a.bank_account, a.bank_holder,
           a.status, a.created_at, a.approved_at,
      coalesce((select count(*) from domanic.affiliate_clicks k where k.affiliate_id = a.id), 0)::int as clicks,
      coalesce((select count(*) from domanic.orders o where o.affiliate_id = a.id and o.payment_status = 'paid'), 0)::int as orders_paid,
      coalesce((select sum(o.total) from domanic.orders o where o.affiliate_id = a.id and o.payment_status = 'paid'), 0)::int as sales_total,
      coalesce((select sum(c.amount) from domanic.affiliate_commissions c where c.affiliate_id = a.id and c.status <> 'void'), 0)::int as commission_total
    from domanic.affiliates a
    order by (a.status = 'pending') desc, a.created_at desc
    limit 200`;
  return rows.map((r) => ({ ...r }));
}

export default async function AdminAffiliatePage() {
  if (!isAdmin()) redirect("/admin/login");
  const affiliates = await fetchData();
  const pending = affiliates.filter((a) => a.status === "pending").length;
  const approved = affiliates.filter((a) => a.status === "approved").length;

  return (
    <div className="wrap adm">
      <p className="eyebrow">Admin · Affiliate</p>
      <h1>Data Affiliate.</h1>

      <div className="adm__stats">
        <div className="adm__stat"><span>Menunggu review</span><b>{pending}</b></div>
        <div className="adm__stat"><span>Aktif (approved)</span><b>{approved}</b></div>
        <div className="adm__stat"><span>Total pendaftar</span><b>{affiliates.length}</b></div>
      </div>

      <AffiliatesTable affiliates={affiliates} />
    </div>
  );
}
