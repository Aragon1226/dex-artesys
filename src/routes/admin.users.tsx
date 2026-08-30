import { createFileRoute } from "@tanstack/react-router";
import AdminUsers from "@/components/pages/admin/Users";

export const Route = createFileRoute("/admin/users")({
  ssr: false,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Users — Artesys Admin" },
      { name: "description", content: "Manage Artesys user accounts, balances, KYC state and trading controls." },
      { property: "og:title", content: "Users — Artesys Admin" },
      { property: "og:description", content: "Manage Artesys user accounts, balances, KYC state and trading controls." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AdminUsers />,
});
