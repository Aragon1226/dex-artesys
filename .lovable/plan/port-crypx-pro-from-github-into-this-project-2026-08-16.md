# Port CrypX-Pro from GitHub into this project

Source: `github.com/art-e-ui/crypxpro-reborn` (public). It's a large Vite + React Router + Supabase crypto exchange app: 1 landing page, 8 user app pages, 14 admin pages, ~25 shared components, market/news/price services, and a 27KB SQL schema with 11 tables.

This project runs on a different framework (TanStack Start with file-based routing), so the code gets ported, not copied blindly: routing and app shell are rewritten, everything else (UI, business logic, services, styling) carries over as-is.

## What you'll get

The same app, same look, same pages, running here with its own database:

- Public: landing page, auth, terms, policies, FAQ
- User app: home, market, trade-fi, spot, futures, earn, assets, settings
- Admin: dashboard, users, financial status, KYC, futures control, spot/sample tokens, wallets, support, customer service, withdrawals, deposit requests, administrator, ownership

## Approach

Phase 1 — Foundation
- Enable Lovable Cloud (database + auth) and apply the repo's `schema.sql` as a migration: profiles, user_roles, user_assets, positions, deposits, withdrawals, admin_wallets, support_config, kyc_submissions, notifications, support_messages, plus the `has_role`, `generate_ftid`, `handle_new_user`, `update_updated_at_column`, `close_trade_position` functions, RLS policies and required grants.
- Port the design system: `src/index.css` tokens into `src/styles.css` (Tailwind v4 syntax), fonts via the root route head.
- Install the runtime dependencies the app needs (radix primitives, lightweight-charts, recharts, motion, sonner, embla, react-hook-form, zod, date-fns, lucide, etc.) and add the shadcn UI components the pages import.
- Copy `public/` assets (logos, hero banners, token icons, icons, manifest) and `src/assets/images`.

Phase 2 — Shell and auth
- Convert `App.tsx` route table into TanStack file routes: `/`, `/auth`, `/terms`, `/policies`, `/faq`, `/settings`, an `/app` layout subtree, and an `/admin` layout subtree with a role gate.
- Port `AuthContext`/`useAuth` onto the Cloud Supabase client; keep the existing session/redirect behavior.
- Port `MainLayout`, `AdminLayout`, toasts, tooltip provider, loading overlays and skeletons.

Phase 3 — Pages
- Port shared components and services (`services/market.ts`, `news.ts`, `tokenPriceControl.ts`, `hooks/useRealtimePrices.ts`, `lib/adminPermissions.ts`, `CryptoIcon`, chart/orderbook/spot components).
- Port user pages, then admin pages, converting `react-router-dom` navigation (`useNavigate`, `Link`, `useSearchParams`) to TanStack Router equivalents and lazy imports to route-level code splitting.
- Add per-route head metadata (titles/descriptions) instead of the repo's single `index.html`.

Phase 4 — Verification
- Typecheck, then walk the main flows in a browser: landing, sign up / sign in, user home, spot, futures, assets, and admin dashboard; fix runtime errors found.

## Technical notes

- Not ported: the `android/` Capacitor wrapper, the Express `server.ts` host, `dist` build assets, and Netlify config — this platform provides hosting and server runtime. PWA manifest/icons carry over; the custom `sw.js` is dropped unless you want offline support.
- The repo's Supabase project is not accessible from here, so the app starts with an empty database created from `schema.sql`. Existing users/balances are not migrated. If you'd rather point at your existing Supabase project, say so and I'll wire the app to those credentials instead of creating a new database.
- Admin access is gated on the `user_roles` table via `has_role`, matching the repo's model — no client-side role checks.
- Some very large page files (UserHome ~91KB, Spot/Assets ~46KB, admin Users ~53KB) will be ported in chunks across several steps; expect this to run over multiple messages rather than one shot.
- Duplicate hero/token images exist as both `.png` and `.jpg` (multi-MB each). I'll keep the smaller `.jpg` variants to avoid bloating the project.

## Open decision

If you want a slimmer first pass (landing + auth + user app only, admin later), tell me and I'll cut Phase 3's admin half from the first round.
