import * as React from "react";
import {
  CheckCircle2, Clock, XCircle, AlertTriangle, Info, Loader2,
  ShieldCheck, TrendingUp, TrendingDown, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Single source of truth for UI state colors + icons across the app.
 * Tones map to semantic tokens defined in src/styles.css.
 */
export type StatusTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "brand"
  | "up"
  | "down";

const toneClasses: Record<StatusTone, string> = {
  success: "bg-success-soft text-success border-success/25",
  warning: "bg-warning-soft text-warning border-warning/25",
  danger: "bg-danger-soft text-danger border-danger/25",
  info: "bg-info-soft text-info border-info/25",
  neutral: "bg-muted text-muted-foreground border-border",
  brand: "bg-primary/10 text-primary border-primary/25",
  up: "bg-success-soft text-success border-success/25",
  down: "bg-danger-soft text-danger border-danger/25",
};

const toneIcons: Record<StatusTone, LucideIcon> = {
  success: CheckCircle2,
  warning: Clock,
  danger: XCircle,
  info: Info,
  neutral: Info,
  brand: ShieldCheck,
  up: TrendingUp,
  down: TrendingDown,
};

/** Canonical status keyword -> tone map (case-insensitive). */
const statusTone: Record<string, StatusTone> = {
  approved: "success",
  verified: "success",
  completed: "success",
  complete: "success",
  success: "success",
  active: "success",
  filled: "success",
  paid: "success",
  open: "info",
  processing: "info",
  submitted: "info",
  pending: "warning",
  review: "warning",
  unverified: "warning",
  hold: "warning",
  rejected: "danger",
  failed: "danger",
  cancelled: "danger",
  canceled: "danger",
  liquidated: "danger",
  blocked: "danger",
  suspended: "danger",
  closed: "neutral",
  draft: "neutral",
  none: "neutral",
  buy: "up",
  long: "up",
  sell: "down",
  short: "down",
};

export function toneForStatus(status?: string | null): StatusTone {
  if (!status) return "neutral";
  return statusTone[status.trim().toLowerCase()] ?? "neutral";
}

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: string | null;
  tone?: StatusTone;
  label?: string;
  icon?: LucideIcon | null;
  size?: "sm" | "md";
  loading?: boolean;
}

export const StatusBadge = ({
  status,
  tone,
  label,
  icon,
  size = "sm",
  loading = false,
  className,
  ...rest
}: StatusBadgeProps) => {
  const resolvedTone = tone ?? toneForStatus(status);
  const Icon = loading ? Loader2 : icon === null ? null : (icon ?? toneIcons[resolvedTone]);
  const text = label ?? status ?? resolvedTone;

  return (
    <span
      {...rest}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-bold uppercase tracking-wider whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        toneClasses[resolvedTone],
        className,
      )}
    >
      {Icon && (
        <Icon
          size={size === "sm" ? 11 : 14}
          strokeWidth={2.5}
          className={loading ? "animate-spin" : undefined}
        />
      )}
      {text}
    </span>
  );
};

/** Small dot indicator sharing the same tone palette. */
export const StatusDot = ({
  tone = "neutral",
  pulse = false,
  className,
}: { tone?: StatusTone; pulse?: boolean; className?: string }) => (
  <span className={cn("relative inline-flex h-2 w-2", className)}>
    {pulse && (
      <span
        className={cn("absolute inset-0 rounded-full opacity-60 animate-ping", toneClasses[tone])}
      />
    )}
    <span className={cn("relative h-2 w-2 rounded-full", toneClasses[tone], "border-0")} style={{ backgroundColor: "currentColor" }} />
  </span>
);

export { AlertTriangle as StatusWarningIcon };
