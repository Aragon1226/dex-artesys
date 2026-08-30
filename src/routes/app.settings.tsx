import { createFileRoute } from "@tanstack/react-router";
import Settings from "@/components/pages/app/Settings";

export const Route = createFileRoute("/app/settings")({
  ssr: false,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Account Settings — Artesys App" },
      { name: "description", content: "Manage your Artesys profile, security preferences and account settings." },
      { property: "og:title", content: "Account Settings — Artesys App" },
      { property: "og:description", content: "Manage your Artesys profile, security preferences and account settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Settings initialTab="overview" />,
});
