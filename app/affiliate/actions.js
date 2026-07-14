"use server";

import { redirect } from "next/navigation";
import { getSql } from "@/lib/db";
import { validSlug } from "@/lib/affiliate";
import { createLoginToken, getAffiliateId, clearAffiliateSession } from "@/lib/affiliateAuth";
import { sendEmail, affiliateLoginEmail, payoutRequestedEmail, siteUrl } from "@/lib/email";

// Pendaftaran affiliate (publik). Masuk sebagai status 'pending',
// admin yang approve manual di Admin > Data Affiliate.
export async function registerAffiliate(input) {
  const name = (input?.name || "").toString().trim().slice(0, 120);
  const email = (input?.email || "").toString().trim().toLowerCase().slice(0, 160);
  const phone = (input?.phone || "").toString().trim().slice(0, 40);
  const social = (input?.social_url || "").toString().trim().slice(0, 200);
  const bankName = (input?.bank_name || "").toString().trim().slice(0, 60);
  const bankAccount = (input?.bank_account || "").toString().trim().slice(0, 40);
  const bankHolder = (input?.bank_holder || "").toString().trim().slice(0, 120);
  const slug = validSlug(input?.slug);

  if (!name || !phone) return { ok: false, error: "Nama dan nomor HP wajib diisi." };
  if (!email.includes("@")) return { ok: false, error: "Email-nya belum bener." };
  if (!social) return { ok: false, error: "Link sosial media wajib diisi (buat verifikasi)." };
  if (!slug) return { ok: false, error: "Username link 3-30 karakter, huruf kecil/angka/strip, dan nggak boleh kata yang dipesan sistem." };
  if (!bankName || !bankAccount || !bankHolder) {
    return { ok: false, error: "Data rekening (bank, nomor, nama pemilik) wajib diisi buat pencairan komisi." };
  }

  try {
    const sql = getSql();
    const dupSlug = await sql`select 1 from domanic.affiliates where slug = ${slug} limit 1`;
    if (dupSlug.length) return { ok: false, error: "Username itu udah dipakai, coba yang lain." };
    const dupEmail = await sql`select 1 from domanic.affiliates where lower(email) = ${email} limit 1`;
    if (dupEmail.length) return { ok: false, error: "Email ini udah pernah daftar. Tunggu review admin ya." };

    await sql`
      insert into domanic.affiliates (slug, name, email, phone, social_url, bank_name, bank_account, bank_holder, status)
      values (${slug}, ${name}, ${email}, ${phone}, ${social}, ${bankName}, ${bankAccount}, ${bankHolder}, 'pending')`;
    return { ok: true, slug };
  } catch (e) {
    return { ok: false, error: "Gagal daftar, coba lagi sebentar lagi." };
  }
}

// Minta magic link login. Respon selalu generik biar nggak bocorin
// email mana yang terdaftar.
export async function requestAffiliateLogin(email) {
  const clean = (email || "").toString().trim().toLowerCase();
  const generic = { ok: true, message: "Kalau email itu terdaftar dan aktif, link masuk udah dikirim. Cek inbox (dan folder spam) ya, berlaku 15 menit." };
  if (!clean.includes("@")) return generic;
  try {
    const sql = getSql();
    const rows = await sql`
      select id, name from domanic.affiliates
      where lower(email) = ${clean} and status = 'approved' limit 1`;
    if (rows.length) {
      const token = createLoginToken(rows[0].id);
      const loginUrl = `${siteUrl()}/affiliate/masuk?token=${encodeURIComponent(token)}`;
      const { subject, html } = affiliateLoginEmail({ name: rows[0].name, loginUrl });
      await sendEmail({ to: clean, subject, html });
    }
  } catch {}
  return generic;
}

// Update kontak + rekening dari dashboard (butuh session).
export async function updateAffiliateProfile(input) {
  const id = getAffiliateId();
  if (!id) return { ok: false, error: "Sesi habis, login ulang lewat email." };
  const phone = (input?.phone || "").toString().trim().slice(0, 40);
  const bankName = (input?.bank_name || "").toString().trim().slice(0, 60);
  const bankAccount = (input?.bank_account || "").toString().trim().slice(0, 40);
  const bankHolder = (input?.bank_holder || "").toString().trim().slice(0, 120);
  if (!phone || !bankName || !bankAccount || !bankHolder) {
    return { ok: false, error: "Semua kolom wajib diisi." };
  }
  try {
    const sql = getSql();
    await sql`
      update domanic.affiliates
      set phone = ${phone}, bank_name = ${bankName},
          bank_account = ${bankAccount}, bank_holder = ${bankHolder}
      where id = ${id}`;
    return { ok: true };
  } catch {
    return { ok: false, error: "Gagal menyimpan, coba lagi." };
  }
}

export async function logoutAffiliate() {
  clearAffiliateSession();
  redirect("/affiliate/login");
}

// Ajukan pencairan komisi. Minimal Rp 250.000 saldo eligible.
// Komisi yang diajukan dikunci jadi 'requested' biar nggak dobel.
export async function requestPayout() {
  const id = getAffiliateId();
  if (!id) return { ok: false, error: "Sesi habis, login ulang lewat email." };
  try {
    const sql = getSql();
    let amount = 0;
    let aff = null;

    await sql.begin(async (tx) => {
      const [a] = await tx`
        select id, name, email from domanic.affiliates
        where id = ${id} and status = 'approved' limit 1 for update`;
      if (!a) throw new Error("AKUN");
      aff = a;

      const rows = await tx`
        select id, amount from domanic.affiliate_commissions
        where affiliate_id = ${id}
          and (status = 'eligible' or (status = 'pending' and eligible_at <= now()))
        for update`;
      amount = rows.reduce((s, r) => s + r.amount, 0);
      if (amount < 250000) throw new Error("MINIMAL");

      const [payout] = await tx`
        insert into domanic.affiliate_payouts (affiliate_id, amount, status)
        values (${id}, ${amount}, 'requested')
        returning id`;
      const ids = rows.map((r) => r.id);
      await tx`
        update domanic.affiliate_commissions
        set status = 'requested', payout_id = ${payout.id}
        where id = any(${ids})`;
    });

    // Email best-effort: konfirmasi ke affiliate + kabar ke admin.
    try {
      const { subject, html } = payoutRequestedEmail({ name: aff.name, amount });
      await sendEmail({ to: aff.email, subject, html });
      const adminTo = process.env.ADMIN_NOTIF_EMAIL || "ardi.kemara1@gmail.com";
      await sendEmail({
        to: adminTo,
        subject: `[Admin] Pengajuan pencairan affiliate: ${aff.name} (Rp ${amount.toLocaleString("id-ID")})`,
        html: `<p>${aff.name} mengajukan pencairan Rp ${amount.toLocaleString("id-ID")}. Proses di Admin &gt; Komisi &amp; Cashout, maksimal 3 hari kerja.</p>`,
      });
    } catch {}

    return { ok: true, amount };
  } catch (e) {
    if (e?.message === "MINIMAL") return { ok: false, error: "Saldo yang bisa dicairkan belum sampai Rp 250.000." };
    if (e?.message === "AKUN") return { ok: false, error: "Akun nggak aktif. Hubungi admin." };
    return { ok: false, error: "Gagal mengajukan, coba lagi." };
  }
}
