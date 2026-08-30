import { createFileRoute } from "@tanstack/react-router";
import Settings from "@/components/pages/app/Settings";

export const Route = createFileRoute("/app/faq")({
  ssr: false,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "FAQ — Artesys App" },
      { name: "description", content: "In-app help centre: step-by-step guidance for using your Artesys account, deposits, orders and verification." },
      { property: "og:title", content: "FAQ — Artesys App" },
      { property: "og:description", content: "In-app help centre: step-by-step guidance for using your Artesys account, deposits, orders and verification." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Settings initialTab="faq" />,
});
