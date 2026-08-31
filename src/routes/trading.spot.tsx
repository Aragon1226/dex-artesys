import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero, Section, Card, CardGrid, Steps, CtaRow, FaqList } from "@/components/public/Section";
import { publicHead, breadcrumbJsonLd, faqJsonLd } from "@/lib/publicSeo";

const TITLE = "Spot Trading — Order Types, Book & Fees | Artesys";
const DESCRIPTION =
  "Spot trading on Artesys: limit and market orders against USDT, a live order book, a flat 0.15% trading fee, and instant settlement into your spot wallet.";

const FAQS = [
  {
    q: "How is the spot fee calculated?",
    a: "The fee is 0.15% of the order total. On a buy it is deducted from the USDT you spend; on a sell it is deducted from the USDT proceeds. The order form shows the fee and the net amount before you confirm.",
  },
  {
    q: "Can I cancel an open limit order?",
    a: "Yes. Any unfilled limit order can be cancelled from the open orders list, and the reserved balance is released immediately.",
  },
  {
    q: "Where do filled orders appear?",
    a: "Filled orders move to your transaction history, and the asset balance updates in your Artesys spot wallet straight away.",
  },
];

export const Route = createFileRoute("/trading/spot")({
  head: () => ({
    ...publicHead({ title: TITLE, description: DESCRIPTION, path: "/trading/spot" }),
    scripts: [
      breadcrumbJsonLd([
        { name: "Artesys", path: "/" },
        { name: "Trading", path: "/trading" },
        { name: "Spot", path: "/trading/spot" },
      ]),
      faqJsonLd(FAQS),
    ],
  }),
  component: SpotTradingPage,
});

function SpotTradingPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Trading / Spot"
        title="Spot trading on Artesys"
        lede="Spot is the simplest way to trade on Artesys: swap USDT for an asset at a price you choose, or take the market price now. There is no leverage, no expiry and no liquidation — you hold the asset in your wallet until you sell it."
      >
        <CtaRow
          primary={{ label: "Start spot trading", to: "/auth" }}
          secondary={{ label: "View markets", to: "/markets" }}
        />
      </PageHero>

      <Section title="Placing an order" intro="The spot screen pairs a live chart and order book with the order form.">
        <Steps
          steps={[
            {
              title: "Pick a market",
              body: "Use the pair selector or search to open any listed market. All Artesys pairs are quoted in USDT.",
            },
            {
              title: "Choose buy or sell",
              body: "Buying spends USDT from your spot balance. Selling converts the asset back into USDT.",
            },
            {
              title: "Choose limit or market",
              body: "A limit order sets your own price and waits for the market. A market order executes at the best available price immediately.",
            },
            {
              title: "Review the fee and total",
              body: "The form calculates the 0.15% trading fee and the resulting net total before you confirm.",
            },
            {
              title: "Track the order",
              body: "Open orders stay listed until they fill or you cancel. Filled orders appear in your transaction history and update your balances.",
            },
          ]}
        />
      </Section>

      <Section title="What you see on the spot screen">
        <CardGrid>
          <Card title="Order book">
            Aggregated bids and asks with cumulative depth, so you can see where liquidity sits
            before committing to a price.
          </Card>
          <Card title="Price chart">
            Candlestick chart for the selected pair with configurable intervals, driven by the
            same feed as the market list.
          </Card>
          <Card title="Wallet panel">
            Your available USDT and asset balances for the current pair, so you can size an order
            without leaving the screen.
          </Card>
          <Card title="Quick convert">
            Swap between assets directly at market price when you do not need order-book control.
          </Card>
          <Card title="Transaction history">
            Every fill, cancellation and conversion is recorded per account and stays available for
            review.
          </Card>
          <Card title="Live prices">
            Prices stream continuously, so the order form always sizes against the current market.
          </Card>
        </CardGrid>
      </Section>

      <Section title="Spot FAQ">
        <FaqList faqs={FAQS} />
      </Section>
    </PublicShell>
  );
}
