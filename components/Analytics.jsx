"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const GA_ID = "G-80RCXM0CFZ";
const FB_PIXEL_ID = "1645092760955094";

// Base tag GA4 + Meta Pixel.
// - Route /admin/*: komponen return null, jadi script TIDAK di-load sama sekali
//   (nol request ke google-analytics.com / facebook.com dari halaman admin).
// - send_page_view false: page_view awal di-fire manual dari init script,
//   navigasi antar halaman (SPA) di-fire dari useEffect di bawah.
export default function Analytics() {
  const pathname = usePathname() || "";
  const isAdmin = pathname.startsWith("/admin");
  const firstLoadRef = useRef(true);

  useEffect(() => {
    if (isAdmin) return;
    // page_view pertama udah di-fire dari init script (urutan load aman).
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      return;
    }
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_location: window.location.href,
        page_title: document.title,
      });
    }
    if (window.fbq) window.fbq("track", "PageView");
  }, [pathname, isAdmin]);

  if (isAdmin) return null;

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
          gtag('event', 'page_view');
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
