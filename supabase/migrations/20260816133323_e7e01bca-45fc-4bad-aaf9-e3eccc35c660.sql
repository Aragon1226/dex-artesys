REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_all_custom_accounts() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_custom_accounts() TO service_role;