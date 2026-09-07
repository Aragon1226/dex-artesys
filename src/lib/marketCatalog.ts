/**
 * Browser-safe market catalog: symbol lists, categories, baseline prices and
 * editorial copy. Imported by both the in-app market service and the public
 * SSR-rendered marketing/market pages, so it must stay free of any
 * browser-only or server-only dependency.
 */

export const FAKE_SYMBOLS = [
  "AUR",
  "VTX",
  "NEX",
  "GLX",
  "PHX",
  "ZEL",
  "CRY",
  "ION",
  "NOVA",
  "LYN",
  "NAS",
  "AEP",
  "ECB",
  "BOT",
  "TTZS",
  "OCT",
  "CFR",
  "STC",
  "CFT",
  "RTV",
  "JOE",
  "REO",
  "BEX",
  "RYR",
  "OAS",
  "JTC",
];

export const TRADFI_SYMBOLS = [
  "CPX",
  "ARTS",
  "AXG",
  "BGNX",
  "VOLT",
  "QCORE",
  "CYBR",
  "OMNI",
  "CINE",
  "TFRA",
  "AAPL",
  "TSLA",
  "NVDA",
  "AMZN",
  "MSFT",
  "GOOGL",
  "META",
  "NFLX",
  "AMD",
  "COIN",
  "MSTR",
  "SPY",
  "VIX",
  "GOLD",
  "SILVER",
  "OIL",
];

export const MAJOR_SYMBOLS = [
  "BTC",
  "ETH",
  "BNB",
  "SOL",
  "XRP",
  "ADA",
  "LINK",
  "DOT",
  "AVAX",
  "MATIC",
  "DOGE",
  "SHIB",
  "PEPE",
  "WIF",
  "NEAR",
  "APT",
  "UNI",
  "AAVE",
  "MKR",
  "CRV",
  "LDO",
  "AXS",
  "SAND",
  "MANA",
  "IMX",
  "APE",
  "SUI",
  "SEI",
  "FTM",
  "OP",
  "ARB",
  "POL",
  "TRX",
  "LTC",
  "ETC",
  "BCH",
  "ATOM",
  "ALGO",
  "HBAR",
  "VET",
  "FET",
  "RENDER",
  "WLD",
  "GRT",
  "BONK",
  "FLOKI",
  "BOME",
  "POPCAT",
  "MEME",
  "BRETT",
  "FTT",
  "LUNC",
  "USTC",
  "ALPHA",
  "TRU",
  "UNFI",
  "GAS",
  "LOOM",
  "PHB",
  "KEY",
  "REEF",
  "LINA",
  "JASMY",
  "GALA",
  "CHZ",
  "FIL",
  "ICP",
];

/** Every symbol Artesys lists, in a stable order. */
export const ALL_SYMBOLS = [...MAJOR_SYMBOLS, ...FAKE_SYMBOLS, ...TRADFI_SYMBOLS];

export const FALLBACK_PRICES: Record<string, number> = {
  // Major
  BTC: 89500,
  ETH: 4850,
  BNB: 820,
  SOL: 245,
  XRP: 1.45,
  ADA: 0.85,
  LINK: 45.2,
  DOT: 12.4,
  AVAX: 88.5,
  MATIC: 1.25,
  DOGE: 0.28,
  SHIB: 0.000045,
  PEPE: 0.000025,
  WIF: 8.4,
  NEAR: 12.1,
  APT: 18.3,
  UNI: 15.2,
  AAVE: 285.0,
  MKR: 4200.0,
  CRV: 1.15,
  LDO: 4.8,
  AXS: 12.5,
  SAND: 1.85,
  MANA: 2.1,
  IMX: 4.5,
  APE: 3.2,

  // Popular & Alpha minors
  SUI: 3.12,
  SEI: 0.65,
  FTM: 1.18,
  OP: 3.82,
  ARB: 1.45,
  POL: 0.58,
  TRX: 0.165,
  LTC: 110.5,
  ETC: 32.4,
  BCH: 510.2,
  ATOM: 9.8,
  ALGO: 0.28,
  HBAR: 0.115,
  VET: 0.042,
  BONK: 0.00003102,
  FLOKI: 0.000244,
  BOME: 0.0125,
  POPCAT: 1.85,
  MEME: 0.0185,
  BRETT: 0.145,
  FTT: 105.93,
  LUNC: 0.000108,
  USTC: 0.0245,
  ALPHA: 0.138,
  TRU: 0.125,
  UNFI: 4.25,
  GAS: 5.82,
  LOOM: 0.082,
  PHB: 2.15,
  KEY: 0.0068,
  REEF: 0.00195,
  LINA: 0.0084,
  FET: 1.68,
  RENDER: 7.82,
  WLD: 3.42,
  GRT: 0.265,
  JASMY: 0.0285,
  GALA: 0.045,
  CHZ: 0.108,
  FIL: 5.65,
  ICP: 14.8,

  // Custom Layer-2 & Alpha sample tokens
  NAS: 92.54,
  AEP: 84.97,
  ECB: 89.32,
  BOT: 123.5,
  TTZS: 131.75,
  OCT: 101.94,
  CFR: 127.78,
  STC: 132.22,
  CFT: 131.81,
  RTV: 140.62,
  JOE: 140.52,
  REO: 111.31,
  BEX: 128.3,
  RYR: 120.27,
  OAS: 110.45,
  JTC: 66.81,

  // Alpha (platform custom)
  AUR: 12.5,
  VTX: 4.8,
  NEX: 0.95,
  GLX: 22.4,
  PHX: 1.25,
  ZEL: 0.45,
  CRY: 8.5,
  ION: 1.15,
  NOVA: 0.85,
  LYN: 0.35,
  USDT: 1,

  // Stocks & Commodities
  CPX: 285.5,
  ARTS: 164.2,
  AXG: 215.8,
  BGNX: 92.4,
  VOLT: 148.6,
  QCORE: 312.0,
  CYBR: 185.3,
  OMNI: 230.1,
  CINE: 78.9,
  TFRA: 112.5,
  AAPL: 245.5,
  TSLA: 310.4,
  NVDA: 138.2,
  AMZN: 212.8,
  MSFT: 425.6,
  GOOGL: 178.5,
  META: 585.3,
  NFLX: 860.2,
  AMD: 122.4,
  COIN: 320.1,
  MSTR: 340.5,
  SPY: 582.2,
  VIX: 12.5,
  GOLD: 2650.5,
  SILVER: 31.8,
  OIL: 78.4,
};

const LAYER1 = [
  "SOL",
  "AVAX",
  "NEAR",
  "APT",
  "ADA",
  "DOT",
  "SUI",
  "SEI",
  "FTM",
  "OP",
  "ARB",
  "POL",
  "TRX",
  "LTC",
  "ETC",
  "BCH",
  "ATOM",
  "ALGO",
  "HBAR",
  "VET",
];
const LAYER2 = [
  "OP",
  "ARB",
  "NAS",
  "AEP",
  "ECB",
  "BOT",
  "TTZS",
  "OCT",
  "CFR",
  "STC",
  "CFT",
  "RTV",
  "JOE",
  "REO",
  "BEX",
  "RYR",
  "OAS",
  "JTC",
];
const MEME = ["DOGE", "SHIB", "PEPE", "WIF", "BONK", "FLOKI", "BOME", "POPCAT", "MEME", "BRETT"];
const DEFI = [
  "UNI",
  "AAVE",
  "MKR",
  "CRV",
  "LDO",
  "FET",
  "RENDER",
  "WLD",
  "GRT",
  "JASMY",
  "GALA",
  "CHZ",
  "FIL",
  "ICP",
  "FTT",
  "LUNC",
  "USTC",
  "ALPHA",
  "TRU",
  "UNFI",
  "GAS",
  "LOOM",
  "PHB",
  "KEY",
  "REEF",
  "LINA",
];
const AI = ["FET", "RENDER", "WLD", "GRT"];
const NFT = ["AXS", "SAND", "MANA", "IMX", "APE"];

/** Categories for a symbol. Accepts "BTC" or "BTCUSDT". */
export const getCategories = (symbol: string): string[] => {
  const s = symbol.replace("USDT", "");
  const cats = ["All", s];

  if (LAYER1.includes(s)) cats.push("Layer 1");
  if (LAYER2.includes(s)) cats.push("Layer-2");
  if (MEME.includes(s)) cats.push("Meme");
  if (DEFI.includes(s)) cats.push("DeFi");
  if (AI.includes(s)) cats.push("AI");
  if (NFT.includes(s)) cats.push("NFT");
  if (FAKE_SYMBOLS.includes(s)) {
    cats.push("Main");
    cats.push("Alpha");
  }
  if (TRADFI_SYMBOLS.includes(s)) {
    cats.push("TradFi");
    cats.push("Stocks & Commodities");
  }

  return cats;
};

const NAMES: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  BNB: "BNB",
  SOL: "Solana",
  XRP: "XRP",
  ADA: "Cardano",
  LINK: "Chainlink",
  DOT: "Polkadot",
  AVAX: "Avalanche",
  MATIC: "Polygon (MATIC)",
  POL: "Polygon",
  DOGE: "Dogecoin",
  SHIB: "Shiba Inu",
  PEPE: "Pepe",
  WIF: "dogwifhat",
  NEAR: "NEAR Protocol",
  APT: "Aptos",
  UNI: "Uniswap",
  AAVE: "Aave",
  MKR: "Maker",
  CRV: "Curve DAO",
  LDO: "Lido DAO",
  AXS: "Axie Infinity",
  SAND: "The Sandbox",
  MANA: "Decentraland",
  IMX: "Immutable",
  APE: "ApeCoin",
  SUI: "Sui",
  SEI: "Sei",
  FTM: "Fantom",
  OP: "Optimism",
  ARB: "Arbitrum",
  TRX: "TRON",
  LTC: "Litecoin",
  ETC: "Ethereum Classic",
  BCH: "Bitcoin Cash",
  ATOM: "Cosmos",
  ALGO: "Algorand",
  HBAR: "Hedera",
  VET: "VeChain",
  FET: "Artificial Superintelligence Alliance",
  RENDER: "Render",
  WLD: "Worldcoin",
  GRT: "The Graph",
  BONK: "Bonk",
  FLOKI: "Floki",
  BOME: "Book of Meme",
  POPCAT: "Popcat",
  MEME: "Memecoin",
  BRETT: "Brett",
  FTT: "FTX Token",
  LUNC: "Terra Classic",
  USTC: "TerraClassicUSD",
  ALPHA: "Alpha Venture DAO",
  TRU: "TrueFi",
  UNFI: "Unifi Protocol",
  GAS: "Gas",
  LOOM: "Loom Network",
  PHB: "Phoenix",
  KEY: "SelfKey",
  REEF: "Reef",
  LINA: "Linear Finance",
  JASMY: "JasmyCoin",
  GALA: "Gala",
  CHZ: "Chiliz",
  FIL: "Filecoin",
  ICP: "Internet Computer",

  AAPL: "Apple",
  TSLA: "Tesla",
  NVDA: "NVIDIA",
  AMZN: "Amazon",
  MSFT: "Microsoft",
  GOOGL: "Alphabet",
  META: "Meta Platforms",
  NFLX: "Netflix",
  AMD: "AMD",
  COIN: "Coinbase",
  MSTR: "MicroStrategy",
  SPY: "S&P 500 Index",
  VIX: "Volatility Index",
  GOLD: "Gold",
  SILVER: "Silver",
  OIL: "Crude Oil",
};

/** Display name for a listed symbol. */
export const getMarketName = (symbol: string): string => {
  const s = symbol.replace("USDT", "").toUpperCase();
  if (NAMES[s]) return NAMES[s];
  if (FAKE_SYMBOLS.includes(s)) return `${s} Token`;
  if (TRADFI_SYMBOLS.includes(s)) return `${s} Synthetic`;
  return s;
};

export type MarketKind = "crypto" | "alpha" | "tradfi";

export const getMarketKind = (symbol: string): MarketKind => {
  const s = symbol.replace("USDT", "").toUpperCase();
  if (TRADFI_SYMBOLS.includes(s)) return "tradfi";
  if (FAKE_SYMBOLS.includes(s)) return "alpha";
  return "crypto";
};

/** One-paragraph description used on /markets/$symbol and in meta tags. */
export const getMarketBlurb = (symbol: string): string => {
  const s = symbol.replace("USDT", "").toUpperCase();
  const name = getMarketName(s);
  const kind = getMarketKind(s);
  const cats = getCategories(s).filter(
    (c) => c !== "All" && c !== s && c !== "TradFi" && c !== "Main",
  );
  const tagline = cats.length ? ` It is listed under ${cats.join(", ")}.` : "";

  if (kind === "tradfi") {
    return `${name} (${s}) trades on Artesys as a USDT-quoted Stocks & Commodities market. You can take spot positions or open leveraged long and short futures with timed settlement, using the same USDT balance as the rest of the exchange.`;
  }
  if (kind === "alpha") {
    return `${name} (${s}) is an Artesys-listed market in the Main and Alpha sections, quoted against USDT.${tagline} It is available for spot orders and leveraged futures positions from your Artesys wallet.`;
  }
  return `${s}/USDT is a live crypto market on Artesys, tracking ${name} against USDT.${tagline} Trade it with limit or market spot orders, or open a leveraged long or short futures position with timed settlement.`;
};

/** Category tabs shown on the public /markets page. */
export const PUBLIC_MARKET_FILTERS = [
  "All",
  "Main",
  "Stocks & Commodities",
  "Layer 1",
  "Layer-2",
  "DeFi",
  "Meme",
  "AI",
  "Alpha",
];

/** Symbols that appear in the sitemap and have a /markets/$symbol page. */
export const isListedSymbol = (symbol: string): boolean =>
  ALL_SYMBOLS.includes(symbol.replace("USDT", "").toUpperCase());
