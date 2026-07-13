import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { validSlug, REF_COOKIE, REF_COOKIE_MAX_AGE } from "@/lib/affiliate";

export const dynamic = "force-dynamic";

// Link affiliate: domanicscent.com/r/[username].
// Catat klik, set cookie referral (last-touch, 30 hari), redirect ke homepage.
// Slug nggak valid / affiliate belum approved -> redirect aja tanpa cookie.
export async function GET(req, { params }) {
  const home = new URL("/", req.url);
  const slug = validSlug(params?.slug);
  if (!slug) return NextResponse.redirect(home);

  let ok = false;
  try {
    const sql = getSql();
    const rows = await sql`
      select id from domanic.affiliates
      where slug = ${slug} and status = 'approved' limit 1`;
    if (rows.length > 0) {
      ok = true;
      await sql`insert into domanic.affiliate_clicks (affiliate_id) values (${rows[0].id})`;
    }
  } catch {
    // DB lagi bermasalah: tetap redirect, pengunjung jangan sampai nyangkut.
  }

  const res = NextResponse.redirect(home);
  if (ok) {
    res.cookies.set(REF_COOKIE, slug, {
      maxAge: REF_COOKIE_MAX_AGE,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
  }
  return res;
}
