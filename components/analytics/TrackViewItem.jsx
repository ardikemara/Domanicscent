"use client";

import { useEffect, useRef } from "react";
import { trackViewItem } from "@/lib/analytics";

// Fire view_item / ViewContent sekali pas halaman produk ke-mount.
export default function TrackViewItem({ slug }) {
  const doneRef = useRef(false);
  useEffect(() => {
    if (doneRef.current || !slug) return;
    doneRef.current = true;
    trackViewItem(slug);
  }, [slug]);
  return null;
}
