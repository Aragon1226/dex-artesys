import { createFileRoute } from "@tanstack/react-router";
import FinancialStatus from "@/components/pages/admin/FinancialStatus";

export const Route = createFileRoute("/admin/financial-status")({
  ssr: false,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Financial Status — Artesys Admin" },
      { name: "description", content: "Review aggregate user balances and adjust spot, futures and staked funds." },
      { property: "og:title", content: "Financial Status — Artesys Admin" },
      { property: "og:description", content: "Review aggregate user balances and adjust spot, futures and staked funds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <FinancialStatus />,
});
