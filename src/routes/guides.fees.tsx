import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero, Section, Card, CardGrid, FaqList, CtaRow } from "@/components/public/Section";
import { publicHead, breadcrumbJsonLd, faqJsonLd } from "@/lib/publicSeo";

const TITLE = "Artesys Fees Explained — Spot, Futures & Withdrawals";
const DESCRIPTION =
  "How Artesys fees work: the 0.15% spot trading fee, futures funding and liquidation mechanics, network withdrawal costs and how fees appear in your order preview.";

const FAQS = [
  {
    q: "What is the Artesys spot trading fee?",
    a: "Spot orders carry a 0.15% fee on the traded value. The fee is shown in the order form before you confirm, so the amount you receive is never a surprise.",
  },
  {
    q: "Are there deposit fees?",
    a: "Artesys does not add a fee on deposits. The blockchain network you use to send funds may charge its own transaction cost.",
  },
  {
    q: "What does a withdrawal cost?",
    a: "Withdrawals pass on the network cost of moving the asset. The amount is displayed on the withdrawal screen before you submit the request.",
  },
  {
    q: "How are futures costs calculated?",
    a: "Futures positions use leverage, so your cost is a combination of the trading fee on notional value and the margin required to keep the position open.",
  },
];

export const Route = createFileRoute("/guides/fees")({
  head: () => ({
    ...publicHead({ title: TITLE, description: DESCRIPTION, path: "/guides/fees" }),
    scripts: [
      breadcrumbJsonLd([
        { name: "Artesys", path: "/" },
        { name: "Guides", path: "/guides" },
        { name: "Fees", path: "/guides/fees" },
      ]),
      faqJsonLd(FAQS),
    ],
  }),
  component: FeesGuide,
});

function FeesGuide() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Guide"
        title="Fees, in plain numbers"
        lede="Every Artesys order shows its cost before you confirm it. This guide explains where each fee comes from and how it affects the amount that lands in your wallet."
      >
        <CtaRow
          primary={{ label: "Open spot trading", to: "/trading/spot" }}
          secondary={{ label: "All guides", to: "/guides" }}
        />
      </PageHero>

      <Section title="Where fees apply">
        <CardGrid>
          <Card title="Spot trades — 0.15%">
            The fee is taken from the traded value on each filled spot order. Buying deducts it from
            the asset received; selling deducts it from the quote currency credited.
          </Card>
          <Card title="Futures positions">
            Fees are charged on notional size rather than margin, so a leveraged position costs more
            than the collateral it uses. Margin requirements are shown per position.
          </Card>
          <Card title="Deposits">
            Artesys adds nothing on top of a deposit. Only the sending network's own transaction
            cost applies.
          </Card>
          <Card title="Withdrawals">
            The network cost of the chosen asset and chain is passed through and displayed before
            you submit the request.
          </Card>
          <Card title="Conversions">
            Quick Convert uses the live market rate for the pair and applies the same spot fee rate
            to the converted value.
          </Card>
          <Card title="Earn products">
            Earn subscriptions have no entry or exit fee; returns are quoted net of platform costs.
          </Card>
        </CardGrid>
      </Section>

      <Section title="Worked example" intro="A simple spot buy, from order to balance.">
        <div className="rounded-2xl border border-border bg-card p-5 font-mono text-xs leading-relaxed text-muted-foreground">
          <p>Order: buy 1,000 USDT of BTC</p>
          <p>Fee: 1,000 × 0.15% = 1.50 USDT</p>
          <p>Value filled: 998.50 USDT worth of BTC credited to your spot wallet</p>
        </div>
      </Section>

      <Section title="Fee questions">
        <FaqList faqs={FAQS} />
      </Section>
    </PublicShell>
  );
}
