import { createFileRoute } from "@tanstack/react-router";
import DepositRequests from "@/components/pages/admin/DepositRequests";

export const Route = createFileRoute("/admin/deposit-requests")({
  ssr: false,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Deposit Requests — Artesys Admin" },
      { name: "description", content: "Verify deposit proofs and credit user balances." },
      { property: "og:title", content: "Deposit Requests — Artesys Admin" },
      { property: "og:description", content: "Verify deposit proofs and credit user balances." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <DepositRequests />,
});
