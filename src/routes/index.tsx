import { createFileRoute } from "@tanstack/react-router";
import Landing from "@/components/pages/Landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Artesys — Crypto Trading, Futures and Earn" },
      { name: "description", content: "Trade spot and futures, stake for yield, and manage your crypto portfolio on Artesys." },
      { property: "og:title", content: "Artesys — Crypto Trading, Futures and Earn" },
      { property: "og:description", content: "Trade spot and futures, stake for yield, and manage your crypto portfolio on Artesys." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Landing />,
});
