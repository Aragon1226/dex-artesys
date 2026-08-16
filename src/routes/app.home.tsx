import { createFileRoute } from "@tanstack/react-router";
import UserHome from "@/components/pages/app/UserHome";

export const Route = createFileRoute("/app/home")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Dashboard — CrypX-Pro" },
      { name: "description", content: "Your CrypX-Pro dashboard: balances, portfolio breakdown, deposits and account activity." },
      { property: "og:title", content: "Dashboard — CrypX-Pro" },
      { property: "og:description", content: "Your CrypX-Pro dashboard: balances, portfolio breakdown, deposits and account activity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <UserHome />,
});
