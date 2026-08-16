import { createFileRoute } from "@tanstack/react-router";
import Authentication from "@/components/pages/Authentication";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in or create your CrypX-Pro account" },
      { name: "description", content: "Access your CrypX-Pro account to trade, deposit and manage your crypto assets securely." },
      { property: "og:title", content: "Sign in or create your CrypX-Pro account" },
      { property: "og:description", content: "Access your CrypX-Pro account to trade, deposit and manage your crypto assets securely." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Authentication />,
});
