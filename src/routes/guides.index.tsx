import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero, Section, CtaRow } from "@/components/public/Section";
import { publicHead, breadcrumbJsonLd } from "@/lib/publicSeo";

const TITLE = "Artesys Guides — Fees, Security & Getting Started";
const DESCRIPTION =
  "Practical Artesys guides: how trading fees are calculated, how the platform protects your account and funds, and a step-by-step walkthrough for your first trade.";

const GUIDES: { to: string; title: string; body: string }[] = [
  {
    to: "/guides/getting-started",
    title: "Getting started",
    body: "Create an account, verify your identity, fund your wallet and place your first spot order.",
  },
  {
    to: "/guides/fees",
    title: "Fees explained",
    body: "Spot and futures fee rates, how the 0.15% spot fee is applied, and what withdrawals cost.",
  },
  {
    to: "/guides/security",
    title: "Security overview",
    body: "How sessions, wallet signatures, verification and admin-side controls keep your account safe.",
  },
];

export const Route = createFileRoute("/guides/")({
  head: () => ({
    ...publicHead({ title: TITLE, description: DESCRIPTION, path: "/guides" }),
    scripts: [
      breadcrumbJsonLd([
        { name: "Artesys", path: "/" },
        { name: "Guides", path: "/guides" },
      ]),
    ],
  }),
  component: GuidesPage,
});

function GuidesPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Guides"
        title="Learn how Artesys works"
        lede="Short, practical explainers covering onboarding, costs and security — written so you know exactly what happens before you commit capital."
      >
        <CtaRow
          primary={{ label: "Start with the basics", to: "/guides/getting-started" }}
          secondary={{ label: "Browse markets", to: "/markets" }}
        />
      </PageHero>

      <Section title="All guides">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g) => (
            <Link
              key={g.to}
              to={g.to as never}
              className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <h3 className="text-sm font-bold text-foreground">{g.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{g.body}</p>
            </Link>
          ))}
        </div>
      </Section>
    </PublicShell>
  );
}
