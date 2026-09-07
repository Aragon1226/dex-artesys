import { createFileRoute } from "@tanstack/react-router";
import Settings from "@/components/pages/app/Settings";

export const Route = createFileRoute("/app/settings")({
  ssr: false,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Account Settings — Artesys App" },
      {
        name: "description",
        content:
          "Update your signed-in Artesys account: profile details, security options and session preferences.",
      },
      { property: "og:title", content: "Account Settings — Artesys App" },
      {
        property: "og:description",
        content:
          "Update your signed-in Artesys account: profile details, security options and session preferences.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Settings initialTab="overview" />,
});
