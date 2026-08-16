import { createFileRoute } from "@tanstack/react-router";
import AdminOwnership from "@/components/pages/admin/Ownership";

export const Route = createFileRoute("/admin/ownership")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Ownership — CrypX-Pro Admin" },
      { name: "description", content: "Owner-level controls for admin groups and platform ownership." },
      { property: "og:title", content: "Ownership — CrypX-Pro Admin" },
      { property: "og:description", content: "Owner-level controls for admin groups and platform ownership." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AdminOwnership />,
});
