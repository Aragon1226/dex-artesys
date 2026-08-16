import { createFileRoute } from "@tanstack/react-router";
import Market from "@/components/pages/app/Market";

export const Route = createFileRoute("/app/market")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Markets — CrypX-Pro" },
      { name: "description", content: "Live crypto market prices, movers and pair statistics on CrypX-Pro." },
      { property: "og:title", content: "Markets — CrypX-Pro" },
      { property: "og:description", content: "Live crypto market prices, movers and pair statistics on CrypX-Pro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Market />,
});
