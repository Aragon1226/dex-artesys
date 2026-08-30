import { createFileRoute } from "@tanstack/react-router";
import Settings from "@/components/pages/app/Settings";

export const Route = createFileRoute("/faq")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "FAQ — Artesys" },
      { name: "description", content: "Answers to common questions about deposits, withdrawals, KYC and trading on Artesys." },
      { property: "og:title", content: "FAQ — Artesys" },
      { property: "og:description", content: "Answers to common questions about deposits, withdrawals, KYC and trading on Artesys." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://xn--artsys-dva.com/faq" },
    ],
    links: [{ rel: "canonical", href: "https://xn--artsys-dva.com/faq" }],
  }),
  component: () => <Settings initialTab="faq" />,
});
