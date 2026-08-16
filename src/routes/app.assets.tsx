import { createFileRoute } from "@tanstack/react-router";
import Assets from "@/components/pages/app/Assets";

export const Route = createFileRoute("/app/assets")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Assets — CrypX-Pro" },
      { name: "description", content: "View balances, deposit crypto and request withdrawals from your CrypX-Pro wallet." },
      { property: "og:title", content: "Assets — CrypX-Pro" },
      { property: "og:description", content: "View balances, deposit crypto and request withdrawals from your CrypX-Pro wallet." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Assets />,
});
