import type { ReactNode } from "react";
import { useAdminAccess } from "@/hooks/useAdminAccess";

interface AdminOnlyProps {
  children: ReactNode;
  /** Optional admin route path for per-page permission hiding, e.g. "/admin/users" */
  path?: string;
  /** Rendered while the role check is in flight or when access is denied */
  fallback?: ReactNode;
}

/**
 * Hides UI unless the signed-in user has the admin role.
 * This is presentation-level hiding only — the database (RLS) and the
 * admin route layout remain the enforcement boundary.
 */
export const AdminOnly = ({ children, path, fallback = null }: AdminOnlyProps) => {
  const { isAdmin, canView, loading } = useAdminAccess();

  if (loading) return <>{fallback}</>;
  if (!isAdmin) return <>{fallback}</>;
  if (path && !canView(path)) return <>{fallback}</>;

  return <>{children}</>;
};

export default AdminOnly;
