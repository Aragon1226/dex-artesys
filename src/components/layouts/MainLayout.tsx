import { useState, Suspense } from "react";
import { Outlet, NavLink } from "@/lib/router-compat";
import { Logo } from "@/components/shared/Logo";
import { SupportChatModal } from "@/components/shared/SupportChatModal";
import { PageSkeleton } from "@/components/shared/PageSkeleton";
import { PageLoadingOverlay } from "@/components/shared/PageLoadingOverlay";
import { NavIcon, type NavIconKey } from "@/components/shared/NavIcon";
import { StatusDot } from "@/components/shared/StatusBadge";
import { useAuth } from "@/hooks/useAuth";
import { useDesktopDevice } from "@/hooks/useDesktopDevice";

const MainLayout = () => {
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const { user } = useAuth();
  const isDesktop = useDesktopDevice();

  const navItems: { key: NavIconKey; label: string; path: string }[] = [
    { key: "home", label: "Home", path: "/app/home" },
    { key: "market", label: "Market", path: "/app/market" },
    { key: "trade", label: "Trade", path: "/app/trade-fi" },
    { key: "earn", label: "Earn", path: "/app/earn" },
    { key: "assets", label: "Assets", path: "/app/assets" },
  ];

  return (
    <div className={`relative flex min-h-screen bg-background ${isDesktop ? "flex-row" : "flex-col"}`}>
      {/* Global Route Loading Progress Bar & Overlay */}
      <PageLoadingOverlay />

      {/* Desktop Sidebar (real desktop sessions only) */}
      {isDesktop && (
        <nav className="sticky top-0 z-40 flex h-screen w-64 shrink-0 flex-col border-r border-border bg-card/50 px-4 py-8 backdrop-blur-xl lg:w-72">
          <div className="px-4 mb-10">
            <Logo size={52} variant="FULL" />
          </div>

          <div className="flex-1 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <NavIcon icon={item.key} active={isActive} boxed />
                    <span className="text-sm font-bold tracking-wide">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="pt-6 border-t border-border mt-auto">
            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
              <p className="text-[11px] uppercase font-black text-primary tracking-widest mb-1">
                Status
              </p>
              <p className="flex items-center gap-2 text-xs font-bold text-foreground">
                <StatusDot tone="success" pulse />
                Operational
              </p>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main
          className={`custom-scrollbar flex-1 overflow-y-auto ${isDesktop ? "pb-0" : "pb-16"}`}
        >
          <div
            className={`mx-auto w-full ${isDesktop ? "max-w-7xl" : "max-w-[480px] border-x border-border/40"}`}
          >
            <Suspense fallback={<PageSkeleton />}>
              <Outlet />
            </Suspense>
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        {!isDesktop && (
          <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/90 px-4 py-2 shadow-lg backdrop-blur-xl pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-around max-w-lg mx-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative flex flex-col items-center justify-center min-w-[56px] py-1 transition-all duration-200 active:scale-90 ${
                      isActive
                        ? "text-primary font-bold"
                        : "text-muted-foreground hover:text-foreground font-medium"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? "bg-primary/15 text-primary scale-105" : "bg-transparent"}`}
                      >
                        <NavIcon icon={item.key} active={isActive} size={20} />
                      </div>

                      <span
                        className={`text-[11px] tracking-tight transition-all duration-200 ${isActive ? "opacity-100 font-bold" : "opacity-80"}`}
                      >
                        {item.label}
                      </span>
                      {isActive && (
                        <div className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-primary shadow-sm shadow-primary/50" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </div>

      <SupportChatModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </div>
  );
};

export default MainLayout;
