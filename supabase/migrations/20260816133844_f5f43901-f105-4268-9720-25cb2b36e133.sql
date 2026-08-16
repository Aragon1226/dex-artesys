GRANT EXECUTE ON FUNCTION public.get_all_custom_accounts() TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_custom_admin(text, text, text, text, text, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_custom_admin(text) TO authenticated;