import * as React from "react";
import type { LucideIcon } from "lucide-react";
import {
  Home, BarChart2, Zap, Gem, Wallet, Settings, ShieldAlert, LayoutDashboard,
  Users, ShieldCheck, Activity, LifeBuoy, ArrowUpCircle, TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Canonical icon per navigation destination — keeps user & admin shells in sync. */
export const navIcons = {
  home: Home,
  market: BarChart2,
  trade: Zap,
  earn: Gem,
  assets: Wallet,
  settings: Settings,
  admin: ShieldAlert,
  dashboard: LayoutDashboard,
  users: Users,
  financial: Wallet,
  deposits: Activity,
  withdrawals: ArrowUpCircle,
  futures: Activity,
  spot: TrendingUp,
  kyc: ShieldCheck,
  wallets: Wallet,
  support: LifeBuoy,
  administrator: ShieldCheck,
  ownership: ShieldCheck,
} satisfies Record<string, LucideIcon>;

export type NavIconKey = keyof typeof navIcons;

export interface NavIconProps {
  icon: LucideIcon | NavIconKey;
  active?: boolean;
  size?: number;
  /** Rounded tinted container behind the glyph (used by sidebars). */
  boxed?: boolean;
  className?: string;
}

export const NavIcon = ({ icon, active = false, size = 20, boxed = false, className }: NavIconProps) => {
  const Icon = typeof icon === "string" ? navIcons[icon] : icon;
  const glyph = (
    <Icon
      size={size}
      strokeWidth={active ? 2.5 : 2}
      className={boxed ? undefined : cn("transition-colors", active ? "text-current" : "text-current/70", className)}
    />
  );

  if (!boxed) return glyph;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-xl transition-all duration-200",
        size <= 18 ? "h-8 w-8" : "h-9 w-9",
        active
          ? "bg-primary/15 text-primary scale-105"
          : "bg-muted/40 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
        className,
      )}
    >
      {glyph}
    </span>
  );
};
