import { createFileRoute } from "@tanstack/react-router";
import Settings from "@/components/pages/app/Settings";

export const Route = createFileRoute("/policies")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Policies — Artesys" },
      {
        name: "description",
        content: "Privacy, AML and risk policies that govern the Artesys trading platform.",
      },
      { property: "og:title", content: "Policies — Artesys" },
      {
        property: "og:description",
        content: "Privacy, AML and risk policies that govern the Artesys trading platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://xn--artsys-dva.com/policies" },
    ],
    links: [{ rel: "canonical", href: "https://xn--artsys-dva.com/policies" }],
  }),
  component: () => <Settings initialTab="policies" />,
});
