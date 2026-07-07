import { products } from "@/lib/products";
import { articles } from "@/lib/journal";

const BASE = "https://www.domanicscent.com";

export default function sitemap() {
  const now = new Date();

  const staticPages = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/persona`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/shipping`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/journal`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ];

  const productPages = products.map((p) => ({
    url: `${BASE}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const personaPages = products.map((p) => ({
    url: `${BASE}/persona/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const articlePages = articles.map((a) => ({
    url: `${BASE}/journal/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...personaPages, ...articlePages];
}
