import { createFileRoute } from "@tanstack/react-router";
import AdminAdministrator from "@/components/pages/admin/Administrator";

export const Route = createFileRoute("/admin/administrator")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Administrators — Artesys Admin" },
      { name: "description", content: "Create staff accounts and assign page-level admin permissions." },
      { property: "og:title", content: "Administrators — Artesys Admin" },
      { property: "og:description", content: "Create staff accounts and assign page-level admin permissions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AdminAdministrator />,
});
