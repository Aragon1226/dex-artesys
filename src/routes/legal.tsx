import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero, Section, Card, CardGrid, FaqList } from "@/components/public/Section";
import { publicHead, breadcrumbJsonLd, faqJsonLd } from "@/lib/publicSeo";

const TITLE = "Legal & compliance — Artesys";
const DESCRIPTION =
  "Artesys legal centre: terms of service, privacy and AML policies, risk disclosure, educational demo platform notice, and how to contact us.";

const DOCS: { to: string; title: string; body: string }[] = [
  {
    to: "/terms",
    title: "Terms of service",
    body: "The rules that apply when you create an account and use the trading, wallet and yield features.",
  },
  {
    to: "/policies",
    title: "Privacy, AML & risk policies",
    body: "What data we collect, how it is stored and protected, and the anti-money-laundering safeguards in place.",
  },
  {
    to: "/guides/security",
    title: "Security overview",
    body: "Account isolation, session handling, wallet signature sign-in and verified email delivery.",
  },
  {
    to: "/guides/fees",
    title: "Fee schedule",
    body: "The trading fee applied to each order and how withdrawal handling is charged.",
  },
  {
    to: "/accounts",
    title: "Accounts & verification",
    body: "Account tiers, identity verification levels and what each level unlocks.",
  },
  {
    to: "/faq",
    title: "Frequently asked questions",
    body: "Short answers about deposits, withdrawals, verification and trading.",
  },
  {
    to: "/delete-account",
    title: "Delete your account & data",
    body: "How to erase your account yourself, or request deletion by email if you cannot sign in.",
  },
];

const FAQS = [
  {
    q: "Is Artesys a licensed broker or custodian?",
    a: "No. Artesys is an educational demo trading and market analysis platform. It does not provide brokerage, investment advice, or custodial fiat services, and nothing on the platform is a recommendation to buy or sell any asset.",
  },
  {
    q: "What are the main risks of using the platform?",
    a: "Digital asset prices are volatile and leveraged positions can be liquidated. Simulated balances and market data are provided for learning and evaluation, so results on the platform should never be treated as a forecast of real returns.",
  },
  {
    q: "How is my personal data handled?",
    a: "Account, verification and activity data is stored in an access-controlled database where each account can only reach its own records. Verification documents are kept in private storage and reviewed only by authorised staff.",
  },
  {
    q: "How do I request account or data deletion?",
    a: "You can request deletion from Settings inside the app, or email us. On deletion we remove your profile, balances, verification submissions and support history.",
  },
  {
    q: "Who do I contact about a legal or compliance matter?",
    a: "Email legal@artesys.cloud with the details of your request, including the email address registered to your account so we can locate it.",
  },
];

export const Route = createFileRoute("/legal")({
  head: () => ({
    ...publicHead({ title: TITLE, description: DESCRIPTION, path: "/legal" }),
    scripts: [
      breadcrumbJsonLd([
        { name: "Artesys", path: "/" },
        { name: "Legal", path: "/legal" },
      ]),
      faqJsonLd(FAQS),
    ],
  }),
  component: LegalPage,
});

function LegalPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Legal"
        title="Legal & compliance centre"
        lede="Everything that governs your use of Artesys in one place: the terms you agree to, how we handle your data, the risks involved, and how to reach us."
      />

      <Section
        title="Educational demo platform notice"
        intro="Please read this before you create an account."
      >
        <div className="rounded-2xl border border-primary/40 bg-primary/[0.06] p-5">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Artesys is an educational demo trading simulator and market analysis interface, built for
            learning, technology evaluation and software testing. Market data shown may be delayed or
            simulated. The platform does not hold real fiat funds, does not offer brokerage or
            investment management services, and nothing on it constitutes financial advice. Leveraged
            trading concepts are demonstrated for education only and can result in the total loss of a
            simulated position.
          </p>
        </div>
      </Section>

      <Section
        title="Documents & policies"
        intro="Each document is maintained separately and dated at the top of the page."
      >
        <CardGrid>
          {DOCS.map((d) => (
            <Link
              key={d.to}
              to={d.to as never}
              className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <h3 className="text-sm font-bold text-foreground">{d.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{d.body}</p>
            </Link>
          ))}
        </CardGrid>
      </Section>

      <Section title="Common legal questions">
        <FaqList faqs={FAQS} />
      </Section>

      <Section title="Contact" intro="We aim to respond to written requests within five working days.">
        <CardGrid>
          <Card title="Legal & compliance">legal@artesys.cloud</Card>
          <Card title="Privacy & data requests">privacy@artesys.cloud</Card>
          <Card title="Account support">support@artesys.cloud</Card>
        </CardGrid>
      </Section>
    </PublicShell>
  );
}
