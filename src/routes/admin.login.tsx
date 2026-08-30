import { createFileRoute } from "@tanstack/react-router";
import AdminLogin from "@/components/pages/admin/AdminLogin";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Administrator Portal Sign In — Artesys" },
      {
        name: "description",
        content: "Restricted administrator sign-in for the Artesys platform control portal.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Administrator Portal Sign In — Artesys" },
      {
        property: "og:description",
        content: "Restricted administrator sign-in for the Artesys platform control portal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminLogin,
});
