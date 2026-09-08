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
      instance_id, id, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at, is_sso_user,
      confirmation_token, recovery_token, email_change, email_change_token_new,
      email_change_token_current, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000'::uuid,
      v_user_id, p_email,
      extensions.crypt(p_password, extensions.gen_salt('bf', 10)),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('username', p_username, 'custom_id', p_custom_id, 'role', p_role),
      'authenticated', 'authenticated', now(), now(), false,
      '', '', '', '', '', '', '', ''
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

REVOKE EXECUTE ON FUNCTION public.create_custom_admin(text, text, text, text, text, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_custom_admin(text, text, text, text, text, jsonb) TO service_role;