"use client";

import { usePathname } from "next/navigation";

// Sembunyiin header/footer/cart storefront di area admin.
export default function SiteChrome({ children }) {
  const pathname = usePathname() || "";
  if (pathname.startsWith("/admin")) return null;
  return <>{children}</>;
}
