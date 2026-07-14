import { redirect } from "next/navigation";
import { getSql } from "@/lib/db";
import { getAffiliateId } from "@/lib/affiliateAuth";
import { rupiah } from "@/lib/products";
import { logoutAffiliate } from "@/app/affiliate/actions";
import CopyLink from "@/components/affiliate/CopyLink";
import SettingsForm from "@/components/affiliate/SettingsForm";
import CashoutButton from "@/components/affiliate/CashoutButton";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Dashboard Affiliate · DOMANIC",
  robots: { index: false, follow: false },
};

// Status komisi efektif: masa tahan 7 hari dihitung on-read dari eligible_at.
function commissionLabel(c) {
  if (c.status === "void") return { label: "Hangus", kind: "failed" };
  if (c.status === "paid") return { label: "Sudah dibayar", kind: "paid" };
  if (c.status === "requested") return { label: "Diajukan", kind: "pending" };
  const eligible = c.status === "eligible" || (c.eligible_at && new Date(c.eligible_at) <= new Date());
  return eligible
    ? { label: "Bisa dicairkan", kind: "paid" }
    : { label: "Masa tahan 7 hari", kind: "pending" };
}

async function fetchData(affiliateId) {
  const sql = getSql();
  const [aff] = await sql`
    select id, slug, name, email, phone, bank_name, bank_account, bank_holder, status
    from domanic.affiliates where id = ${affiliateId} limit 1`;
  if (!aff || aff.status !== "approved") return null;

  const [stats] = await sql`
    select
      coalesce((select count(*) from domanic.affiliate_clicks k where k.affiliate_id = ${affiliateId}), 0)::int as clicks,
      coalesce((select count(*) from domanic.orders o where o.affiliate_id = ${affiliateId} and o.payment_status = 'paid'), 0)::int as orders_paid,
      coalesce((select sum(o.total) from domanic.orders o where o.affiliate_id = ${affiliateId} and o.payment_status = 'paid'), 0)::int as sales_total,
      coalesce((select sum(c.amount) from domanic.affiliate_commissions c
        where c.affiliate_id = ${affiliateId} and c.status = 'pending' and c.eligible_at > now()), 0)::int as komisi_hold,
      coalesce((select sum(c.amount) from domanic.affiliate_commissions c
        where c.affiliate_id = ${affiliateId} and (c.status = 'eligible' or (c.status = 'pending' and c.eligible_at <= now()))), 0)::int as komisi_eligible,
      coalesce((select sum(c.amount) from domanic.affiliate_commissions c
        where c.affiliate_id = ${affiliateId} and c.status = 'requested'), 0)::int as komisi_requested,
      coalesce((select sum(c.amount) from domanic.affiliate_commissions c
        where c.affiliate_id = ${affiliateId} and c.status = 'paid'), 0)::int as komisi_paid`;

  // Daftar order dari link affiliate ini. TANPA data pribadi customer.
  const orders = await sql`
    select o.created_at, o.total, o.payment_status,
           (select string_agg(oi.product_name || ' ×' || oi.qty, ', ')
            from domanic.order_items oi where oi.order_id = o.id) as products,
           c.amount as commission_amount, c.status as commission_status, c.eligible_at
    from domanic.orders o
    left join domanic.affiliate_commissions c on c.order_id = o.id
    where o.affiliate_id = ${affiliateId}
    order by o.created_at desc
    limit 100`;

  // Riwayat pencairan.
  const payouts = await sql`
    select amount, status, requested_at, paid_at, note
    from domanic.affiliate_payouts
    where affiliate_id = ${affiliateId}
    order by requested_at desc
    limit 50`;

  return {
    aff: { ...aff },
    stats: { ...stats },
    orders: orders.map((o) => ({ ...o })),
    payouts: payouts.map((p) => ({ ...p })),
  };
}

export default async function AffiliateDashboardPage() {
  const affiliateId = getAffiliateId();
  if (!affiliateId) redirect("/affiliate/login");
  const data = await fetchData(affiliateId);
  if (!data) redirect("/affiliate/login?e=1");
  const { aff, stats, orders, payouts } = data;
  const link = `https://www.domanicscent.com/r/${aff.slug}`;
  const PAYOUT_LABEL = {
    requested: { label: "Diproses (maks 3 hari kerja)", kind: "pending" },
    paid: { label: "Sudah ditransfer", kind: "paid" },
    rejected: { label: "Ditolak", kind: "failed" },
  };

  return (
    <div className="wrap affdash">
      <div className="affdash__head">
        <div>
          <p className="eyebrow">Dashboard Affiliate</p>
          <h1>Halo, {aff.name.split(" ")[0]}.</h1>
        </div>
        <form action={logoutAffiliate}>
          <button className="btn btn--ghost" type="submit">Keluar</button>
        </form>
      </div>

      <CopyLink link={link} slug={aff.slug} />

      <div className="affdash__stats">
        <div className="affdash__stat"><span>Klik masuk</span><b>{stats.clicks}</b></div>
        <div className="affdash__stat"><span>Order lunas</span><b>{stats.orders_paid}</b></div>
        <div className="affdash__stat"><span>Total penjualan</span><b>{rupiah(stats.sales_total)}</b></div>
        <div className="affdash__stat affdash__stat--hi"><span>Bisa dicairkan</span><b>{rupiah(stats.komisi_eligible)}</b></div>
        <div className="affdash__stat"><span>Masa tahan</span><b>{rupiah(stats.komisi_hold)}</b></div>
        <div className="affdash__stat"><span>Sudah dibayar</span><b>{rupiah(stats.komisi_paid + stats.komisi_requested)}</b></div>
      </div>

      <CashoutButton eligible={stats.komisi_eligible} />
      <p className="affdash__note">
        Komisi 15% dari harga produk (setelah diskon, tanpa ongkir), kehitung pas order lunas,
        bisa dicairkan setelah masa tahan 7 hari dengan saldo minimal Rp 250.000. Pencairan
        diproses maksimal 3 hari kerja ke rekening terdaftar.
      </p>

      {payouts.length > 0 && (
        <section className="affdash__section">
          <h3>Riwayat pencairan</h3>
          <div className="adm__tablewrap">
            <table className="adm__table">
              <thead>
                <tr><th>Diajukan</th><th>Jumlah</th><th>Status</th><th>Dibayar</th><th>Catatan</th></tr>
              </thead>
              <tbody>
                {payouts.map((p, i) => {
                  const pl = PAYOUT_LABEL[p.status] || { label: p.status, kind: "pending" };
                  return (
                    <tr key={i}>
                      <td>{new Date(p.requested_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" })}</td>
                      <td>{rupiah(p.amount)}</td>
                      <td><span className={`paybadge paybadge--${pl.kind}`}>{pl.label}</span></td>
                      <td>{p.paid_at ? new Date(p.paid_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" }) : "-"}</td>
                      <td>{p.note || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="affdash__section">
        <h3>Order dari link kamu</h3>
        <div className="adm__tablewrap">
          <table className="adm__table">
            <thead>
              <tr><th>Tanggal</th><th>Produk</th><th>Nilai order</th><th>Komisi</th><th>Status komisi</th></tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr><td colSpan={5} className="adm__empty">Belum ada order dari link kamu. Gas share link-nya!</td></tr>
              )}
              {orders.map((o, i) => {
                const paid = o.payment_status === "paid";
                const cl = o.commission_amount != null ? commissionLabel({ status: o.commission_status, eligible_at: o.eligible_at }) : null;
                return (
                  <tr key={i}>
                    <td>{new Date(o.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" })}</td>
                    <td>{o.products || "-"}</td>
                    <td>{rupiah(o.total)}</td>
                    <td>{o.commission_amount != null ? rupiah(o.commission_amount) : "-"}</td>
                    <td>
                      {cl ? (
                        <span className={`paybadge paybadge--${cl.kind}`}>{cl.label}</span>
                      ) : (
                        <span className={`paybadge paybadge--${paid ? "pending" : "failed"}`}>{paid ? "Diproses" : "Menunggu pembayaran"}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="affdash__section">
        <h3>Pengaturan</h3>
        <SettingsForm
          initial={{
            phone: aff.phone || "",
            bank_name: aff.bank_name || "",
            bank_account: aff.bank_account || "",
            bank_holder: aff.bank_holder || "",
          }}
        />
      </section>
    </div>
  );
}
