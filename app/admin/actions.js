"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSql } from "@/lib/db";
import { products } from "@/lib/products";
import { checkPassword, createSessionCookie, clearSessionCookie, isAdmin } from "@/lib/adminAuth";
import { calculateTariff, pickJne, storeOrder, requestPickup, printLabel, getDetail, mapKomshipStatus } from "@/lib/komship";
import { sendEmail, affiliateApprovedEmail, payoutPaidEmail } from "@/lib/email";

export async function loginAdmin(formData) {
  const pw = formData.get("password");
  if (!checkPassword(pw)) {
    redirect("/admin/login?e=1");
  }
  createSessionCookie();
  redirect("/admin/orders");
}

export async function logoutAdmin() {
  clearSessionCookie();
  redirect("/admin/login");
}

function guard() {
  if (!isAdmin()) redirect("/admin/login");
}

// Tandai dikirim + simpan nomor resi JNE.
export async function markShipped(formData) {
  guard();
  const orderNumber = (formData.get("orderNumber") || "").toString().trim();
  const resi = (formData.get("resi") || "").toString().trim();
  if (!orderNumber || !resi) redirect(`/admin/orders/${encodeURIComponent(orderNumber)}?e=resi`);
  const sql = getSql();
  await sql`
    update domanic.orders
    set status = 'shipped', tracking_number = ${resi}, shipped_at = now()
    where order_number = ${orderNumber} and payment_status = 'paid'`;
  revalidatePath(`/admin/orders/${orderNumber}`);
  revalidatePath("/admin/orders");
  redirect(`/admin/orders/${encodeURIComponent(orderNumber)}`);
}

export async function markCompleted(formData) {
  guard();
  const orderNumber = (formData.get("orderNumber") || "").toString().trim();
  const sql = getSql();
  await sql`
    update domanic.orders set status = 'completed'
    where order_number = ${orderNumber} and status = 'shipped'`;
  revalidatePath(`/admin/orders/${orderNumber}`);
  revalidatePath("/admin/orders");
  redirect(`/admin/orders/${encodeURIComponent(orderNumber)}`);
}

export async function cancelOrder(formData) {
  guard();
  const orderNumber = (formData.get("orderNumber") || "").toString().trim();
  const sql = getSql();
  // Batalkan hanya kalau belum dikirim.
  await sql`
    update domanic.orders set status = 'cancelled'
    where order_number = ${orderNumber} and status in ('pending','paid')`;
  revalidatePath(`/admin/orders/${orderNumber}`);
  revalidatePath("/admin/orders");
  redirect(`/admin/orders/${encodeURIComponent(orderNumber)}`);
}

// ---- Versi drawer: dipanggil dari client, return {ok, order} (bukan redirect). ----
// Sengaja TANPA revalidatePath: client update datanya sendiri dari `order` yang
// di-return, jadi halaman nggak ke-refresh (kalau refresh, drawer ketutup/bounce).

// Ambil satu order + item dalam bentuk plain object (buat di-return ke client).
async function fetchOrderPlain(sql, on) {
  const rows = await sql`
    select o.*, c.email
    from domanic.orders o
    left join domanic.customers c on c.id = o.customer_id
    where o.order_number = ${on} limit 1`;
  if (rows.length === 0) return null;
  const items = await sql`
    select product_name, qty, unit_price, line_total
    from domanic.order_items
    where order_id = (select id from domanic.orders where order_number = ${on})`;
  return { ...rows[0], items: items.map((it) => ({ ...it })) };
}

export async function markShippedFromDrawer(orderNumber, resi) {
  if (!isAdmin()) return { ok: false, error: "Sesi habis, login ulang." };
  const on = (orderNumber || "").toString().trim();
  const tn = (resi || "").toString().trim();
  if (!on || !tn) return { ok: false, error: "Nomor resi wajib diisi." };
  const sql = getSql();
  await sql`
    update domanic.orders
    set status = 'shipped', tracking_number = ${tn}, shipped_at = now()
    where order_number = ${on} and payment_status = 'paid'`;
  return { ok: true, order: await fetchOrderPlain(sql, on) };
}

export async function markCompletedFromDrawer(orderNumber) {
  if (!isAdmin()) return { ok: false, error: "Sesi habis, login ulang." };
  const on = (orderNumber || "").toString().trim();
  const sql = getSql();
  await sql`
    update domanic.orders set status = 'completed'
    where order_number = ${on} and status = 'shipped'`;
  return { ok: true, order: await fetchOrderPlain(sql, on) };
}

export async function cancelOrderFromDrawer(orderNumber) {
  if (!isAdmin()) return { ok: false, error: "Sesi habis, login ulang." };
  const on = (orderNumber || "").toString().trim();
  const sql = getSql();
  await sql`
    update domanic.orders set status = 'cancelled'
    where order_number = ${on} and status in ('pending','paid')`;
  // Order batal: komisi affiliate yang belum dibayar ikut hangus.
  try {
    await sql`
      update domanic.affiliate_commissions set status = 'void'
      where order_id = (select id from domanic.orders where order_number = ${on})
        and status in ('pending', 'eligible')`;
  } catch {}
  return { ok: true, order: await fetchOrderPlain(sql, on) };
}

// ---- Affiliate (Data Affiliate) ----

async function fetchAffiliatePlain(sql, id) {
  const rows = await sql`
    select a.*,
      coalesce((select count(*) from domanic.affiliate_clicks k where k.affiliate_id = a.id), 0)::int as clicks,
      coalesce((select count(*) from domanic.orders o where o.affiliate_id = a.id and o.payment_status = 'paid'), 0)::int as orders_paid,
      coalesce((select sum(o.total) from domanic.orders o where o.affiliate_id = a.id and o.payment_status = 'paid'), 0)::int as sales_total,
      coalesce((select sum(c.amount) from domanic.affiliate_commissions c where c.affiliate_id = a.id and c.status <> 'void'), 0)::int as commission_total
    from domanic.affiliates a where a.id = ${id} limit 1`;
  return rows[0] ? { ...rows[0] } : null;
}

// Ubah status affiliate. Approve ngirim email berisi link (best-effort).
export async function setAffiliateStatus(id, status) {
  if (!isAdmin()) return { ok: false, error: "Sesi habis, login ulang." };
  const allowed = ["approved", "rejected", "suspended", "pending"];
  if (!allowed.includes(status)) return { ok: false, error: "Status nggak dikenal." };
  const sql = getSql();
  const [row] = await sql`
    update domanic.affiliates
    set status = ${status},
        approved_at = case when ${status} = 'approved' then coalesce(approved_at, now()) else approved_at end
    where id = ${id}
    returning id, slug, name, email`;
  if (!row) return { ok: false, error: "Affiliate nggak ketemu." };

  if (status === "approved") {
    try {
      const { subject, html } = affiliateApprovedEmail({ name: row.name, slug: row.slug });
      await sendEmail({ to: row.email, subject, html });
    } catch {}
  }
  return { ok: true, affiliate: await fetchAffiliatePlain(sql, id) };
}

// ---- Cashout affiliate (Komisi & Cashout) ----

async function fetchPayoutPlain(sql, id) {
  const rows = await sql`
    select p.id, p.amount, p.status, p.requested_at, p.paid_at, p.note,
           a.name, a.slug, a.email, a.phone, a.bank_name, a.bank_account, a.bank_holder
    from domanic.affiliate_payouts p
    join domanic.affiliates a on a.id = p.affiliate_id
    where p.id = ${id} limit 1`;
  return rows[0] ? { ...rows[0] } : null;
}

// Tandai pengajuan sudah ditransfer: payout paid + semua komisinya paid + email.
export async function markPayoutPaid(id) {
  if (!isAdmin()) return { ok: false, error: "Sesi habis, login ulang." };
  const sql = getSql();
  const [row] = await sql`
    update domanic.affiliate_payouts set status = 'paid', paid_at = now()
    where id = ${id} and status = 'requested'
    returning id, affiliate_id, amount`;
  if (!row) return { ok: false, error: "Pengajuan nggak ketemu atau udah diproses." };
  await sql`
    update domanic.affiliate_commissions
    set status = 'paid', paid_at = now()
    where payout_id = ${id} and status = 'requested'`;

  try {
    const p = await fetchPayoutPlain(sql, id);
    if (p?.email) {
      const masked = String(p.bank_account || "").length > 4 ? "****" + String(p.bank_account).slice(-4) : p.bank_account;
      const { subject, html } = payoutPaidEmail({ name: p.name, amount: p.amount, bankName: p.bank_name, bankAccountMasked: masked });
      await sendEmail({ to: p.email, subject, html });
    }
  } catch {}
  return { ok: true, payout: await fetchPayoutPlain(sql, id) };
}

// Tolak pengajuan (mis. data rekening salah): komisi balik jadi eligible.
export async function rejectPayout(id, note) {
  if (!isAdmin()) return { ok: false, error: "Sesi habis, login ulang." };
  const sql = getSql();
  const cleanNote = (note || "").toString().trim().slice(0, 300) || null;
  const [row] = await sql`
    update domanic.affiliate_payouts set status = 'rejected', note = ${cleanNote}
    where id = ${id} and status = 'requested'
    returning id`;
  if (!row) return { ok: false, error: "Pengajuan nggak ketemu atau udah diproses." };
  await sql`
    update domanic.affiliate_commissions
    set status = 'eligible', payout_id = null
    where payout_id = ${id} and status = 'requested'`;
  return { ok: true, payout: await fetchPayoutPlain(sql, id) };
}

// ---- Komship (pengiriman otomatis) ----

// Buat delivery order di Komship untuk order yang sudah paid.
// Resi (AWB) keluar nanti saat pickup dijadwalkan / via webhook.
export async function createShipmentFromDrawer(orderNumber) {
  if (!isAdmin()) return { ok: false, error: "Sesi habis, login ulang." };
  const on = (orderNumber || "").toString().trim();
  const sql = getSql();
  try {
    const order = await fetchOrderPlain(sql, on);
    if (!order) return { ok: false, error: "Order nggak ketemu." };
    if (order.payment_status !== "paid") return { ok: false, error: "Order belum dibayar." };
    if (order.komship_order_no) return { ok: false, error: "Pengiriman sudah pernah dibuat." };
    if (!order.shipping_destination_id) {
      return { ok: false, error: "Order ini nggak punya ID tujuan (order lama?). Kirim manual aja." };
    }

    const totalQty = order.items.reduce((s, it) => s + it.qty, 0);
    const options = await calculateTariff(order.shipping_destination_id, totalQty * 500, order.subtotal);
    const tariff = pickJne(options);
    if (!tariff) return { ok: false, error: "Tarif JNE nggak tersedia untuk tujuan ini." };

    const { orderNo } = await storeOrder({ order, items: order.items, tariff });
    await sql`
      update domanic.orders
      set komship_order_no = ${orderNo}, komship_status = 'Diajukan'
      where order_number = ${on}`;
    return { ok: true, order: await fetchOrderPlain(sql, on) };
  } catch (e) {
    return { ok: false, error: e?.message || "Gagal bikin pengiriman." };
  }
}

// Jadwalkan pickup kurir. Kalau AWB langsung keluar, simpan sebagai resi.
export async function requestPickupFromDrawer(orderNumber, pickupDate, pickupTime, vehicle) {
  if (!isAdmin()) return { ok: false, error: "Sesi habis, login ulang." };
  const on = (orderNumber || "").toString().trim();
  const sql = getSql();
  try {
    const order = await fetchOrderPlain(sql, on);
    if (!order?.komship_order_no) return { ok: false, error: "Buat pengiriman dulu." };
    const { awb } = await requestPickup(order.komship_order_no, pickupDate, pickupTime, vehicle);
    await sql`
      update domanic.orders
      set komship_status = 'Pickup dijadwalkan',
          tracking_number = coalesce(nullif(${awb}, ''), tracking_number)
      where order_number = ${on}`;
    return { ok: true, order: await fetchOrderPlain(sql, on) };
  } catch (e) {
    return { ok: false, error: e?.message || "Gagal jadwalkan pickup." };
  }
}

// Ambil label PDF (base64) buat diprint. Client yang buka jadi file.
export async function getShipmentLabel(orderNumber) {
  if (!isAdmin()) return { ok: false, error: "Sesi habis, login ulang." };
  const on = (orderNumber || "").toString().trim();
  const sql = getSql();
  try {
    const order = await fetchOrderPlain(sql, on);
    if (!order?.komship_order_no) return { ok: false, error: "Buat pengiriman dulu." };
    const { base64 } = await printLabel(order.komship_order_no);
    if (!base64) return { ok: false, error: "Label belum tersedia (biasanya setelah pickup dijadwalkan)." };
    return { ok: true, base64 };
  } catch (e) {
    return { ok: false, error: e?.message || "Gagal ambil label." };
  }
}

// Refresh status + AWB dari Komship (fallback kalau webhook belum masuk).
export async function refreshShipmentFromDrawer(orderNumber) {
  if (!isAdmin()) return { ok: false, error: "Sesi habis, login ulang." };
  const on = (orderNumber || "").toString().trim();
  const sql = getSql();
  try {
    const order = await fetchOrderPlain(sql, on);
    if (!order?.komship_order_no) return { ok: false, error: "Buat pengiriman dulu." };
    const d = await getDetail(order.komship_order_no);
    const mapped = mapKomshipStatus(d.status);
    if (mapped === "shipped" && order.status !== "shipped" && order.status !== "completed") {
      await sql`
        update domanic.orders
        set status = 'shipped', komship_status = ${d.status},
            tracking_number = coalesce(nullif(${d.awb}, ''), tracking_number),
            shipped_at = coalesce(shipped_at, now())
        where order_number = ${on}`;
    } else if (mapped === "completed" && order.status !== "completed") {
      await sql`
        update domanic.orders
        set status = 'completed', komship_status = ${d.status},
            tracking_number = coalesce(nullif(${d.awb}, ''), tracking_number)
        where order_number = ${on}`;
    } else {
      await sql`
        update domanic.orders
        set komship_status = ${d.status},
            tracking_number = coalesce(nullif(${d.awb}, ''), tracking_number)
        where order_number = ${on}`;
    }
    return { ok: true, order: await fetchOrderPlain(sql, on) };
  } catch (e) {
    return { ok: false, error: e?.message || "Gagal refresh status." };
  }
}

// Set stok awal parfum (dipanggil dari drawer Data Parfum). Return nilai baru.
export async function setParfumStock(slug, baseStock) {
  if (!isAdmin()) return { ok: false, error: "Sesi habis, login ulang." };
  const s = (slug || "").toString().trim();
  if (!products.some((p) => p.slug === s)) return { ok: false, error: "Parfum tidak dikenal." };
  const n = Math.max(0, parseInt(baseStock, 10) || 0);
  const sql = getSql();
  await sql`
    insert into domanic.product_stock (slug, base_stock, updated_at)
    values (${s}, ${n}, now())
    on conflict (slug) do update set base_stock = ${n}, updated_at = now()`;
  return { ok: true, base_stock: n };
}

// ---- Promo CRUD (drawer Data Promo). Return {ok, promo} biar client patch state. ----

export async function savePromo(input) {
  if (!isAdmin()) return { ok: false, error: "Sesi habis, login ulang." };
  const code = (input?.code || "").toString().trim().toUpperCase();
  if (!code) return { ok: false, error: "Kode wajib diisi." };
  const type = ["fixed", "freeship"].includes(input?.type) ? input.type : "percent";
  let value = parseInt(input?.value, 10);
  if (type === "freeship") {
    value = 0; // free ongkir nggak butuh nilai diskon subtotal
  } else {
    if (!Number.isFinite(value) || value <= 0) return { ok: false, error: "Nilai diskon harus lebih dari 0." };
    if (type === "percent" && value > 100) return { ok: false, error: "Diskon persen maksimal 100." };
  }
  const minSpend = Math.max(0, parseInt(input?.min_spend, 10) || 0);
  const active = !!input?.active;
  const startsAt = input?.starts_at ? input.starts_at : null;
  const endsAt = input?.ends_at ? input.ends_at : null;
  const usageLimit = input?.usage_limit ? Math.max(1, parseInt(input.usage_limit, 10)) : null;
  // Scope produk: cuma slug yang valid; kosong = berlaku semua produk (null).
  const slugs = Array.isArray(input?.product_slugs)
    ? input.product_slugs.filter((s) => products.some((p) => p.slug === s))
    : [];
  const productSlugs = slugs.length ? slugs : null;
  const id = input?.id || null;
  const sql = getSql();

  const dup = await sql`
    select id from domanic.promo_codes
    where upper(code) = ${code} and (${id}::uuid is null or id <> ${id}) limit 1`;
  if (dup.length) return { ok: false, error: "Kode itu udah dipakai promo lain." };

  let row;
  if (id) {
    [row] = await sql`
      update domanic.promo_codes set
        code = ${code}, type = ${type}, value = ${value}, min_spend = ${minSpend},
        active = ${active}, starts_at = ${startsAt}, ends_at = ${endsAt}, usage_limit = ${usageLimit},
        product_slugs = ${productSlugs}
      where id = ${id}
      returning id, code, type, value, min_spend, active, starts_at, ends_at, usage_limit, used_count, product_slugs`;
    if (!row) return { ok: false, error: "Promo nggak ketemu." };
  } else {
    [row] = await sql`
      insert into domanic.promo_codes (code, type, value, min_spend, active, starts_at, ends_at, usage_limit, product_slugs)
      values (${code}, ${type}, ${value}, ${minSpend}, ${active}, ${startsAt}, ${endsAt}, ${usageLimit}, ${productSlugs})
      returning id, code, type, value, min_spend, active, starts_at, ends_at, usage_limit, used_count, product_slugs`;
  }
  return { ok: true, promo: { ...row } };
}

export async function togglePromo(id, active) {
  if (!isAdmin()) return { ok: false, error: "Sesi habis, login ulang." };
  const sql = getSql();
  const [row] = await sql`
    update domanic.promo_codes set active = ${!!active} where id = ${id}
    returning id, code, type, value, min_spend, active, starts_at, ends_at, usage_limit, used_count, product_slugs`;
  if (!row) return { ok: false, error: "Promo nggak ketemu." };
  return { ok: true, promo: { ...row } };
}

export async function deletePromo(id) {
  if (!isAdmin()) return { ok: false, error: "Sesi habis, login ulang." };
  const sql = getSql();
  await sql`delete from domanic.promo_codes where id = ${id}`;
  return { ok: true, id };
}
