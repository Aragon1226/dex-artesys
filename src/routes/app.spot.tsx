import { createFileRoute } from "@tanstack/react-router";
import Spot from "@/components/pages/app/Spot";

export const Route = createFileRoute("/app/spot")({
  ssr: false,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Spot Trading — Artesys" },
      { name: "description", content: "Place spot buy and sell orders with live charts and order history on Artesys." },
      { property: "og:title", content: "Spot Trading — Artesys" },
      { property: "og:description", content: "Place spot buy and sell orders with live charts and order history on Artesys." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Spot />,
});
