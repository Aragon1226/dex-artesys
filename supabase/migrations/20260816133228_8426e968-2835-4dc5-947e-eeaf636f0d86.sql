CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- ============ profiles ============
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  email text,
  username text,
  ftid text,
  balance numeric DEFAULT 0,
  futures_balance numeric DEFAULT 0,
  staked_balance numeric DEFAULT 0,
  kyc_status text DEFAULT 'UNVERIFIED',
  force_win boolean DEFAULT false,
  force_win_spot boolean DEFAULT false,
  force_loss boolean DEFAULT false,
  withdrawal_address text,
  is_admin boolean DEFAULT false,
  admin_permissions jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============ user_roles ============
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ user_assets ============
CREATE TABLE public.user_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_assets TO authenticated;
GRANT ALL ON public.user_assets TO service_role;
ALTER TABLE public.user_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own assets" ON public.user_assets FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assets" ON public.user_assets FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assets" ON public.user_assets FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own assets" ON public.user_assets FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all assets" ON public.user_assets FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ positions ============
CREATE TABLE public.positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pair text NOT NULL,
  amount numeric NOT NULL,
  margin numeric NOT NULL,
  leverage integer NOT NULL,
  entry_price numeric NOT NULL,
  type text NOT NULL,
  start_time bigint NOT NULL,
  duration_seconds integer NOT NULL,
  expected_profit_percentage numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'OPEN',
  pnl numeric,
  created_at timestamptz DEFAULT now()
);
GRANT SELECT, INSERT ON public.positions TO authenticated;
GRANT ALL ON public.positions TO service_role;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own positions" ON public.positions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own positions" ON public.positions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all positions" ON public.positions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ deposits ============
CREATE TABLE public.deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asset text NOT NULL,
  network text NOT NULL,
  amount numeric NOT NULL,
  address text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'PENDING',
  screenshot_url text,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.deposits TO authenticated;
GRANT ALL ON public.deposits TO service_role;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own deposits" ON public.deposits FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create deposits" ON public.deposits FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view and manage all deposits" ON public.deposits FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ withdrawals ============
CREATE TABLE public.withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asset text NOT NULL,
  network text NOT NULL,
  amount numeric NOT NULL,
  address text NOT NULL,
  status text NOT NULL DEFAULT 'PENDING',
  note text,
  created_at timestamptz DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.withdrawals TO authenticated;
GRANT ALL ON public.withdrawals TO service_role;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own withdrawals" ON public.withdrawals FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create withdrawals" ON public.withdrawals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view and manage all withdrawals" ON public.withdrawals FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ kyc_submissions ============
CREATE TABLE public.kyc_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  date_of_birth text NOT NULL,
  address text NOT NULL,
  id_type text NOT NULL DEFAULT 'passport',
  id_front_url text,
  id_back_url text,
  selfie_url text,
  status text NOT NULL DEFAULT 'PENDING',
  admin_notes text,
  reviewed_by uuid,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);
GRANT SELECT, INSERT, UPDATE ON public.kyc_submissions TO authenticated;
GRANT ALL ON public.kyc_submissions TO service_role;
ALTER TABLE public.kyc_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own KYC submissions" ON public.kyc_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own KYC submissions" ON public.kyc_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all KYC submissions" ON public.kyc_submissions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update KYC submissions" ON public.kyc_submissions FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- ============ notifications ============
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all notifications" ON public.notifications FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ============ support_messages ============
CREATE TABLE public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_type text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_messages TO authenticated;
GRANT ALL ON public.support_messages TO service_role;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own messages" ON public.support_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own messages" ON public.support_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view and manage all messages" ON public.support_messages FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ============ support_config ============
CREATE TABLE public.support_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text DEFAULT '',
  telegram text DEFAULT '',
  whatsapp text DEFAULT ''
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_config TO authenticated;
GRANT ALL ON public.support_config TO service_role;
ALTER TABLE public.support_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read support config" ON public.support_config FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage support config" ON public.support_config FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ admin_wallets ============
CREATE TABLE public.admin_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  network text NOT NULL,
  address text NOT NULL DEFAULT ''
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_wallets TO authenticated;
GRANT ALL ON public.admin_wallets TO service_role;
ALTER TABLE public.admin_wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read wallets" ON public.admin_wallets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage wallets" ON public.admin_wallets FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ admin_wallet_configs ============
CREATE TABLE public.admin_wallet_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id text NOT NULL,
  symbol text NOT NULL,
  network text NOT NULL,
  address text NOT NULL
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_wallet_configs TO authenticated;
GRANT ALL ON public.admin_wallet_configs TO service_role;
ALTER TABLE public.admin_wallet_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read admin wallet configs" ON public.admin_wallet_configs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage admin wallet configs" ON public.admin_wallet_configs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ custom_accounts ============
CREATE TABLE public.custom_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  custom_id text NOT NULL,
  email text NOT NULL UNIQUE,
  username text NOT NULL,
  role text NOT NULL,
  password text,
  created_by_admin_id text,
  permissions jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.custom_accounts TO authenticated;
GRANT ALL ON public.custom_accounts TO service_role;
ALTER TABLE public.custom_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read custom accounts" ON public.custom_accounts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage custom accounts" ON public.custom_accounts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ user_referrals ============
CREATE TABLE public.user_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  user_id uuid,
  referred_by_admin_id text NOT NULL,
  referred_at timestamptz DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_referrals TO authenticated;
GRANT ALL ON public.user_referrals TO service_role;
ALTER TABLE public.user_referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read user referrals" ON public.user_referrals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can create or edit referrals" ON public.user_referrals FOR ALL TO authenticated USING (true);

-- ============ helper functions ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.generate_ftid()
RETURNS text LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  RETURN 'FID-' || UPPER(SUBSTRING(gen_random_uuid()::text FROM 1 FOR 9));
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_is_admin boolean;
  v_permissions jsonb;
BEGIN
  v_is_admin := (
    COALESCE(NEW.raw_user_meta_data->>'role', '') = 'admin'
    OR EXISTS (SELECT 1 FROM public.custom_accounts WHERE LOWER(email) = LOWER(NEW.email) AND role = 'admin')
  );

  IF v_is_admin THEN
    SELECT permissions INTO v_permissions FROM public.custom_accounts WHERE LOWER(email) = LOWER(NEW.email);
    IF v_permissions IS NULL THEN
      v_permissions := '{"dashboard":true,"users":true,"financial-status":true,"deposit-requests":true,"withdrawals":true,"futures":true,"kyc":true,"wallets":true,"customer-service":true,"support":true}'::jsonb;
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

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.close_trade_position(p_pos_id uuid, p_pnl numeric)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_pos RECORD;
  v_settlement NUMERIC;
BEGIN
  SELECT * INTO v_pos FROM public.positions WHERE id = p_pos_id AND status = 'OPEN';
  IF NOT FOUND THEN RETURN FALSE; END IF;

  UPDATE public.positions SET status = 'CLOSED', pnl = p_pnl WHERE id = p_pos_id;
  v_settlement := v_pos.margin + p_pnl;
  UPDATE public.profiles SET futures_balance = futures_balance + v_settlement WHERE id = v_pos.user_id;
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_all_custom_accounts()
RETURNS SETOF public.custom_accounts LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN QUERY SELECT * FROM public.custom_accounts;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_custom_admin(
  p_email text, p_password text, p_username text, p_custom_id text, p_role text, p_permissions jsonb
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_user_id uuid;
  v_identity_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = p_email LIMIT 1;

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
    v_identity_id := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id, id, email, encrypted_password, email_confirmed_at, confirmed_at,
      raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at, is_sso_user
    ) VALUES (
      '00000000-0000-0000-0000-000000000000'::uuid,
      v_user_id,
      p_email,
      crypt(p_password, gen_salt('bf', 10)),
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
    SET encrypted_password = crypt(p_password, gen_salt('bf', 10)),
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
$$;

CREATE OR REPLACE FUNCTION public.delete_custom_admin(p_email text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_user_id uuid;
BEGIN
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
$$;

CREATE OR REPLACE FUNCTION public.debug_inspect_auth_user(p_email text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_row jsonb;
BEGIN
  SELECT row_to_json(u)::jsonb INTO v_row FROM auth.users u WHERE email = p_email LIMIT 1;
  RETURN v_row;
END;
$$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_wallet_configs;