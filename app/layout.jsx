import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteChrome from "@/components/SiteChrome";
import { CartProvider } from "@/components/cart/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";
import Analytics from "@/components/Analytics";

export const metadata = {
  metadataBase: new URL("https://www.domanicscent.com"),
  title: "DOMANIC · Extrait de Parfum Indonesia · Wear Your Identity",
  description:
    "Domanic Scent, extrait de parfum lokal premium yang dibuat pelan di Indonesia dan fully macerated 2-4 minggu. Empat parfum, empat persona, satu yang paling kamu banget.",
  openGraph: {
    type: "website",
    siteName: "DOMANIC",
    locale: "id_ID",
    url: "/",
    title: "DOMANIC · Extrait de Parfum Indonesia · Wear Your Identity",
    description:
      "Extrait de parfum lokal premium, dibuat pelan di Indonesia dan fully macerated 2-4 minggu. Empat parfum, empat persona, satu yang paling kamu banget.",
    images: [{ url: "/images/hero.jpg", width: 1200, height: 630, alt: "Domanic Scent, empat extrait de parfum" }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Questrial&family=Inter:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Analytics />
        <CartProvider>
          <SiteChrome><Header /></SiteChrome>
          <main>{children}</main>
          <SiteChrome>
            <Footer />
            <CartDrawer />
          </SiteChrome>
        </CartProvider>
      </body>
    </html>
  );
}
