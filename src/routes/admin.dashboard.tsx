import { createFileRoute } from "@tanstack/react-router";
import AdminDashboard from "@/components/pages/admin/AdminDashboard";

export const Route = createFileRoute("/admin/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Admin Dashboard — Artesys" },
      { name: "description", content: "Platform overview: users, deposits, withdrawals and wallet status." },
      { property: "og:title", content: "Admin Dashboard — Artesys" },
      { property: "og:description", content: "Platform overview: users, deposits, withdrawals and wallet status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AdminDashboard />,
});
