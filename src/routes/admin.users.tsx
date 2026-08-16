import { createFileRoute } from "@tanstack/react-router";
import AdminUsers from "@/components/pages/admin/Users";

export const Route = createFileRoute("/admin/users")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Users — CrypX-Pro Admin" },
      { name: "description", content: "Manage CrypX-Pro user accounts, balances, KYC state and trading controls." },
      { property: "og:title", content: "Users — CrypX-Pro Admin" },
      { property: "og:description", content: "Manage CrypX-Pro user accounts, balances, KYC state and trading controls." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AdminUsers />,
});
