import { createFileRoute } from "@tanstack/react-router";
import AdminSampleTokens from "@/components/pages/admin/SampleTokens";

export const Route = createFileRoute("/admin/spot-control")({
  ssr: false,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Spot Control — Artesys Admin" },
      { name: "description", content: "Manage listed sample tokens and simulated price movements." },
      { property: "og:title", content: "Spot Control — Artesys Admin" },
      { property: "og:description", content: "Manage listed sample tokens and simulated price movements." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AdminSampleTokens />,
});
