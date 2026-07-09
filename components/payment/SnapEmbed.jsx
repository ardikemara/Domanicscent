"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSnapToken } from "@/app/checkout/actions";
import { embedSnap } from "@/components/payment/snap";

export default function SnapEmbed({ orderNumber }) {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return; // guard strict-mode double mount
    startedRef.current = true;

    async function run() {
      const res = await getSnapToken(orderNumber);
      if (!res.ok) {
        setLoading(false);
        setErr(res.error || "Gagal menyiapkan pembayaran.");
        return;
      }
      const goThanks = () => router.push(`/thank-you?order=${encodeURIComponent(orderNumber)}`);
      try {
        await embedSnap(res.snapToken, "snap-embed", {
          onSuccess: goThanks,
          onPending: goThanks,
          onError: () => setErr("Pembayaran gagal. Refresh halaman ini untuk coba lagi."),
        });
        setLoading(false);
      } catch {
        setLoading(false);
        setErr("Gagal memuat modul pembayaran, refresh dan coba lagi.");
      }
    }
    run();
  }, [orderNumber, router]);

  return (
    <div className="pay__embedwrap">
      {loading && <p className="pay__loading">Memuat pembayaran...</p>}
      {err && <p className="pay__err">{err}</p>}
      <div id="snap-embed" />
    </div>
  );
}
