-- Clients get their deposit address through a server function, so the only
-- row they still need to read directly is the shared market price settings.
DROP POLICY IF EXISTS "Clients can read their admin's wallet configs" ON public.admin_wallet_configs;
CREATE POLICY "Clients can read shared price settings"
  ON public.admin_wallet_configs
  FOR SELECT
  TO authenticated
  USING (admin_id = 'SYSTEM_PRICES');