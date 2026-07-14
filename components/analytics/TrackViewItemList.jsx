"use client";

import { useEffect, useRef } from "react";
import { trackViewItemList } from "@/lib/analytics";

// Fire view_item_list sekali pas grid produk ke-mount.
export default function TrackViewItemList({ slugs, listName }) {
  const doneRef = useRef(false);
  useEffect(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    trackViewItemList(slugs, listName);
  }, [slugs, listName]);
  return null;
}
