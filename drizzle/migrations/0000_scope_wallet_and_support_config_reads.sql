-- Global deposit wallets: clients now receive only their single deposit
-- address through a server function, so drop the read-everything rule.
DROP POLICY IF EXISTS "Anyone can read wallets" ON public.admin_wallets;

-- Support contacts: clients now receive only their own admin's contact
-- through a server function, so drop the read-everything rule.
DROP POLICY IF EXISTS "Anyone can read support config" ON public.support_config;

-- Per-admin wallet configs: clients may read only the configs of the admin
-- who referred them, plus the shared market price settings row.
DROP POLICY IF EXISTS "Anyone can read admin wallet configs" ON public.admin_wallet_configs;
CREATE POLICY "Clients can read their admin's wallet configs"
  ON public.admin_wallet_configs
  FOR SELECT
  TO authenticated
  USING (
    admin_id = 'SYSTEM_PRICES'
    OR admin_id IN (
      SELECT ur.referred_by_admin_id
      FROM public.user_referrals ur
      WHERE ur.user_id = auth.uid()
    )
  );