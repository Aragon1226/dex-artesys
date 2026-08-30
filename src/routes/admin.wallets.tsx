import { createFileRoute } from "@tanstack/react-router";
import AdminWallets from "@/components/pages/admin/Wallets";

export const Route = createFileRoute("/admin/wallets")({
  ssr: false,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Wallets — Artesys Admin" },
      { name: "description", content: "Configure deposit addresses per asset and network." },
      { property: "og:title", content: "Wallets — Artesys Admin" },
      { property: "og:description", content: "Configure deposit addresses per asset and network." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AdminWallets />,
});
