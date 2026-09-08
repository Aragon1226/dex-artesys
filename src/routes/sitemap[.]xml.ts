import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { ALL_SYMBOLS } from "@/lib/marketCatalog";

const BASE_URL = "https://xn--artsys-dva.com";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

// Only public, indexable routes. /app/* and /admin/* are authenticated and noindex.
const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/markets", changefreq: "hourly", priority: "0.9" },
  { path: "/trading", changefreq: "monthly", priority: "0.8" },
  { path: "/trading/spot", changefreq: "monthly", priority: "0.8" },
  { path: "/trading/futures", changefreq: "monthly", priority: "0.8" },
  { path: "/assets", changefreq: "weekly", priority: "0.8" },
  { path: "/accounts", changefreq: "monthly", priority: "0.7" },
  { path: "/guides", changefreq: "monthly", priority: "0.7" },
  { path: "/guides/getting-started", changefreq: "monthly", priority: "0.7" },
  { path: "/guides/fees", changefreq: "monthly", priority: "0.7" },
  { path: "/guides/security", changefreq: "monthly", priority: "0.7" },
  { path: "/auth", changefreq: "monthly", priority: "0.6" },
  { path: "/faq", changefreq: "monthly", priority: "0.6" },
  { path: "/legal", changefreq: "yearly", priority: "0.5" },
  { path: "/policies", changefreq: "yearly", priority: "0.4" },
  { path: "/terms", changefreq: "yearly", priority: "0.4" },
  ...ALL_SYMBOLS.map<SitemapEntry>((s) => ({
    path: `/markets/${s.toLowerCase()}`,
    changefreq: "daily",
    priority: "0.6",
  })),
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
