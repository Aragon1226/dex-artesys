import { createFileRoute } from "@tanstack/react-router";
import Futures from "@/components/pages/app/Futures";

export const Route = createFileRoute("/app/futures")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Futures Trading — CrypX-Pro" },
      { name: "description", content: "Open leveraged long and short futures positions with timed settlement on CrypX-Pro." },
      { property: "og:title", content: "Futures Trading — CrypX-Pro" },
      { property: "og:description", content: "Open leveraged long and short futures positions with timed settlement on CrypX-Pro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Futures />,
});
