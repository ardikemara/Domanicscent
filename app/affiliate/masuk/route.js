import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { verifyLoginToken, createAffiliateSession } from "@/lib/affiliateAuth";

export const dynamic = "force-dynamic";

// Tujuan magic link dari email. Token valid + affiliate masih approved
// -> set session 30 hari -> dashboard. Selain itu balik ke login.
export async function GET(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  const fail = NextResponse.redirect(new URL("/affiliate/login?e=1", req.url));

  const id = verifyLoginToken(token);
  if (!id) return fail;

  try {
    const sql = getSql();
    const rows = await sql`
      select id from domanic.affiliates where id = ${id} and status = 'approved' limit 1`;
    if (rows.length === 0) return fail;
  } catch {
    return fail;
  }

  createAffiliateSession(id);
  return NextResponse.redirect(new URL("/affiliate/dashboard", req.url));
}
