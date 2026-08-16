DROP FUNCTION IF EXISTS public.debug_inspect_auth_user(text);

ALTER FUNCTION public.create_custom_admin(text, text, text, text, text, jsonb) SET search_path = public;
ALTER FUNCTION public.delete_custom_admin(text) SET search_path = public;

REVOKE ALL ON FUNCTION public.create_custom_admin(text, text, text, text, text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.delete_custom_admin(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_custom_admin(text, text, text, text, text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_custom_admin(text) TO service_role;

REVOKE ALL ON FUNCTION public.get_all_custom_accounts() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.close_trade_position(uuid, numeric) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.generate_ftid() FROM PUBLIC, anon;