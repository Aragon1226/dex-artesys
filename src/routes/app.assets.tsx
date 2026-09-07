import { createFileRoute } from "@tanstack/react-router";
import Assets from "@/components/pages/app/Assets";

export const Route = createFileRoute("/app/assets")({
  ssr: false,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Assets — Artesys" },
      {
        name: "description",
        content: "View balances, deposit crypto and request withdrawals from your Artesys wallet.",
      },
      { property: "og:title", content: "Assets — Artesys" },
      {
        property: "og:description",
        content: "View balances, deposit crypto and request withdrawals from your Artesys wallet.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Assets />,
});
