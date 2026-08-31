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
