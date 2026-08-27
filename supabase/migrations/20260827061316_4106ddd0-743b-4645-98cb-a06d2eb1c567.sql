CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_is_admin boolean;
  v_permissions jsonb;
BEGIN
  v_is_admin := (
    LOWER(NEW.email) = 'arkarnaung009@gmail.com'
    OR COALESCE(NEW.raw_user_meta_data->>'role', '') = 'admin'
    OR EXISTS (SELECT 1 FROM public.custom_accounts WHERE LOWER(email) = LOWER(NEW.email) AND role = 'admin')
  );

  IF v_is_admin THEN
    SELECT permissions INTO v_permissions FROM public.custom_accounts WHERE LOWER(email) = LOWER(NEW.email);
    IF v_permissions IS NULL THEN
      v_permissions := '{"dashboard":true,"users":true,"financial-status":true,"deposit-requests":true,"withdrawals":true,"futures":true,"kyc":true,"wallets":true,"customer-service":true,"support":true,"administrator":true,"sample-tokens":true}'::jsonb;
    END IF;
  ELSE
    v_permissions := NULL;
  END IF;

  INSERT INTO public.profiles (
    id, display_name, email, username, ftid, balance, futures_balance, staked_balance,
    kyc_status, force_win, force_loss, is_admin, admin_permissions
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'display_name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    public.generate_ftid(),
    0, 0, 0, 'UNVERIFIED', false, false, v_is_admin, v_permissions
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN v_is_admin THEN 'admin'::public.app_role ELSE 'user'::public.app_role END)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;