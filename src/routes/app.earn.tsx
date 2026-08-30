import { createFileRoute } from "@tanstack/react-router";
import Earn from "@/components/pages/app/Earn";

export const Route = createFileRoute("/app/earn")({
  ssr: false,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Earn — Artesys" },
      { name: "description", content: "Stake your crypto in Artesys Earn products and track accrued rewards." },
      { property: "og:title", content: "Earn — Artesys" },
      { property: "og:description", content: "Stake your crypto in Artesys Earn products and track accrued rewards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Earn />,
});
