import { createFileRoute } from "@tanstack/react-router";
import Landing from "@/components/pages/Landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Artesys — Crypto Exchange | Spot, Futures & Earn" },
      { name: "description", content: "Trade crypto spot and futures, earn yield on your assets, and manage your portfolio on Artesys — a secure exchange built for modern traders." },
      { property: "og:title", content: "Artesys — Crypto Exchange | Spot, Futures & Earn" },
      { property: "og:description", content: "Trade crypto spot and futures, earn yield on your assets, and manage your portfolio on Artesys — a secure exchange built for modern traders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://cex.xn--artsys-dva.com/" },
      { property: "og:image", content: "https://cex.xn--artsys-dva.com/og-artesys.jpg" },
      { name: "twitter:image", content: "https://cex.xn--artsys-dva.com/og-artesys.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://cex.xn--artsys-dva.com/" }],
  }),
  component: () => <Landing />,
});
