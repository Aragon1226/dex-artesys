import { createFileRoute } from "@tanstack/react-router";
import Market from "@/components/pages/app/Market";

export const Route = createFileRoute("/app/market")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Markets — Artesys" },
      { name: "description", content: "Live crypto market prices, movers and pair statistics on Artesys." },
      { property: "og:title", content: "Markets — Artesys" },
      { property: "og:description", content: "Live crypto market prices, movers and pair statistics on Artesys." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Market />,
});
