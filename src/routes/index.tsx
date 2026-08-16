import { createFileRoute } from "@tanstack/react-router";
import Landing from "@/components/pages/Landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CrypX-Pro — Crypto Trading, Futures and Earn" },
      { name: "description", content: "Trade spot and futures, stake for yield, and manage your crypto portfolio on CrypX-Pro." },
      { property: "og:title", content: "CrypX-Pro — Crypto Trading, Futures and Earn" },
      { property: "og:description", content: "Trade spot and futures, stake for yield, and manage your crypto portfolio on CrypX-Pro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Landing />,
});
