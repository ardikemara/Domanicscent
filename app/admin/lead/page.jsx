import { redirect } from "next/navigation";
import { getSql } from "@/lib/db";
import { products } from "@/lib/products";
import { isAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leads · Admin DOMANIC", robots: { index: false, follow: false } };

const SOURCE_LABEL = { persona: "Quiz persona", newsletter: "Newsletter", checkout: "Checkout (beli)" };

async function fetchData(q, source) {
  const sql = getSql();
  const like = q ? `%${q}%` : null;
  const src = source || null;
  const leads = await sql`
    select id, source, email, name, phone, persona, created_at
    from domanic.leads
    where (${like}::text is null or email ilike ${like} or name ilike ${like})
      and (${src}::text is null or source = ${src})
    order by created_at desc
    limit 200`;
  const [stat] = await sql`
    select count(*)::int as total,
           count(*) filter (where created_at >= date_trunc('month', now() at time zone 'Asia/Jakarta'))::int as baru,
           count(*) filter (where source = 'persona')::int as from_persona,
           count(*) filter (where source = 'newsletter')::int as from_newsletter
    from domanic.leads`;
  return { leads, stat };
}

export default async function AdminLeads({ searchParams }) {
  if (!isAdmin()) redirect("/admin/login");
  const q = (searchParams?.q || "").trim();
  const source = (searchParams?.source || "").trim();
  const { leads, stat } = await fetchData(q, source);

  const nameBySlug = {};
  products.forEach((p) => { nameBySlug[p.slug] = p.name; });

  return (
    <div className="wrap adm">
      <div className="adm__top">
        <div>
          <p className="eyebrow">Admin · Leads</p>
          <h1>Data lead.</h1>
        </div>
      </div>

      <div className="adm__stats">
        <div className="adm__stat"><span>Total lead</span><b>{stat.total}</b></div>
        <div className="adm__stat"><span>Baru bulan ini</span><b>{stat.baru}</b></div>
        <div className="adm__stat"><span>Dari quiz persona</span><b>{stat.from_persona}</b></div>
        <div className="adm__stat"><span>Dari newsletter</span><b>{stat.from_newsletter}</b></div>
      </div>

      <form className="adm__filters" method="get">
        <input name="q" defaultValue={q} placeholder="Cari email / nama" />
        <select name="source" defaultValue={source}>
          <option value="">Semua sumber</option>
          <option value="checkout">Checkout (beli)</option>
          <option value="persona">Quiz persona</option>
          <option value="newsletter">Newsletter</option>
        </select>
        <button className="btn btn--ghost" type="submit">Filter</button>
      </form>

      <div className="adm__tablewrap">
        <table className="adm__table">
          <thead>
            <tr>
              <th>Email</th><th>Sumber</th><th>Persona</th><th>Nama</th><th>HP</th><th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr><td colSpan={6} className="adm__empty">Belum ada lead yang cocok.</td></tr>
            )}
            {leads.map((l) => (
              <tr key={l.id}>
                <td><b>{l.email}</b></td>
                <td>{SOURCE_LABEL[l.source] || l.source}</td>
                <td>{l.persona ? (nameBySlug[l.persona] || l.persona) : "-"}</td>
                <td>{l.name || "-"}</td>
                <td>{l.phone || "-"}</td>
                <td>{new Date(l.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
