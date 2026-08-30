import { createFileRoute } from "@tanstack/react-router";
import AdminKYC from "@/components/pages/admin/KYC";

export const Route = createFileRoute("/admin/kyc")({
  ssr: false,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "KYC Review — Artesys Admin" },
      { name: "description", content: "Approve or reject submitted identity verification documents." },
      { property: "og:title", content: "KYC Review — Artesys Admin" },
      { property: "og:description", content: "Approve or reject submitted identity verification documents." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AdminKYC />,
});
