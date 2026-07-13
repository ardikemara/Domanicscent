"use server";

import { getSql } from "@/lib/db";
import { validSlug } from "@/lib/affiliate";

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
