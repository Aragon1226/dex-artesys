import { useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "@/lib/router-compat";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import CubeSpinner from "@/components/shared/CubeSpinner";

interface AdminRouteGuardProps {
  children: ReactNode;
  /** Where to send signed-out visitors (the admin portal sign-in) */
  signInPath?: string;

  /** Where to send admins lacking per-page permission */
  deniedPath?: string;
}

/**
 * Single shared guard for every admin route.
 *
 * Handles, consistently in one place:
 *  - loading state while the session + server role check resolve
 *  - redirect to sign-in for anonymous visitors (remembering the target path)
 *  - redirect away for authenticated non-admins
 *  - per-page permission hiding for admins without access to a specific page
 *
 * This is presentation-level only — RLS and server-side checks remain the
 * enforcement boundary.
 */
export const AdminRouteGuard = ({
  children,
  signInPath = "/admin/login",
  deniedPath = "/admin/dashboard",
}: AdminRouteGuardProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { isAdmin, canView, loading: checkingRole } = useAdminAccess();

  const pathname = location.pathname;
  const allowed = isAdmin && canView(pathname);

  useEffect(() => {
    if (loading || checkingRole) return;

    if (!user) {
      sessionStorage.setItem("admin_redirect", pathname);
      navigate(signInPath, { replace: true });
    } else if (!isAdmin) {
      // Admin-only credentials: a non-admin session has no place in this
      // portal, so it is signed out rather than handed off to the user app.
      toast.error("This account is not authorized for the administrator portal.");
      void signOut().finally(() => navigate(signInPath, { replace: true }));
    } else if (!canView(pathname)) {
      if (pathname !== deniedPath) {
        toast.error("Access Denied: You do not have permission to view this page.");
        navigate(deniedPath, { replace: true });
      }
    }
  }, [
    user,
    loading,
    checkingRole,
    isAdmin,
    canView,
    navigate,
    pathname,
    signInPath,
    deniedPath,
    signOut,
  ]);

  if (loading || checkingRole) {
    return <CubeSpinner fullScreen label="Verifying admin credentials..." />;
  }

  if (!user || !allowed) return null;

  return <>{children}</>;
};

export default AdminRouteGuard;
