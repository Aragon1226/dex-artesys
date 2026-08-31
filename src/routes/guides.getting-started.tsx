import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero, Section, Steps, FaqList, CtaRow } from "@/components/public/Section";
import { publicHead, breadcrumbJsonLd, faqJsonLd } from "@/lib/publicSeo";

const TITLE = "Getting Started on Artesys — Your First Trade";
const DESCRIPTION =
  "A step-by-step Artesys walkthrough: create an account, verify your identity, fund your wallet, read a market page and place your first spot order with confidence.";

const STEPS = [
  {
    title: "Create your account",
    body: "Register with an email address, a Google or Apple identity, or a Web3 wallet. Email sign-ups confirm the address from the message we send.",
  },
  {
    title: "Verify your identity",
    body: "Submit your documents once from settings. Verification unlocks the full account, including withdrawals, and its review status is visible throughout.",
  },
  {
    title: "Fund your wallet",
    body: "Deposit a supported asset to your Artesys address. Once the network confirms the transfer, the balance appears in your spot wallet.",
  },
  {
    title: "Study the market",
    body: "Open a market page to see the live price, 24-hour move and chart, then decide the price you are willing to pay or accept.",
  },
  {
    title: "Place a spot order",
    body: "Enter the amount, review the 0.15% fee shown in the order form, and confirm. Fills and history appear immediately under your transactions.",
  },
  {
    title: "Grow from there",
    body: "Explore leveraged futures, Earn products or Quick Convert once you are comfortable with how spot orders settle.",
  },
];

const FAQS = [
  {
    q: "How long does it take to start trading?",
    a: "Registration takes a minute and identity verification is a single submission. The main wait is the blockchain confirmation of your first deposit.",
  },
  {
    q: "What is the smallest amount I can trade?",
    a: "Order minimums are shown in the order form for each pair, and they are small enough to let you test the flow before committing real size.",
  },
  {
    q: "Should I start with spot or futures?",
    a: "Start with spot. You own the asset outright and there is no liquidation risk, which makes it the safer place to learn how orders fill.",
  },
];

export const Route = createFileRoute("/guides/getting-started")({
  head: () => ({
    ...publicHead({ title: TITLE, description: DESCRIPTION, path: "/guides/getting-started" }),
    scripts: [
      breadcrumbJsonLd([
        { name: "Artesys", path: "/" },
        { name: "Guides", path: "/guides" },
        { name: "Getting started", path: "/guides/getting-started" },
      ]),
      faqJsonLd(FAQS),
    ],
  }),
  component: GettingStartedGuide,
});

function GettingStartedGuide() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Guide"
        title="From sign-up to your first trade"
        lede="Six steps take you from an empty screen to a filled spot order. Nothing here assumes prior exchange experience."
      >
        <CtaRow
          primary={{ label: "Create an account", to: "/auth" }}
          secondary={{ label: "See the fee guide", to: "/guides/fees" }}
        />
      </PageHero>

      <Section title="The walkthrough">
        <Steps steps={STEPS} />
      </Section>

      <Section title="Common first questions">
        <FaqList faqs={FAQS} />
      </Section>
    </PublicShell>
  );
}
