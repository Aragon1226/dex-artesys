import { createFileRoute } from "@tanstack/react-router";
import Settings from "@/components/pages/app/Settings";

export const Route = createFileRoute("/app/policies")({
  ssr: false,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Policies — Artesys App" },
      { name: "description", content: "Privacy, AML and risk policies that govern the Artesys trading platform." },
      { property: "og:title", content: "Policies — Artesys App" },
      { property: "og:description", content: "Privacy, AML and risk policies that govern the Artesys trading platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Settings initialTab="policies" />,
});
