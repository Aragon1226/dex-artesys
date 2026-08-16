import { createFileRoute } from "@tanstack/react-router";
import AdminSampleTokens from "@/components/pages/admin/SampleTokens";

export const Route = createFileRoute("/admin/spot-control")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Spot Control — CrypX-Pro Admin" },
      { name: "description", content: "Manage listed sample tokens and simulated price movements." },
      { property: "og:title", content: "Spot Control — CrypX-Pro Admin" },
      { property: "og:description", content: "Manage listed sample tokens and simulated price movements." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AdminSampleTokens />,
});
