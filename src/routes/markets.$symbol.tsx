import { lazy, Suspense } from "react";
import { createFileRoute, notFound, ClientOnly, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PublicShell } from "@/components/public/PublicShell";
import { Section, CtaRow } from "@/components/public/Section";
import { formatPrice, formatVolume } from "@/components/public/MarketTable";
import { CryptoIcon } from "@/components/shared/CryptoIcon";
import { publicMarketsQuery } from "@/lib/publicMarkets.queries";
import { isListedSymbol, getMarketBlurb } from "@/lib/marketCatalog";
import { publicHead, breadcrumbJsonLd } from "@/lib/publicSeo";

const TradingChart = lazy(() => import("@/components/shared/TradingChart"));

export const Route = createFileRoute("/markets/$symbol")({
  loader: async ({ params, context }) => {
    const symbol = params.symbol.toUpperCase();
    if (!isListedSymbol(symbol)) throw notFound();
    const markets = await context.queryClient.ensureQueryData(publicMarketsQuery());
    const market = markets.find((m) => m.symbol === symbol);
    if (!market) throw notFound();
    return { market, blurb: getMarketBlurb(symbol) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Market unavailable — Artesys" }, { name: "robots", content: "noindex" }],
      };
    }
    const { market, blurb } = loaderData;
    const title = `${market.pair} — ${market.name} Price & Trading | Artesys`;
    const path = `/markets/${market.symbol.toLowerCase()}`;
    return {
      ...publicHead({ title, description: blurb, path }),
      scripts: [
        breadcrumbJsonLd([
          { name: "Artesys", path: "/" },
          { name: "Markets", path: "/markets" },
          { name: market.pair, path },
        ]),
      ],
    };
  },
  component: MarketDetailPage,
});

function MarketDetailPage() {
  const { blurb } = Route.useLoaderData();
  const { symbol } = Route.useParams();
  const { data: markets } = useSuspenseQuery(publicMarketsQuery());
  const market =
    markets.find((m) => m.symbol === symbol.toUpperCase()) ?? Route.useLoaderData().market;

  const stats = [
    { label: "Last price", value: `${formatPrice(market.price)} USDT` },
    {
      label: "24h change",
      value: `${market.change24h >= 0 ? "+" : ""}${market.change24h.toFixed(2)}%`,
      tone: market.change24h >= 0 ? "text-success" : "text-danger",
    },
    { label: "24h high", value: formatPrice(market.high24h) },
    { label: "24h low", value: formatPrice(market.low24h) },
    { label: "24h volume", value: formatVolume(market.volume24h) },
    { label: "Quote asset", value: "USDT" },
  ];

  const sectors = market.categories.filter((c) => c !== "All" && c !== market.symbol);

  return (
    <PublicShell>
      <section className="border-b border-border bg-gradient-to-b from-primary/[0.07] to-transparent px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground"
          >
            <Link to="/markets" className="hover:text-primary">
              Markets
            </Link>
            <span className="mx-2 text-border">/</span>
            <span className="text-foreground">{market.pair}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-4">
            <CryptoIcon symbol={market.symbol} size={54} />
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                {market.pair} — {market.name}
              </h1>
              <p className="mt-2 font-mono text-lg font-bold text-foreground">
                {formatPrice(market.price)} USDT{" "}
                <span className={market.change24h >= 0 ? "text-success" : "text-danger"}>
                  {market.change24h >= 0 ? "+" : ""}
                  {market.change24h.toFixed(2)}%
                </span>
              </p>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">{blurb}</p>

          <div className="mt-8">
            <CtaRow
              primary={{ label: `Trade ${market.symbol}`, to: "/auth" }}
              secondary={{ label: "All markets", to: "/markets" }}
            />
          </div>
        </div>
      </section>

      <Section
        title="Market statistics"
        intro="Live figures from the Artesys price feed, refreshed continuously."
      >
        <dl className="grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {s.label}
              </dt>
              <dd className={`mt-2 font-mono text-base font-bold ${s.tone ?? "text-foreground"}`}>
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section
        title={`${market.symbol} price chart`}
        intro="Hourly candles for the current session."
      >
        <div className="rounded-2xl border border-border bg-card p-3">
          <ClientOnly fallback={<div className="h-64 animate-pulse rounded-xl bg-muted/40" />}>
            <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-muted/40" />}>
              <TradingChart pair={market.pair} className="h-64" />
            </Suspense>
          </ClientOnly>
        </div>
      </Section>

      <Section title="How to trade this market">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-bold text-foreground">Spot</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Buy or sell {market.symbol} outright against your USDT spot balance using limit or
              market orders. Filled orders settle straight into your Artesys wallet.
            </p>
            <Link
              to="/trading/spot"
              className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-[0.15em] text-primary"
            >
              Spot trading →
            </Link>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-bold text-foreground">Futures</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Open a leveraged long or short on {market.pair} with a chosen duration. Positions
              settle automatically at expiry and the result posts to your futures balance.
            </p>
            <Link
              to="/trading/futures"
              className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-[0.15em] text-primary"
            >
              Futures trading →
            </Link>
          </div>
        </div>

        {sectors.length > 0 && (
          <p className="mt-6 text-xs text-muted-foreground">
            Sectors: <span className="text-foreground">{sectors.join(", ")}</span>
          </p>
        )}
      </Section>
    </PublicShell>
  );
}
