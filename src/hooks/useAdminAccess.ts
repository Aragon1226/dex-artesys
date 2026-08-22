import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { hasPermissionToView, isUserAdmin, syncAdminPermissions } from "@/lib/adminPermissions";

/**
 * Role-based access hook.
 *
 * The authoritative check is the server-side `has_role(user_id, 'admin')` RPC,
 * which is evaluated by the database (RLS still enforces every read/write).
 * Local permission config is only used for *finer-grained page hiding* in the UI
 * and never grants access on its own.
 */
export const useAdminAccess = () => {
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      if (loading) return;
      if (!user) {
        if (mounted) {
          setIsAdmin(false);
          setChecking(false);
        }
        return;
      }

      let serverAdmin = false;
      const isValidUUID = (id: string) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      if (isValidUUID(user.id)) {
        try {
          const { data, error } = await supabase.rpc("has_role", {
            _user_id: user.id,
            _role: "admin",
          });
          if (!error) serverAdmin = !!data;
        } catch (e) {
          console.warn("Role check failed:", e);
        }
      }

      // Keep local page-permission config fresh (used for per-page hiding only)
      try {
        const syncedAdmin = await syncAdminPermissions(user.email);
        if (!serverAdmin && syncedAdmin) serverAdmin = true;
      } catch (e) {
        console.warn("Permission sync failed:", e);
      }

      if (!serverAdmin) serverAdmin = isUserAdmin(user.email);

      if (mounted) {
        setIsAdmin(serverAdmin);
        setChecking(false);
      }
    };

    check();
    return () => {
      mounted = false;
    };
  }, [user, loading]);

  const canView = useCallback(
    (path: string) => isAdmin && hasPermissionToView(user?.email, path),
    [isAdmin, user?.email],
  );

  return { isAdmin, canView, loading: loading || checking };
};
