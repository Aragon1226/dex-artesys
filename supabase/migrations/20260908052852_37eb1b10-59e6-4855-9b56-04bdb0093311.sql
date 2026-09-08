-- Owner (top-level) admin check
CREATE OR REPLACE FUNCTION public.is_owner_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.custom_accounts c
    WHERE c.id = auth.uid() AND c.role = 'admin' AND c.custom_id = 'CXPAD-001'
  )
$$;

-- Can the calling admin see this end user?
CREATE OR REPLACE FUNCTION public.admin_can_view_user(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
    AND (
      public.is_owner_admin()
      OR EXISTS (
        SELECT 1
        FROM public.user_referrals r
        JOIN public.custom_accounts c
          ON c.custom_id = r.referred_by_admin_id
        WHERE r.user_id = _user_id
          AND c.id = auth.uid()
      )
      OR _user_id = auth.uid()
    )
$$;

REVOKE EXECUTE ON FUNCTION public.is_owner_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_can_view_user(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_owner_admin() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.admin_can_view_user(uuid) TO authenticated, service_role;

-- profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can view their referred profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.admin_can_view_user(id));
CREATE POLICY "Admins can update their referred profiles"
  ON public.profiles FOR UPDATE TO authenticated
  USING (public.admin_can_view_user(id))
  WITH CHECK (public.admin_can_view_user(id));

-- deposits
DROP POLICY IF EXISTS "Admins can view and manage all deposits" ON public.deposits;
CREATE POLICY "Admins can manage their referred deposits"
  ON public.deposits FOR ALL TO authenticated
  USING (public.admin_can_view_user(user_id))
  WITH CHECK (public.admin_can_view_user(user_id));

-- withdrawals
DROP POLICY IF EXISTS "Admins can view and manage all withdrawals" ON public.withdrawals;
CREATE POLICY "Admins can manage their referred withdrawals"
  ON public.withdrawals FOR ALL TO authenticated
  USING (public.admin_can_view_user(user_id))
  WITH CHECK (public.admin_can_view_user(user_id));

-- positions
DROP POLICY IF EXISTS "Admins can view all positions" ON public.positions;
CREATE POLICY "Admins can view their referred positions"
  ON public.positions FOR SELECT TO authenticated
  USING (public.admin_can_view_user(user_id));

-- user_assets
DROP POLICY IF EXISTS "Admins can manage all assets" ON public.user_assets;
CREATE POLICY "Admins can manage their referred assets"
  ON public.user_assets FOR ALL TO authenticated
  USING (public.admin_can_view_user(user_id))
  WITH CHECK (public.admin_can_view_user(user_id));

-- linked_wallets
DROP POLICY IF EXISTS "Users can view their own wallets" ON public.linked_wallets;
CREATE POLICY "Users and their admin can view wallets"
  ON public.linked_wallets FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.admin_can_view_user(user_id));

-- kyc_submissions
DROP POLICY IF EXISTS "Admins can view all KYC submissions" ON public.kyc_submissions;
DROP POLICY IF EXISTS "Admins can update KYC submissions" ON public.kyc_submissions;
CREATE POLICY "Admins can view their referred KYC submissions"
  ON public.kyc_submissions FOR SELECT TO authenticated
  USING (public.admin_can_view_user(user_id));
CREATE POLICY "Admins can update their referred KYC submissions"
  ON public.kyc_submissions FOR UPDATE TO authenticated
  USING (public.admin_can_view_user(user_id))
  WITH CHECK (public.admin_can_view_user(user_id));

-- support_messages
DROP POLICY IF EXISTS "Admins can view and manage all messages" ON public.support_messages;
CREATE POLICY "Admins can manage their referred messages"
  ON public.support_messages FOR ALL TO authenticated
  USING (public.admin_can_view_user(user_id))
  WITH CHECK (public.admin_can_view_user(user_id));

-- notifications
DROP POLICY IF EXISTS "Admins can manage all notifications" ON public.notifications;
CREATE POLICY "Admins can manage their referred notifications"
  ON public.notifications FOR ALL TO authenticated
  USING (public.admin_can_view_user(user_id))
  WITH CHECK (public.admin_can_view_user(user_id));