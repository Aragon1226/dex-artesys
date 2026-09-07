import { createFileRoute } from "@tanstack/react-router";
import Settings from "@/components/pages/app/Settings";

export const Route = createFileRoute("/app/policies")({
  ssr: false,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Policies — Artesys App" },
      {
        name: "description",
        content:
          "In-app policy centre: the privacy, AML and risk safeguards that apply to your signed-in Artesys account.",
      },
      { property: "og:title", content: "Policies — Artesys App" },
      {
        property: "og:description",
        content:
          "In-app policy centre: the privacy, AML and risk safeguards that apply to your signed-in Artesys account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Settings initialTab="policies" />,
});
