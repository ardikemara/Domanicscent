"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isAnalyticsEnabled, personaFromPath, trackPageView } from "@/lib/analytics";

const GA_ID = "G-80RCXM0CFZ";
const FB_PIXEL_ID = "1645092760955094";

// Base tag GA4 + Meta Pixel. HANYA hidup di production
// (build production Vercel + hostname domanicscent.com), di luar itu
// (preview deploy, local dev, route /admin/*) script TIDAK di-inject sama
// sekali: nol request ke googletagmanager/google-analytics/facebook.
// - send_page_view false: page_view awal di-fire dari init script (bawa
//   parameter persona di PDP/halaman persona), navigasi antar halaman (SPA)
//   di-fire dari useEffect di bawah lewat lib/analytics.js.
export default function Analytics() {
  const pathname = usePathname() || "";
  const isAdmin = pathname.startsWith("/admin");
  const [enabled, setEnabled] = useState(false);
  const firstLoadRef = useRef(true);

  // Guard runtime dicek setelah mount (butuh window.location.hostname).
  useEffect(() => {
    setEnabled(isAnalyticsEnabled());
  }, []);

  useEffect(() => {
    if (!enabled || isAdmin) return;
    // page_view + PageView pertama udah di-fire dari init script.
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      return;
    }
    trackPageView(pathname);
    if (window.fbq) window.fbq("track", "PageView");
  }, [pathname, enabled, isAdmin]);

  if (!enabled || isAdmin) return null;

  const initialPersona = personaFromPath(pathname);
  const personaParam = initialPersona
    ? `, { persona: ${JSON.stringify(initialPersona)} }`
    : "";

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
          gtag('event', 'page_view'${personaParam});
        `}
      </Script>

      {/* Meta Pixel */}
      <Script id="fb-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${FB_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
