-- Lock down which profile fields a signed-in user may change.
-- Table-level UPDATE is replaced by column-level UPDATE on non-privileged fields only,
-- so privileged columns (is_admin, admin_permissions, force_*, ftid, email) can no longer
-- be targeted through the API at all, even before the protective trigger runs.

REVOKE UPDATE ON public.profiles FROM authenticated;

GRANT UPDATE (
  display_name,
  avatar_url,
  username,
  balance,
  futures_balance,
  staked_balance,
  kyc_status,
  withdrawal_address,
  updated_at
) ON public.profiles TO authenticated;

GRANT ALL ON public.profiles TO service_role;

-- Belt-and-braces: the row-level policy now also states the ownership check explicitly
-- for both the targeted row and the resulting row.
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);