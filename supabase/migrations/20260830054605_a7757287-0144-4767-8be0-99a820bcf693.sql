
-- 1. profiles: restrict read to owner or admin
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

-- 2. profiles: prevent self privilege escalation on protected columns
CREATE OR REPLACE FUNCTION public.protect_profile_privileged_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $func$
BEGIN
  -- Backend (service role / triggers) and admins are unrestricted
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  IF NEW.is_admin IS DISTINCT FROM OLD.is_admin
     OR NEW.admin_permissions IS DISTINCT FROM OLD.admin_permissions
     OR NEW.force_win IS DISTINCT FROM OLD.force_win
     OR NEW.force_win_spot IS DISTINCT FROM OLD.force_win_spot
     OR NEW.force_loss IS DISTINCT FROM OLD.force_loss
     OR NEW.ftid IS DISTINCT FROM OLD.ftid
     OR NEW.email IS DISTINCT FROM OLD.email
     OR (NEW.kyc_status IS DISTINCT FROM OLD.kyc_status AND NEW.kyc_status <> 'PENDING') THEN
    RAISE EXCEPTION 'You cannot modify privileged profile fields.';
  END IF;

  RETURN NEW;
END;
$func$;

DROP TRIGGER IF EXISTS protect_profile_privileged_columns ON public.profiles;
CREATE TRIGGER protect_profile_privileged_columns
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_privileged_columns();

-- 3. custom_accounts: restrict read to owner (by email) or admin
DROP POLICY IF EXISTS "Anyone can read custom accounts" ON public.custom_accounts;

CREATE POLICY "Users can read own custom account"
ON public.custom_accounts FOR SELECT TO authenticated
USING (email = (SELECT u.email FROM auth.users u WHERE u.id = auth.uid()));

CREATE POLICY "Admins can read custom accounts"
ON public.custom_accounts FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 4. user_referrals: owner read/self-create, admin manage
DROP POLICY IF EXISTS "Anyone can read user referrals" ON public.user_referrals;
DROP POLICY IF EXISTS "Anyone can create or edit referrals" ON public.user_referrals;

CREATE POLICY "Users can read own referrals"
ON public.user_referrals FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR user_email = (SELECT u.email FROM auth.users u WHERE u.id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Users can create own referral"
ON public.user_referrals FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  OR user_email = (SELECT u.email FROM auth.users u WHERE u.id = auth.uid())
);

CREATE POLICY "Admins can manage referrals"
ON public.user_referrals FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. admin_wallet_configs: stop broadcasting internal wallet config over Realtime
ALTER PUBLICATION supabase_realtime DROP TABLE public.admin_wallet_configs;
