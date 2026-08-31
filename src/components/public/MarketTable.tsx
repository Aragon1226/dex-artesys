import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { CryptoIcon } from "@/components/shared/CryptoIcon";
import { PUBLIC_MARKET_FILTERS } from "@/lib/marketCatalog";
import type { PublicMarket } from "@/lib/publicMarkets.types";

export const formatPrice = (price: number) =>
  price.toLocaleString("en-US", {
    minimumFractionDigits: price < 1 ? 6 : 2,
    maximumFractionDigits: price < 1 ? 6 : 2,
  });

export const formatVolume = (volume: number) => {
  if (volume >= 1_000_000_000) return `$${(volume / 1_000_000_000).toFixed(2)}B`;
  if (volume >= 1_000_000) return `$${(volume / 1_000_000).toFixed(2)}M`;
  if (volume >= 1_000) return `$${(volume / 1_000).toFixed(2)}K`;
  return `$${volume.toFixed(2)}`;
};

export const MarketTable = ({ markets }: { markets: PublicMarket[] }) => {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return markets.filter((m) => {
      const inFilter = filter === "All" || m.categories.includes(filter);
      const inQuery =
        !q ||
        m.symbol.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q);
      return inFilter && inQuery;
    });
  }, [markets, filter, query]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex items-center sm:w-72">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search BTC, TSLA, GOLD…"
            aria-label="Search Artesys markets"
            className="w-full rounded-xl border border-border bg-muted/40 py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <p className="text-xs font-medium text-muted-foreground">
          {rows.length} of {markets.length} markets
        </p>
      </div>

      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
        {PUBLIC_MARKET_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[600px] border-collapse text-sm">
          <caption className="sr-only">
            Live Artesys market prices, 24-hour change and 24-hour volume
          </caption>
          <thead>
            <tr className="border-b border-border bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
              <th scope="col" className="px-4 py-3 text-left font-bold">Market</th>
              <th scope="col" className="px-4 py-3 text-right font-bold">Price (USDT)</th>
              <th scope="col" className="px-4 py-3 text-right font-bold">24h change</th>
              <th scope="col" className="hidden px-4 py-3 text-right font-bold sm:table-cell">24h volume</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.symbol} className="border-b border-border/50 last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Link
                    to="/markets/$symbol"
                    params={{ symbol: m.symbol.toLowerCase() }}
                    className="flex items-center gap-3"
                  >
                    <CryptoIcon symbol={m.symbol} size={30} />
                    <span>
                      <span className="block font-bold text-foreground">{m.pair}</span>
                      <span className="block text-[11px] text-muted-foreground">{m.name}</span>
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-foreground">
                  {formatPrice(m.price)}
                </td>
                <td className={`px-4 py-3 text-right font-mono font-bold ${m.change24h >= 0 ? "text-success" : "text-danger"}`}>
                  {m.change24h >= 0 ? "+" : ""}
                  {m.change24h.toFixed(2)}%
                </td>
                <td className="hidden px-4 py-3 text-right font-mono text-muted-foreground sm:table-cell">
                  {formatVolume(m.volume24h)}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No markets match that search or category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketTable;
