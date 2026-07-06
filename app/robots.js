const BASE = "https://www.domanicscent.com";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/thank-you"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
