-- Allow the service role (auth.uid() IS NULL) to call these routines, keeping the
-- admin check for any in-database caller, then revoke client EXECUTE.
CREATE OR REPLACE FUNCTION public.get_all_custom_accounts()
 RETURNS SETOF public.custom_accounts
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  RETURN QUERY SELECT * FROM public.custom_accounts;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_custom_admin(p_email text, p_password text, p_username text, p_custom_id text, p_role text, p_permissions jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id uuid;
  v_identity_id uuid;
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT id INTO v_user_id FROM auth.users WHERE email = p_email LIMIT 1;

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
    v_identity_id := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id, id, email, encrypted_password, email_confirmed_at, confirmed_at,
      raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at, is_sso_user
    ) VALUES (
      '00000000-0000-0000-0000-000000000000'::uuid,
      v_user_id, p_email,
      extensions.crypt(p_password, extensions.gen_salt('bf', 10)),
      now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('username', p_username, 'custom_id', p_custom_id, 'role', p_role),
      'authenticated', 'authenticated', now(), now(), false
    );

    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (
      v_identity_id, v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', p_email, 'email_verified', true),
      'email', p_email, now(), now(), now()
    );
  ELSE
    UPDATE auth.users
    SET encrypted_password = extensions.crypt(p_password, extensions.gen_salt('bf', 10)),
        raw_user_meta_data = jsonb_build_object('username', p_username, 'custom_id', p_custom_id, 'role', p_role),
        confirmed_at = COALESCE(confirmed_at, now()),
        email_confirmed_at = COALESCE(email_confirmed_at, now())
    WHERE id = v_user_id;
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (v_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  INSERT INTO public.custom_accounts (id, custom_id, email, username, role, password, permissions)
  VALUES (v_user_id, p_custom_id, p_email, p_username, p_role, p_password, p_permissions)
  ON CONFLICT (email) DO UPDATE
  SET role = EXCLUDED.role,
      permissions = EXCLUDED.permissions,
      password = EXCLUDED.password,
      username = EXCLUDED.username;

  RETURN v_user_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.delete_custom_admin(p_email text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id uuid;
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT id INTO v_user_id FROM auth.users WHERE email = p_email;
  IF v_user_id IS NOT NULL THEN
    DELETE FROM public.custom_accounts WHERE email = p_email;
    DELETE FROM public.user_roles WHERE user_id = v_user_id;
    DELETE FROM auth.identities WHERE user_id = v_user_id;
    DELETE FROM auth.users WHERE id = v_user_id;
    RETURN true;
  END IF;
  RETURN false;
END;
$function$;

CREATE OR REPLACE FUNCTION public.close_trade_position(p_pos_id uuid, p_pnl numeric)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_pos RECORD;
  v_settlement NUMERIC;
BEGIN
  SELECT * INTO v_pos FROM public.positions WHERE id = p_pos_id AND status = 'OPEN';
  IF NOT FOUND THEN RETURN FALSE; END IF;

  -- Callers are the service role (ownership already verified server-side) or an in-database admin.
  IF auth.uid() IS NOT NULL AND v_pos.user_id <> auth.uid() AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE public.positions SET status = 'CLOSED', pnl = p_pnl WHERE id = p_pos_id;
  v_settlement := v_pos.margin + p_pnl;
  UPDATE public.profiles SET futures_balance = futures_balance + v_settlement WHERE id = v_pos.user_id;
  RETURN TRUE;
END;
$function$;

-- Clients may no longer execute these privileged routines directly.
REVOKE ALL ON FUNCTION public.get_all_custom_accounts() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.create_custom_admin(text, text, text, text, text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.delete_custom_admin(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.close_trade_position(uuid, numeric) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_all_custom_accounts() TO service_role;
GRANT EXECUTE ON FUNCTION public.create_custom_admin(text, text, text, text, text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_custom_admin(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.close_trade_position(uuid, numeric) TO service_role;