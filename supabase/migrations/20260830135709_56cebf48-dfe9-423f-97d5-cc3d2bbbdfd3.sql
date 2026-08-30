-- 1. Remove email-matching read policy on custom_accounts (exposes password field)
DROP POLICY IF EXISTS "Users can read own custom account" ON public.custom_accounts;

-- 2. Lock down custom_accounts + wallet_auth_challenges from anonymous access
REVOKE ALL ON public.custom_accounts FROM anon;
REVOKE ALL ON public.wallet_auth_challenges FROM anon;
REVOKE ALL ON public.wallet_auth_challenges FROM authenticated;
GRANT ALL ON public.custom_accounts TO service_role;
GRANT ALL ON public.wallet_auth_challenges TO service_role;

-- 3. wallet_auth_challenges: explicit deny-by-default, server-only access
ALTER TABLE public.wallet_auth_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_auth_challenges FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "No client access to wallet auth challenges" ON public.wallet_auth_challenges;
CREATE POLICY "No client access to wallet auth challenges"
  ON public.wallet_auth_challenges
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- 4. Trigger function should not be executable by the public/anon API
REVOKE ALL ON FUNCTION public.protect_profile_privileged_columns() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.protect_profile_privileged_columns() FROM anon;
REVOKE ALL ON FUNCTION public.protect_profile_privileged_columns() FROM authenticated;