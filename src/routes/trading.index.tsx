import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero, Section, Card, CardGrid, CtaRow, FaqList } from "@/components/public/Section";
import { publicHead, breadcrumbJsonLd, faqJsonLd } from "@/lib/publicSeo";

const TITLE = "Trading on Artesys — Spot & Leveraged Futures";
const DESCRIPTION =
  "How trading works on Artesys: USDT-quoted spot orders with a 0.15% fee, leveraged futures with timed settlement, order types, and a single balance across crypto and synthetic markets.";

const FAQS = [
  {
    q: "What does it cost to trade spot on Artesys?",
    a: "Spot orders carry a 0.15% trading fee, taken from the order total at execution. The fee is shown in the order form before you confirm.",
  },
  {
    q: "What is the difference between spot and futures on Artesys?",
    a: "A spot order exchanges USDT for the asset itself and settles into your spot wallet. A futures position uses margin and leverage, does not transfer the underlying asset, and settles automatically at the end of the duration you chose.",
  },
  {
    q: "Which markets can I trade?",
    a: "Every market listed on the Artesys markets page is quoted against USDT and available on both spot and futures, including crypto majors, Layer 1 and Layer-2 tokens, DeFi, AI and meme sectors, and synthetic stocks and commodities.",
  },
  {
    q: "Do spot and futures share the same balance?",
    a: "They are separate balances inside one account. You transfer USDT between your spot and futures wallets instantly from the assets screen, with no fee.",
  },
];

export const Route = createFileRoute("/trading/")({
  head: () => ({
    ...publicHead({ title: TITLE, description: DESCRIPTION, path: "/trading" }),
    scripts: [
      breadcrumbJsonLd([
        { name: "Artesys", path: "/" },
        { name: "Trading", path: "/trading" },
      ]),
      faqJsonLd(FAQS),
    ],
  }),
  component: TradingPage,
});

function TradingPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Trading"
        title="Two ways to trade, one account"
        lede="Artesys runs spot and leveraged futures side by side. Both are quoted in USDT, both draw on the same verified account, and both cover the full market list — crypto majors through to synthetic stocks and commodities."
      >
        <CtaRow
          primary={{ label: "Open an account", to: "/auth" }}
          secondary={{ label: "Browse markets", to: "/markets" }}
        />
      </PageHero>

      <Section
        title="Spot trading"
        intro="Direct ownership: you exchange USDT for the asset and it lands in your spot wallet."
      >
        <CardGrid>
          <Card title="Limit orders">
            Set the price you want. The order rests in the book until the market reaches it, and
            stays visible in your open orders until it fills or you cancel it.
          </Card>
          <Card title="Market orders">
            Execute immediately against the current best price. Useful when filling matters more
            than the exact level.
          </Card>
          <Card title="0.15% fee">
            A single flat trading fee applies to spot execution. It is calculated on the order total
            and displayed before you confirm.
          </Card>
        </CardGrid>
        <div className="mt-6">
          <CtaRow primary={{ label: "Spot trading in detail", to: "/trading/spot" }} />
        </div>
      </Section>

      <Section
        title="Futures trading"
        intro="Leveraged exposure with a fixed duration and automatic settlement."
      >
        <CardGrid>
          <Card title="Long or short">
            Take either direction on any listed pair. Your margin, leverage and entry price are
            recorded when the position opens.
          </Card>
          <Card title="Timed settlement">
            Each position runs for the duration you select. At expiry it closes automatically and
            the profit or loss posts to your futures balance.
          </Card>
          <Card title="Margin and leverage">
            Leverage multiplies the position size relative to the margin you commit, which magnifies
            both gains and losses.
          </Card>
        </CardGrid>
        <div className="mt-6">
          <CtaRow primary={{ label: "Futures trading in detail", to: "/trading/futures" }} />
        </div>
      </Section>

      <Section title="Common questions">
        <FaqList faqs={FAQS} />
      </Section>
    </PublicShell>
  );
}
