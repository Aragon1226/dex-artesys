import { createFileRoute } from "@tanstack/react-router";
import Spot from "@/components/pages/app/Spot";

export const Route = createFileRoute("/app/spot")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Spot Trading — CrypX-Pro" },
      { name: "description", content: "Place spot buy and sell orders with live charts and order history on CrypX-Pro." },
      { property: "og:title", content: "Spot Trading — CrypX-Pro" },
      { property: "og:description", content: "Place spot buy and sell orders with live charts and order history on CrypX-Pro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Spot />,
});
