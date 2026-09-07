import { Outlet, Link, useLocation, useNavigate } from "@/lib/router-compat";
import { ShieldCheck, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { Logo } from "@/components/shared/Logo";
import { AdminRouteGuard } from "@/components/shared/AdminRouteGuard";
import { NavIcon, type NavIconKey } from "@/components/shared/NavIcon";

const navItems: { path: string; label: string; key: NavIconKey }[] = [
  { path: "/admin/dashboard", label: "Dashboard", key: "dashboard" },
  { path: "/admin/users", label: "Users", key: "users" },
  { path: "/admin/financial-status", label: "Financial Status", key: "financial" },
  { path: "/admin/deposit-requests", label: "Deposits", key: "deposits" },
  { path: "/admin/withdrawals", label: "Withdrawals", key: "withdrawals" },
  { path: "/admin/futures", label: "Futures Control", key: "futures" },
  { path: "/admin/spot-control", label: "Spot Control", key: "spot" },
  { path: "/admin/kyc", label: "KYC", key: "kyc" },
  { path: "/admin/wallets", label: "Wallets", key: "wallets" },
  { path: "/admin/customer-service", label: "Support Chat", key: "support" },
  { path: "/admin/support", label: "Contact Details", key: "support" },
  { path: "/admin/administrator", label: "Administrator", key: "administrator" },
  { path: "/admin/ownership", label: "Ownership", key: "ownership" },
];

const AdminShell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { canView } = useAdminAccess();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
      // Fallback redirect
      window.location.href = "/admin/login";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-card border-r border-border flex flex-col sticky top-0 h-screen shadow-xl z-40">
        <div className="p-8 border-b border-border">
          <Logo size={48} variant="FULL" className="scale-110" />
          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">
            <ShieldCheck size={10} className="text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">
              Admin Control
            </span>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 px-4 opacity-50">
            Main Menu
          </p>
          {navItems
            .filter((item) => canView(item.path))
            .map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <NavIcon icon={item.key} active={isActive} boxed size={18} />
                  {item.label}
                </Link>
              );
            })}
        </nav>

        <div className="p-6 border-t border-border mt-auto bg-muted/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl text-sm font-black text-destructive bg-destructive/5 hover:bg-destructive/10 transition-all border border-destructive/10 uppercase tracking-wider"
          >
            <LogOut size={18} />
            Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-muted/10">
        <Outlet />
      </main>
    </div>
  );
};

const AdminLayout = () => {
  const location = useLocation();

  // The portal sign-in page lives inside the /admin tree but must render
  // outside the guard and outside the admin chrome.
  if (location.pathname === "/admin/login") {
    return <Outlet />;
  }

  return (
    <AdminRouteGuard>
      <AdminShell />
    </AdminRouteGuard>
  );
};

export default AdminLayout;
