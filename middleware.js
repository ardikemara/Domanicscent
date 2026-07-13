import { NextResponse } from "next/server";

// Dukung ?ref=username di URL mana pun (mis. /products/velvet-rum?ref=ardi):
// set cookie referral last-touch 30 hari. Validasi format aja di sini (edge,
// nggak bisa akses DB); slug dicek beneran approved pas checkout.
const REF_COOKIE = "dmn_ref";
const MAX_AGE = 30 * 24 * 60 * 60;

export function middleware(req) {
  const ref = req.nextUrl.searchParams.get("ref");
  if (!ref) return NextResponse.next();
  const slug = ref.trim().toLowerCase();
  if (!/^[a-z0-9-]{3,30}$/.test(slug)) return NextResponse.next();

  const res = NextResponse.next();
  res.cookies.set(REF_COOKIE, slug, {
    maxAge: MAX_AGE,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
  return res;
}

export const config = {
  // Cukup halaman konten; skip asset, API, dan admin.
  matcher: ["/((?!api|admin|_next|images|notes|favicon|icon|apple-icon).*)"],
};
