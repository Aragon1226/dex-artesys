import { createFileRoute } from "@tanstack/react-router";
import AdminSampleTokens from "@/components/pages/admin/SampleTokens";

export const Route = createFileRoute("/admin/sample-tokens")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sample Tokens — CrypX-Pro Admin" },
      { name: "description", content: "Create and control sample tokens available for spot trading." },
      { property: "og:title", content: "Sample Tokens — CrypX-Pro Admin" },
      { property: "og:description", content: "Create and control sample tokens available for spot trading." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AdminSampleTokens />,
});
