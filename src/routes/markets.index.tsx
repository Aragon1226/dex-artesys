import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero, Section, CtaRow } from "@/components/public/Section";
import { MarketTable, formatPrice } from "@/components/public/MarketTable";
import { publicMarketsQuery } from "@/lib/publicMarkets.queries";
import { publicHead, breadcrumbJsonLd } from "@/lib/publicSeo";

const TITLE = "Crypto & Synthetic Markets — Live Prices | Artesys";
const DESCRIPTION =
  "Browse every market listed on Artesys: live USDT prices, 24-hour change and volume for crypto majors, Layer 1 and Layer-2 tokens, DeFi, AI, meme coins and synthetic stocks & commodities.";

export const Route = createFileRoute("/markets/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(publicMarketsQuery()),
  head: () => ({
    ...publicHead({ title: TITLE, description: DESCRIPTION, path: "/markets" }),
    scripts: [
      breadcrumbJsonLd([
        { name: "Artesys", path: "/" },
        { name: "Markets", path: "/markets" },
      ]),
    ],
  }),
  component: MarketsPage,
});

function MarketsPage() {
  const { data: markets } = useSuspenseQuery(publicMarketsQuery());

  const movers = [...markets]
    .filter((m) => m.live)
    .sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h))
    .slice(0, 4);

  return (
    <PublicShell>
      <PageHero
        eyebrow="Markets"
        title="Every Artesys market, priced live in USDT"
        lede={`Artesys lists ${markets.length} markets across crypto majors, Layer 1 and Layer-2 networks, DeFi, AI and meme sectors, plus synthetic stocks and commodities. Every market is quoted against USDT and tradable on both spot and futures from a single balance.`}
      >
        <CtaRow
          primary={{ label: "Start trading", to: "/auth" }}
          secondary={{ label: "How trading works", to: "/trading" }}
        />
      </PageHero>

      {movers.length > 0 && (
        <Section
          title="Biggest 24-hour movers"
          intro="Ranked by absolute 24-hour price change across live exchange feeds."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {movers.map((m) => (
              <div key={m.symbol} className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-bold text-muted-foreground">{m.pair}</p>
                <p className="mt-2 font-mono text-lg font-bold text-foreground">
                  {formatPrice(m.price)}
                </p>
                <p
                  className={`mt-1 font-mono text-xs font-bold ${
                    m.change24h >= 0 ? "text-success" : "text-danger"
                  }`}
                >
                  {m.change24h >= 0 ? "+" : ""}
                  {m.change24h.toFixed(2)}% / 24h
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section
        title="All listed markets"
        intro="Search by ticker or name, or filter by sector. Select a market to see its full statistics and trading options."
      >
        <MarketTable markets={markets} />
      </Section>
    </PublicShell>
  );
}
