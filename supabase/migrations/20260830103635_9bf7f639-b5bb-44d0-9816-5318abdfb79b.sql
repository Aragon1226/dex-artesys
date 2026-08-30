CREATE TABLE public.linked_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  chain TEXT NOT NULL DEFAULT 'evm',
  label TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX linked_wallets_address_key ON public.linked_wallets (lower(address));
CREATE INDEX linked_wallets_user_id_idx ON public.linked_wallets (user_id);

GRANT SELECT, INSERT, DELETE ON public.linked_wallets TO authenticated;
GRANT ALL ON public.linked_wallets TO service_role;

ALTER TABLE public.linked_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wallets"
  ON public.linked_wallets FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can add their own wallets"
  ON public.linked_wallets FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own wallets"
  ON public.linked_wallets FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE public.wallet_auth_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  address TEXT NOT NULL,
  nonce TEXT NOT NULL,
  message TEXT NOT NULL,
  consumed BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '10 minutes'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX wallet_auth_challenges_address_idx ON public.wallet_auth_challenges (lower(address));

GRANT ALL ON public.wallet_auth_challenges TO service_role;

ALTER TABLE public.wallet_auth_challenges ENABLE ROW LEVEL SECURITY;