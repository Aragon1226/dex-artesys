import { createFileRoute } from "@tanstack/react-router";
import Settings from "@/components/pages/app/Settings";

export const Route = createFileRoute("/faq")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "FAQ — CrypX-Pro" },
      { name: "description", content: "Answers to common questions about deposits, withdrawals, KYC and trading on CrypX-Pro." },
      { property: "og:title", content: "FAQ — CrypX-Pro" },
      { property: "og:description", content: "Answers to common questions about deposits, withdrawals, KYC and trading on CrypX-Pro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Settings initialTab="faq" />,
});
