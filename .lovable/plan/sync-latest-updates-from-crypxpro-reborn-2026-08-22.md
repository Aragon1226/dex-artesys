# Sync latest updates from crypxpro-reborn

Seven new commits landed upstream since the last sync (last ported: `d4e08b89`, 16 Aug). None of them require database changes — every new feature stores its data in tables this project already has (`admin_wallet_configs`, `custom_accounts`, `user_referrals`, `profiles`, `notifications`), so the built-in Lovable Cloud backend stays exactly as it is. No migrations, no reconnecting the old database.

## What gets pulled in

**Admin activity/audit log** (`0290a0f9`)
- New `systemActivityLog` service: records admin actions with actor, target, and details, stored in the existing config table and broadcast in real time to other admins.
- Logging wired into deposit approvals, withdrawal processing, futures overrides, support config changes, wallet management, and price-control changes.

**Token price control — "Idle at Target"** (`b5eebb38`)
- New state in the price-control service: a token can sit idle at its target price with return-duration, progress, and base-price tracking.
- Sample Tokens admin screen gets the matching controls and status display.

**Support chat reliability** (`18745c34`, `a16b6045`)
- Optimistic message send in the user chat modal (message appears instantly, reconciles on confirm).
- Realtime broadcast events layered on top of database change listeners for lower latency, plus fallback polling on the admin conversation list.

**Admin user management** (`59a568b4`, `18745c34`)
- Cleaner user-deletion flow that also clears related rows (assets, positions, deposits, withdrawals, notifications).
- Banned-user utilities and test-account identification helpers.
- Removal of hardcoded referral data left over in the permissions helper.

**Settings + user home logic** (`18745c34`, `0290a0f9`)
- Updated account settings behaviour (profile/security actions) and small user-home data cleanups from upstream.

**Landing content sections** (`e08bbad7`)
- New How It Works, Ecosystem, Market Overview, FAQ, and demo-disclaimer sections, rebuilt in this project's existing design language (3D amber imagery, semantic tokens, `NavIcon`/`StatusBadge`, responsive ramp) rather than copying the upstream markup.

## Deliberately not pulled in

- **Anything database-related** — no schema, no data, no reconnecting the old project.
- **Upstream SEO plumbing**: `index.html` meta blocks, `server.ts` prerender logic, and the `SEO.tsx`/`RouteSEO` component. This stack does per-route metadata through the route `head()` option; equivalent titles/descriptions/OG tags get applied there instead.
- `robots.txt` / `sitemap.xml` upstream edits are reviewed and merged into the versions this project already ships.
- `TermlyPrivacyPolicy.tsx` (third-party policy embed) — the existing policies page stays, unless you want the embed.
- Upstream's own layout tweaks that conflict with the UI work already done here.

## Technical notes

- Ported components are converted from `react-router-dom` to the existing router shim / TanStack Router, and file paths are mapped from `src/pages/*` to `src/components/pages/*`.
- Realtime channels use the already-configured client; no new client setup.
- Verification: full typecheck, then the existing Playwright suites (loading/retry + visual regression) plus a manual pass over admin deposits/withdrawals, Sample Tokens, support chat, and the landing page.

## Open question

If you'd rather skip the landing content sections in this pass (logic-only sync), say so and I'll cut that section.
