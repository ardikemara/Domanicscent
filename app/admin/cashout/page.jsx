import { redirect } from "next/navigation";
import { getSql } from "@/lib/db";
import { isAdmin } from "@/lib/adminAuth";
import { rupiah } from "@/lib/products";
import CashoutTable from "@/components/admin/CashoutTable";

export const dynamic = "force-dynamic";
export const metadata = { title: "Komisi & Cashout · Admin DOMANIC", robots: { index: false, follow: false } };

async function fetchData() {
  const sql = getSql();
  const payouts = await sql`
    select p.id, p.amount, p.status, p.requested_at, p.paid_at, p.note,
           a.name, a.slug, a.email, a.phone, a.bank_name, a.bank_account, a.bank_holder
    from domanic.affiliate_payouts p
    join domanic.affiliates a on a.id = p.affiliate_id
    order by (p.status = 'requested') desc, p.requested_at desc
    limit 200`;

  const [totals] = await sql`
    select
      coalesce(sum(amount) filter (where status = 'requested'), 0)::int as requested_total,
      coalesce(count(*) filter (where status = 'requested'), 0)::int as requested_count,
      coalesce(sum(amount) filter (where status = 'paid'), 0)::int as paid_total,
      coalesce((select sum(c.amount) from domanic.affiliate_commissions c
        where c.status = 'eligible' or (c.status = 'pending' and c.eligible_at <= now())), 0)::int as eligible_outstanding
    from domanic.affiliate_payouts`;

  return { payouts: payouts.map((p) => ({ ...p })), totals: { ...totals } };
}

export default async function AdminCashoutPage() {
  if (!isAdmin()) redirect("/admin/login");
  const { payouts, totals } = await fetchData();

  return (
    <div className="wrap adm">
      <p className="eyebrow">Admin · Affiliate</p>
      <h1>Komisi &amp; Cashout.</h1>

      <div className="adm__stats">
        <div className="adm__stat"><span>Menunggu ditransfer</span><b>{totals.requested_count} ({rupiah(totals.requested_total)})</b></div>
        <div className="adm__stat"><span>Total sudah dibayar</span><b>{rupiah(totals.paid_total)}</b></div>
        <div className="adm__stat"><span>Saldo eligible di luar (belum diajukan)</span><b>{rupiah(totals.eligible_outstanding)}</b></div>
      </div>

      <CashoutTable payouts={payouts} />
    </div>
  );
}
