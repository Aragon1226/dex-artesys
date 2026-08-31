# Public Artésys platform pages for search

Right now only `/`, `/auth`, `/faq`, `/policies`, `/terms` are indexable — everything real lives behind `/app/*` (noindex). This plan adds a public, SSR-rendered layer that describes and shows the platform, with live prices, so the sitemap has substantial content to index.

## Pages

**Markets**
- `/markets` — full live market table (search + category tabs: Crypto, Main, Stocks & Commodities, Layer 1, DeFi, Meme, AI, Alpha). Server-rendered prices so crawlers see real numbers, then refreshed client-side.
- `/markets/$symbol` — one page per listed pair (BTC, ETH, SOL … AAPL, TSLA, GOLD, OIL, plus the custom Artésys tokens). Shows price, 24h change/high/low, volume, chart, a short description of the market, and links to trade it.

**Trading**
- `/trading` — hub explaining spot vs futures, order types, fees (0.15% taker fee already in the app), leverage and settlement.
- `/trading/spot` — how spot ordering works on Artésys, order book, limit/market orders, wallet flow.
- `/trading/futures` — leverage tiers, timed settlement, margin and PnL mechanics.

**Assets**
- `/assets` — public explainer for the wallet layer: supported deposit assets, deposit/withdrawal flow, transfer between spot and futures balances, Earn/staking products.

**Accounts**
- `/accounts` — account tiers and what each unlocks: signup, email verification, KYC levels, wallet linking (Web3/SIWE), Google/Apple sign-in, security features (2FA-ready, session handling), referrals.

**Guides**
- `/guides` — hub linking all guides.
- `/guides/fees` — fee schedule as a table (spot fee, withdrawal handling, no hidden charges).
- `/guides/security` — custody, RLS-backed data isolation, wallet signature auth, email domain authentication.
- `/guides/how-to-trade-spot` and `/guides/how-to-trade-futures` — step-by-step walkthroughs.
- `/guides/getting-started` — signup → verify → deposit → first trade.

All copy is grounded in what the app actually does. No invented statistics, testimonials, ratings or guarantees.

## Navigation and linking

- Add a public header/footer nav on the marketing routes: Markets, Trading, Assets, Accounts, Guides, FAQ, plus a "Launch app" CTA to `/app/home`.
- Landing page gets links into the new hubs so nothing is orphaned.
- Each `/markets/$symbol` page links back to `/markets` and to the relevant trading guide.

## SEO

- Unique `head()` per route: title, description, og:title, og:description, og:type, twitter:card, canonical on `https://artésys.com` (punycode) — dynamic pages derive theirs from the symbol.
- Single H1 per page, semantic sections, breadcrumb JSON-LD on symbol pages, FAQPage JSON-LD on guides where the content is Q&A, Organization JSON-LD on the hubs.
- `sitemap.xml` extended: static public routes plus one entry per market symbol, generated from the same symbol list the app uses. No `lastmod` (no authoritative per-page timestamp).
- `robots.txt` keeps `Disallow: /app/` and `/admin/`; new routes stay allowed.

## Technical notes

- New route files under `src/routes/`: `markets.index.tsx`, `markets.$symbol.tsx`, `trading.index.tsx`, `trading.spot.tsx`, `trading.futures.tsx`, `assets.tsx`, `accounts.tsx`, `guides.index.tsx` and one file per guide. These are SSR (no `ssr: false`) — unlike the `/app/*` routes.
- Price data: add a server-safe read (`src/lib/markets.functions.ts` server fn or a plain server module) that resolves the symbol list and current prices without importing the browser Supabase client, so it can run in the route loader for SSR. Existing `src/services/market.ts` keeps serving the in-app screens unchanged; the shared symbol/category tables move to a browser-safe module both can import.
- Loader shape: `loader` → `ensureQueryData` on a market query; component uses `useSuspenseQuery`; `head()` reads `loaderData` for symbol titles/descriptions.
- `markets/$symbol` throws `notFound()` for unknown symbols, and its `head()` returns `noindex` when `loaderData` is absent.
- Reuse existing presentation components (`CryptoIcon`, `TradingChart`, `StatusBadge`, `EmptyState`) and existing brand tokens; no new colors or fonts.
- No database or auth changes. No changes to `/app/*` behaviour.

## Verification

- Typecheck/build, then load each new route in the preview and confirm prices and copy render server-side.
- Fetch `/sitemap.xml` and confirm all new URLs appear and no `/app` or `/admin` path leaks in.
