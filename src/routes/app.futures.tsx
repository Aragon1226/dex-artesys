import { createFileRoute } from "@tanstack/react-router";
import Futures from "@/components/pages/app/Futures";

export const Route = createFileRoute("/app/futures")({
  ssr: false,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Futures Trading — Artesys" },
      { name: "description", content: "Open leveraged long and short futures positions with timed settlement on Artesys." },
      { property: "og:title", content: "Futures Trading — Artesys" },
      { property: "og:description", content: "Open leveraged long and short futures positions with timed settlement on Artesys." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Futures />,
});
