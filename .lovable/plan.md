# Clean-state reset of the database (schema kept)

You'll handle switching this project to Lovable's built-in database yourself in project settings. On the currently connected database, this plan wipes all application data back to a clean state while leaving every table, policy, function and trigger intact — so once the app points at a fresh database, the same schema can be re-applied unchanged.

## What gets erased

- All rows in every app table: profiles, user_roles, user_assets, user_referrals, positions, deposits, withdrawals, kyc_submissions, notifications, support_messages, support_config, admin_wallets, admin_wallet_configs, custom_accounts.
- All login accounts (including admin logins). After the wipe, sign-up recreates profiles automatically via the existing new-user trigger.
- All uploaded files in the `kyc-documents` and `support-attachments` buckets.

## What stays

- Every table, column, access rule (RLS policy), database function and trigger.
- Storage buckets themselves (emptied, not deleted).
- All application code, routes, and UI — untouched.

## Local cleanup

The app caches session and profile data in the browser (`crypx_custom_session_v1`, `crypx_user_profile_*`, `crypx_pending_ref_v1`, Supabase `sb-*` keys). After the wipe you should sign out / clear site data in the preview, otherwise a stale cached profile can briefly render for a user that no longer exists.

## Technical notes

- Single migration, one transaction: `TRUNCATE ... RESTART IDENTITY CASCADE` across all public app tables, then `DELETE FROM auth.users` (cascades to `auth.identities` and to every table with a `user_id` FK), then `DELETE FROM storage.objects WHERE bucket_id IN ('kyc-documents','support-attachments')`.
- No DDL: no drops, no policy or function changes, no schema edits — nothing that would need re-approval later.
- `supabase/config.toml` and `src/integrations/supabase/types.ts` remain as-is; the schema is unchanged, so the generated types stay valid after you repoint the project.

## After you switch to the built-in database

Say the word and I'll re-apply the full existing schema (tables, grants, RLS policies, the 9 trading/admin functions, the new-user trigger, and both storage buckets) to the new database as one migration, plus recreate the admin accounts if you want them back.
