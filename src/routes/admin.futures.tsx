import { createFileRoute } from "@tanstack/react-router";
import FuturesControl from "@/components/pages/admin/FuturesControl";

export const Route = createFileRoute("/admin/futures")({
  ssr: false,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Futures Control — Artesys Admin" },
      { name: "description", content: "Configure futures outcomes and per-user trading controls." },
      { property: "og:title", content: "Futures Control — Artesys Admin" },
      { property: "og:description", content: "Configure futures outcomes and per-user trading controls." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <FuturesControl />,
});
