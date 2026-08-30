import { createFileRoute } from "@tanstack/react-router";
import Settings from "@/components/pages/app/Settings";

export const Route = createFileRoute("/app/faq")({
  ssr: false,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "FAQ — Artesys App" },
      { name: "description", content: "Answers to common questions about deposits, withdrawals, KYC and trading on Artesys." },
      { property: "og:title", content: "FAQ — Artesys App" },
      { property: "og:description", content: "Answers to common questions about deposits, withdrawals, KYC and trading on Artesys." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Settings initialTab="faq" />,
});
