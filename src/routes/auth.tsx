import { createFileRoute } from "@tanstack/react-router";
import Authentication from "@/components/pages/Authentication";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in or create your Artesys account" },
      { name: "description", content: "Access your Artesys account to trade, deposit and manage your crypto assets securely." },
      { property: "og:title", content: "Sign in or create your Artesys account" },
      { property: "og:description", content: "Access your Artesys account to trade, deposit and manage your crypto assets securely." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://www.xn--artsys-dva.com/auth" },
    ],
    links: [{ rel: "canonical", href: "https://www.xn--artsys-dva.com/auth" }],
  }),
  component: () => <Authentication />,
});
