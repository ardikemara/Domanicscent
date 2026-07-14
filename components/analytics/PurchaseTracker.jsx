"use client";

import { useEffect, useRef } from "react";
import { isAnalyticsEnabled, trackPurchase } from "@/lib/analytics";

// Fire purchase HANYA lewat payload server (/api/analytics/purchase-payload).
// Server cuma ngasih payload sekali per order (kolom analytics_tracked_at),
// jadi refresh / bookmark thank-you page mustahil bikin double count.
export default function PurchaseTracker({ orderNumber }) {
  const doneRef = useRef(false);

  useEffect(() => {
    if (doneRef.current || !orderNumber) return;
    // Di preview/dev jangan panggil API sama sekali: payload purchase cuma
    // keluar SEKALI per order, jangan sampai kebakar tanpa event kekirim.
    if (!isAnalyticsEnabled()) return;
    doneRef.current = true;

    async function run() {
      try {
        const res = await fetch("/api/analytics/purchase-payload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: orderNumber }),
        });
        const data = await res.json();
        if (data?.track && data.order) trackPurchase(data.order);
      } catch {
        // diamkan; tracking nggak boleh ganggu halaman
      }
    }
    run();
  }, [orderNumber]);

  return null;
}
