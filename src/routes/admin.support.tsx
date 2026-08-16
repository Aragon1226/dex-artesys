import { createFileRoute } from "@tanstack/react-router";
import AdminSupport from "@/components/pages/admin/Support";

export const Route = createFileRoute("/admin/support")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Support — CrypX-Pro Admin" },
      { name: "description", content: "Monitor support conversations raised by CrypX-Pro users." },
      { property: "og:title", content: "Support — CrypX-Pro Admin" },
      { property: "og:description", content: "Monitor support conversations raised by CrypX-Pro users." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AdminSupport />,
});
