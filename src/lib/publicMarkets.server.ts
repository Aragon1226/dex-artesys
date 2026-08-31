/**
 * Server-only market reader for the public (indexable) pages.
 *
 * Deliberately independent of src/services/market.ts: that module owns the
 * in-app websocket feed and the browser Supabase client. Here we only need a
 * synchronous server-side snapshot that can be rendered into the SSR HTML.
 */
import {
  ALL_SYMBOLS,
  FALLBACK_PRICES,
  getCategories,
  getMarketKind,
  getMarketName,
} from "./marketCatalog";

export interface PublicMarket {
  symbol: string;
  pair: string;
  name: string;
  kind: "crypto" | "alpha" | "tradfi";
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  categories: string[];
  live: boolean;
}

/** Stable pseudo-volume so SSR and client render identical markup. */
const baselineVolume = (symbol: string, price: number): number => {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = (hash * 31 + symbol.charCodeAt(i)) % 100000;
  }
  return Math.round(price * (5000 + hash));
};

const BINANCE_DOMAINS = ["api.binance.com", "api.binance.us"];

const fetchTickers = async (): Promise<Record<string, any> | null> => {
  for (const domain of BINANCE_DOMAINS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(`https://${domain}/api/v3/ticker/24hr`, {
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));
      if (!res.ok) continue;
      const data = await res.json();
      if (!Array.isArray(data)) continue;
      const byPair: Record<string, any> = {};
      for (const item of data) {
        if (typeof item?.symbol === "string" && item.symbol.endsWith("USDT")) {
          byPair[item.symbol] = item;
        }
      }
      return byPair;
    } catch {
      // try next domain
    }
  }
  return null;
};

let cache: { at: number; data: PublicMarket[] } | null = null;
const CACHE_MS = 20_000;

export const readPublicMarkets = async (): Promise<PublicMarket[]> => {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.data;

  const tickers = await fetchTickers();

  const markets: PublicMarket[] = ALL_SYMBOLS.map((symbol) => {
    const fallback = FALLBACK_PRICES[symbol] ?? 100;
    const ticker = tickers?.[`${symbol}USDT`];

    const price = ticker ? Number.parseFloat(ticker.lastPrice) : NaN;
    const usable = Number.isFinite(price) && price > 0;
    const finalPrice = usable ? price : fallback;
    const change = ticker ? Number.parseFloat(ticker.priceChangePercent) : NaN;
    const high = ticker ? Number.parseFloat(ticker.highPrice) : NaN;
    const low = ticker ? Number.parseFloat(ticker.lowPrice) : NaN;
    const volume = ticker ? Number.parseFloat(ticker.quoteVolume) : NaN;

    return {
      symbol,
      pair: `${symbol}/USDT`,
      name: getMarketName(symbol),
      kind: getMarketKind(symbol),
      price: finalPrice,
      change24h: usable && Number.isFinite(change) ? change : 0,
      high24h: Number.isFinite(high) && high > 0 ? high : finalPrice * 1.02,
      low24h: Number.isFinite(low) && low > 0 ? low : finalPrice * 0.98,
      volume24h:
        Number.isFinite(volume) && volume > 0
          ? volume
          : baselineVolume(symbol, finalPrice),
      categories: getCategories(symbol),
      live: usable,
    };
  });

  markets.sort((a, b) => b.volume24h - a.volume24h);
  cache = { at: Date.now(), data: markets };
  return markets;
};
