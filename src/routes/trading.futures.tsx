import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero, Section, Card, CardGrid, Steps, CtaRow, FaqList } from "@/components/public/Section";
import { publicHead, breadcrumbJsonLd, faqJsonLd } from "@/lib/publicSeo";

const TITLE = "Futures Trading — Leverage, Margin & Settlement | Artesys";
const DESCRIPTION =
  "Futures trading on Artesys: leveraged long and short positions on any listed market, margin sizing, timed settlement, and profit or loss posted to your futures balance.";

const FAQS = [
  {
    q: "How does settlement work on Artesys futures?",
    a: "Each position is opened with a duration. When that duration elapses the position closes automatically at the settlement price and the profit or loss is applied to your futures balance — there is no need to close it manually.",
  },
  {
    q: "What is margin?",
    a: "Margin is the USDT you commit from your futures balance to open the position. Leverage multiplies that margin into a larger position size, so both profit and loss are calculated on the larger amount.",
  },
  {
    q: "Do I need a separate futures balance?",
    a: "Yes. Futures use a dedicated balance inside your account. You move USDT between your spot and futures wallets instantly from the assets screen at no cost.",
  },
  {
    q: "Which markets support futures?",
    a: "Every pair on the Artesys market list, including crypto majors, Alpha and Main tokens, and synthetic stocks and commodities such as GOLD, OIL and equity tickers.",
  },
];

export const Route = createFileRoute("/trading/futures")({
  head: () => ({
    ...publicHead({ title: TITLE, description: DESCRIPTION, path: "/trading/futures" }),
    scripts: [
      breadcrumbJsonLd([
        { name: "Artesys", path: "/" },
        { name: "Trading", path: "/trading" },
        { name: "Futures", path: "/trading/futures" },
      ]),
      faqJsonLd(FAQS),
    ],
  }),
  component: FuturesTradingPage,
});

function FuturesTradingPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Trading / Futures"
        title="Leveraged futures with timed settlement"
        lede="Artesys futures let you take a leveraged view on any listed market without holding the underlying asset. You choose direction, margin, leverage and duration; the position settles automatically when the timer ends."
      >
        <CtaRow
          primary={{ label: "Open a futures account", to: "/auth" }}
          secondary={{ label: "See tradable markets", to: "/markets" }}
        />
      </PageHero>

      <Section title="Opening a position">
        <Steps
          steps={[
            {
              title: "Fund your futures balance",
              body: "Transfer USDT from your spot wallet to your futures wallet on the assets screen. Transfers are instant and free.",
            },
            {
              title: "Select a market and direction",
              body: "Go long if you expect the price to rise, or short if you expect it to fall. Both directions are available on every listed pair.",
            },
            {
              title: "Set margin and leverage",
              body: "Margin is the amount you commit. Leverage multiplies it into the position size used to calculate your result.",
            },
            {
              title: "Choose the duration",
              body: "Positions run for a fixed period. The entry price and start time are recorded when the position opens.",
            },
            {
              title: "Let it settle",
              body: "At expiry the position closes automatically and the profit or loss is written to your futures balance and position history.",
            },
          ]}
        />
      </Section>

      <Section title="Key mechanics">
        <CardGrid>
          <Card title="Long and short">
            Direction is fixed at entry. A long profits from an increase in price relative to the
            entry; a short profits from a decrease.
          </Card>
          <Card title="Position size">
            Size equals margin multiplied by leverage. Profit and loss are calculated on that size,
            not on the margin alone.
          </Card>
          <Card title="Entry and settlement price">
            Entry is captured at the moment the position opens. Settlement uses the market price
            when the duration expires.
          </Card>
          <Card title="Open positions view">
            Live positions show margin, leverage, entry price, remaining time and running PnL.
          </Card>
          <Card title="Position history">
            Every settled position is retained with its result, so performance can be reviewed at
            any time.
          </Card>
          <Card title="Risk">
            Leverage magnifies losses as well as gains. Only commit margin you are prepared to
            lose, and read the terms before trading.
          </Card>
        </CardGrid>
      </Section>

      <Section title="Futures FAQ">
        <FaqList faqs={FAQS} />
      </Section>
    </PublicShell>
  );
}
