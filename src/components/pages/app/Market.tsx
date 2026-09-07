import { useState, useEffect, useCallback } from "react";
import { Search, TrendingUp, Star, ChevronDown, Filter } from "lucide-react";
import { marketService, MarketData } from "@/services/market";
import { CryptoIcon } from "@/components/shared/CryptoIcon";
import { useNavigate } from "@/lib/router-compat";
import { useRealtimePrices } from "@/hooks/useRealtimePrices";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingBlock } from "@/components/shared/BrandLoader";
import { RetryState } from "@/components/shared/RetryState";
import { throwIfFaultInjected } from "@/lib/devFaults";

const MAIN_TABS = ["Overview", "Favorites", "Crypto", "Main", "Stocks & Commodities", "Alpha"];
const SUB_TABS = ["Spot", "Futures", "Margin"];
const FILTERS = [
  "All",
  "Main",
  "Stocks & Commodities",
  "Layer 1",
  "Layer-2",
  "DeFi",
  "Meme",
  "Alpha",
  "AI",
];

export const Market = () => {
  const navigate = useNavigate();
  const [activeMainTab, setActiveMainTab] = useState("Overview");
  const [activeSubTab, setActiveSubTab] = useState("Spot");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const rtPrices = useRealtimePrices(markets);

  const fetchMarkets = useCallback(async () => {
    try {
      throwIfFaultInjected("market", "Market feed unavailable.");
      const data = await marketService.getAllMarkets();
      setMarkets(data);
      setLoadError(null);
    } catch (err: any) {
      console.error(err);
      setLoadError(err?.message || "Market feed unavailable.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkets();
    const interval = setInterval(fetchMarkets, 10000);
    return () => clearInterval(interval);
  }, [fetchMarkets]);

  const filteredMarkets = markets.filter((m) => {
    const symbolMatches = m.pair.toLowerCase().includes(searchQuery.toLowerCase());

    const isAlpha = m.category.includes("Alpha");
    const isMain = m.category.includes("Main");
    const isStocksCommodities =
      m.category.includes("TradFi") || m.category.includes("Stocks & Commodities");

    let mainTabMatches = false;
    if (activeMainTab === "Overview") {
      mainTabMatches = true;
    } else if (activeMainTab === "Crypto") {
      mainTabMatches = !isStocksCommodities;
    } else if (activeMainTab === "Main") {
      mainTabMatches = isMain;
    } else if (activeMainTab === "Alpha") {
      mainTabMatches = isAlpha;
    } else if (activeMainTab === "Stocks & Commodities" || activeMainTab === "TradFi") {
      mainTabMatches = isStocksCommodities;
    } else if (activeMainTab === "Favorites") {
      mainTabMatches = false;
    }

    const filterMatches = activeFilter === "All" || m.category.includes(activeFilter);
    return symbolMatches && mainTabMatches && filterMatches;
  });

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        {/* Main Tabs */}
        <div className="px-4 border-b border-border overflow-x-auto no-scrollbar whitespace-nowrap bg-background">
          <div className="flex gap-6 py-3">
            {MAIN_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveMainTab(tab)}
                className={`text-sm font-bold transition-all relative ${
                  activeMainTab === tab ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {tab}
                {activeMainTab === tab && (
                  <div className="absolute -bottom-[13px] left-0 right-0 h-1 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="px-4 pt-3 pb-1 bg-background">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search markets (e.g., TSLA, BTC, NAS, GOLD)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/50 border border-border/80 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="px-4 flex gap-6 py-4 bg-background">
          {SUB_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`text-sm font-bold transition-all relative ${
                activeSubTab === tab ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {tab}
              {activeSubTab === tab && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="px-4 py-2 border-b border-border flex items-center justify-between overflow-x-auto no-scrollbar bg-background">
          <div className="flex gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeFilter === filter ? "bg-muted text-foreground" : "text-muted-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground ml-4">
            <Filter size={14} />
            <ChevronDown size={14} />
          </div>
        </div>

        {/* Symbol List Header */}
        <div className="px-4 py-3 flex text-[10px] font-bold text-muted-foreground uppercase tracking-wider items-center border-b border-border/50 bg-background">
          <div className="w-[45%] flex items-center gap-1">
            Coin / Volume <ChevronDown size={10} />
          </div>
          <div className="w-[30%] text-right flex items-center justify-end gap-1 px-2">
            Price <ChevronDown size={10} />
          </div>
          <div className="w-[25%] text-right flex items-center justify-end gap-1">
            Change <ChevronDown size={10} />
          </div>
        </div>
      </div>

      {/* Symbol List */}
      <div className="flex-1 overflow-y-auto bg-background">
        {loading ? (
          <div className="px-4 py-6">
            <LoadingBlock variant="table" rows={8} label="Loading market data" />
          </div>
        ) : loadError && markets.length === 0 ? (
          <RetryState
            size="lg"
            title="Market feed unavailable"
            description="We couldn't reach the price feed just now."
            detail={loadError}
            onRetry={fetchMarkets}
            retryLabel="Reload markets"
            secondary={{ label: "Go to assets", to: "/app/assets" }}
          />
        ) : (
          <div className="divide-y divide-border/50">
            {filteredMarkets.map((market) => {
              const rtPriceData = rtPrices[market.pair];
              const displayPrice = rtPriceData ? rtPriceData.price : market.price;
              const direction = rtPriceData ? rtPriceData.direction : null;
              const change24h =
                rtPriceData?.change24h !== undefined ? rtPriceData.change24h : market.change24h;
              const isUp = change24h >= 0;
              const cleanSymbol = market.pair.replace("/USDT", "");

              const flashClass =
                direction === "up"
                  ? "bg-success/10 text-success"
                  : direction === "down"
                    ? "bg-danger/10 text-danger"
                    : "text-foreground";

              return (
                <div
                  key={market.pair}
                  className={`px-4 py-4 flex items-center transition-active cursor-pointer hover:bg-muted/50 ${direction === "up" ? "bg-success/[0.03]" : direction === "down" ? "bg-danger/[0.03]" : ""} transition-colors duration-300`}
                  onClick={() =>
                    navigate(activeSubTab === "Futures" ? `/app/futures` : `/app/spot`)
                  }
                >
                  {/* Coin info */}
                  <div className="w-[45%] flex items-center gap-3">
                    <CryptoIcon symbol={cleanSymbol} size={36} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-foreground truncate">{cleanSymbol}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={12} className="text-primary fill-primary" />
                        <span className="text-[10px] text-muted-foreground font-bold">
                          {(market.volume24h / 1000000).toFixed(2)}M
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="w-[30%] text-right px-2">
                    <div
                      className={`font-bold font-mono transition-colors duration-300 ${flashClass}`}
                    >
                      {displayPrice.toLocaleString(undefined, {
                        minimumFractionDigits: displayPrice < 1 ? 4 : 2,
                        maximumFractionDigits: displayPrice < 1 ? 4 : 2,
                      })}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-bold font-mono">
                      $
                      {(displayPrice * 0.999).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>

                  {/* Change */}
                  <div className="w-[25%] flex justify-end">
                    <div
                      className={`px-2 py-2 rounded-lg text-white font-bold text-xs min-w-[75px] text-center transition-colors duration-300 ${
                        isUp ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {isUp ? "+" : ""}
                      {change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredMarkets.length === 0 && (
              <EmptyState
                art="history"
                title="No markets in this view"
                description="Nothing matches this category or search right now."
                hint="Switch to the All tab, or search by ticker (BTC, ETH, SOL) to jump straight to a market."
                action={{
                  label: "Show all markets",
                  onClick: () => {
                    setSearchQuery("");
                    setActiveFilter("All");
                  },
                }}
                secondaryAction={{ label: "Go to spot trading", to: "/app/spot" }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Market;
