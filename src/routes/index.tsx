import { createFileRoute } from "@tanstack/react-router";
import Landing from "@/components/pages/Landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Artesys — Crypto Exchange | Spot, Futures & Earn" },
      {
        name: "description",
        content:
          "Trade crypto spot and futures, earn yield on your assets, and manage your portfolio on Artesys — a secure exchange built for modern traders.",
      },
      { property: "og:title", content: "Artesys — Crypto Exchange | Spot, Futures & Earn" },
      {
        property: "og:description",
        content:
          "Trade crypto spot and futures, earn yield on your assets, and manage your portfolio on Artesys — a secure exchange built for modern traders.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://xn--artsys-dva.com/" },
      { property: "og:image", content: "https://xn--artsys-dva.com/og-artesys.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Artesys — Crypto Exchange | Spot, Futures & Earn" },
      {
        name: "twitter:description",
        content:
          "Trade crypto spot and futures, earn yield on your assets, and manage your portfolio on Artesys — a secure exchange built for modern traders.",
      },
      { name: "twitter:image", content: "https://xn--artsys-dva.com/og-artesys.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://xn--artsys-dva.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Artesys",
          url: "https://xn--artsys-dva.com/",
          logo: "https://xn--artsys-dva.com/icons/icon-512x512.png",
          description:
            "Trade crypto spot and futures, earn yield on your assets, and manage your portfolio on Artesys — a secure exchange built for modern traders.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Artesys",
          url: "https://xn--artsys-dva.com/",
          publisher: { "@type": "Organization", name: "Artesys" },
        }),
      },
    ],
  }),
  component: () => <Landing />,
});
