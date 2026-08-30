import { createFileRoute } from "@tanstack/react-router";
import Settings from "@/components/pages/app/Settings";

export const Route = createFileRoute("/app/terms")({
  ssr: false,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Terms of Service — Artesys App" },
      { name: "description", content: "In-app terms centre: the service terms that apply while you trade from your signed-in Artesys account." },
      { property: "og:title", content: "Terms of Service — Artesys App" },
      { property: "og:description", content: "In-app terms centre: the service terms that apply while you trade from your signed-in Artesys account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Settings initialTab="terms" />,
});
