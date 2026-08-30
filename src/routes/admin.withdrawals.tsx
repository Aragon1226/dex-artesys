import { createFileRoute } from "@tanstack/react-router";
import AdminWithdrawals from "@/components/pages/admin/Withdrawals";

export const Route = createFileRoute("/admin/withdrawals")({
  ssr: false,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Withdrawals — Artesys Admin" },
      { name: "description", content: "Review, approve or reject pending withdrawal requests." },
      { property: "og:title", content: "Withdrawals — Artesys Admin" },
      { property: "og:description", content: "Review, approve or reject pending withdrawal requests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AdminWithdrawals />,
});
