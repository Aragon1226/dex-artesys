CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin boolean;
  v_permissions jsonb;
  v_ref_code text;
  v_ref_admin text;
BEGIN
  v_is_admin := (
    LOWER(NEW.email) = 'arkarnaung009@gmail.com'
    OR COALESCE(NEW.raw_user_meta_data->>'role', '') = 'admin'
    OR COALESCE(NEW.raw_user_meta_data->>'is_admin', '') = 'true'
    OR EXISTS (SELECT 1 FROM public.custom_accounts WHERE LOWER(email) = LOWER(NEW.email) AND role = 'admin')
  );

  IF v_is_admin THEN
    SELECT permissions INTO v_permissions FROM public.custom_accounts WHERE LOWER(email) = LOWER(NEW.email);
    IF v_permissions IS NULL OR v_permissions = '{}'::jsonb THEN
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

  IF NOT v_is_admin THEN
    v_ref_code := COALESCE(
      NEW.raw_user_meta_data->>'referral_code',
      NEW.raw_user_meta_data->>'ref',
      NEW.raw_app_meta_data->>'referral_code'
    );
    v_ref_admin := public.resolve_referral_admin_id(v_ref_code);

    IF v_ref_admin IS NULL THEN
      SELECT referred_by_admin_id INTO v_ref_admin
      FROM public.user_referrals
      WHERE lower(user_email) = lower(NEW.email)
      ORDER BY referred_at DESC NULLS LAST
      LIMIT 1;
    END IF;

    -- No default admin: leave the account unassigned so the referral code
    -- captured in the browser can still be applied after sign-in.
    IF v_ref_admin IS NOT NULL THEN
      IF EXISTS (SELECT 1 FROM public.user_referrals WHERE lower(user_email) = lower(NEW.email)) THEN
        UPDATE public.user_referrals
        SET user_id = NEW.id,
            referred_by_admin_id = v_ref_admin
        WHERE lower(user_email) = lower(NEW.email);
      ELSE
        INSERT INTO public.user_referrals (user_email, user_id, referred_by_admin_id)
        VALUES (lower(NEW.email), NEW.id, v_ref_admin);
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

UPDATE public.profiles
SET is_admin = true,
    admin_permissions = '{"dashboard":true,"users":true,"financial-status":true,"deposit-requests":true,"withdrawals":true,"futures":true,"kyc":true,"wallets":true,"customer-service":true,"support":true,"administrator":true,"sample-tokens":true}'::jsonb
WHERE lower(email) = 'rioaferhan@gmail.com';

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM public.profiles WHERE lower(email) = 'rioaferhan@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

DELETE FROM public.user_referrals WHERE lower(user_email) = 'rioaferhan@gmail.com';

UPDATE public.user_referrals
SET referred_by_admin_id = 'CXPAD-001'
WHERE lower(user_email) = 'rbc715028@gmail.com';

DELETE FROM public.user_referrals WHERE user_email LIKE 'refcheck-%@artesys-e2e.test';