import { createFileRoute } from "@tanstack/react-router";
import Settings from "@/components/pages/app/Settings";

export const Route = createFileRoute("/app/terms")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Terms of Service — Artesys App" },
      { name: "description", content: "Read the Artesys terms of service covering trading, accounts and platform usage." },
      { property: "og:title", content: "Terms of Service — Artesys App" },
      { property: "og:description", content: "Read the Artesys terms of service covering trading, accounts and platform usage." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Settings initialTab="terms" />,
});
