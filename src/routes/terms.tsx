import { createFileRoute } from "@tanstack/react-router";
import Settings from "@/components/pages/app/Settings";

export const Route = createFileRoute("/terms")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Terms of Service — Artesys" },
      { name: "description", content: "Read the Artesys terms of service covering trading, accounts and platform usage." },
      { property: "og:title", content: "Terms of Service — Artesys" },
      { property: "og:description", content: "Read the Artesys terms of service covering trading, accounts and platform usage." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://www.xn--artsys-dva.com/terms" },
    ],
    links: [{ rel: "canonical", href: "https://www.xn--artsys-dva.com/terms" }],
  }),
  component: () => <Settings initialTab="terms" />,
});
