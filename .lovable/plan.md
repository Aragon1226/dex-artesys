# Clean slate for this app — existing database left untouched

Nothing is deleted from the current database. Your live Netlify app keeps running against it exactly as it does today. Instead, this project gets pointed at a fresh, empty database and the same structure is rebuilt there from scratch.

## Step 1 — You switch the connection (in the product, not by me)

The database binding is a project-level setting I can't change from chat. In project settings, disconnect the external Supabase project and enable Lovable's built-in database. That gives this project a brand-new, empty database and rewrites the connection values automatically. The old project stays live and fully intact.

## Step 2 — I rebuild the structure, empty

Once the new database is connected, I re-apply the app's full structure as one migration:

- All 14 tables: profiles, user_roles, user_assets, user_referrals, positions, deposits, withdrawals, kyc_submissions, notifications, support_messages, support_config, admin_wallets, admin_wallet_configs, custom_accounts.
- The same access rules as today (users see only their own records; admins see everything; a few shared config tables readable by any signed-in user).
- The `admin`/`user` role type plus the role-check helper, kept in a separate roles table.
- The supporting logic: new-user setup, trade-close settlement, account-ID generation, admin account create/delete, timestamp updates.
- The two file buckets: `kyc-documents` and `support-attachments`.

No rows are copied over. No users, no balances, no history — a genuine clean slate.

## Step 3 — First admin and verification

- You tell me which email should be the first admin; I wire it so signing up with that email is granted admin access, and everyone else defaults to a normal user.
- I then sign up a throwaway account in the preview and check the dashboard, spot/futures pages and the admin area load against the new database.

## Technical notes

- One migration containing DDL only, following create-table → grants → enable RLS → policies for every table, so the Data API can reach them.
- After the migration runs, the generated Supabase types file is regenerated; I'll fix up any code that drifts (should be none, since the schema is reproduced as-is).
- `supabase/config.toml` and `.env` are updated by the connection switch, not by hand.
- Current admin-email allowlist in the new-user trigger will be replaced with whatever you specify in step 3 rather than carried over silently.

## What I need from you

1. Switch this project to the built-in database in project settings.
2. Tell me the email(s) to treat as admin on the fresh database.
