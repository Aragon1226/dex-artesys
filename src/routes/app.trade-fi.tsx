import { createFileRoute } from "@tanstack/react-router";
import TradeFi from "@/components/pages/app/TradeFi";

export const Route = createFileRoute("/app/trade-fi")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "TradeFi — CrypX-Pro" },
      { name: "description", content: "Choose between spot and futures trading modes inside the CrypX-Pro TradeFi hub." },
      { property: "og:title", content: "TradeFi — CrypX-Pro" },
      { property: "og:description", content: "Choose between spot and futures trading modes inside the CrypX-Pro TradeFi hub." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <TradeFi />,
});
