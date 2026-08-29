import { createFileRoute } from "@tanstack/react-router";
import Settings from "@/components/pages/app/Settings";

export const Route = createFileRoute("/settings")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Account Settings — Artesys" },
      { name: "description", content: "Manage your Artesys profile, security preferences and account settings." },
      { property: "og:title", content: "Account Settings — Artesys" },
      { property: "og:description", content: "Manage your Artesys profile, security preferences and account settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Settings initialTab="overview" />,
});
