import React, { useState } from "react";
import { RefreshCw, WifiOff } from "lucide-react";
import { Link } from "@/lib/router-compat";
import loaderMark from "@/assets/generated/loader-mark.png";

export interface RetryStateProps {
  title?: string;
  description?: string;
  /** Raw error text shown in a small monospace line, when available. */
  detail?: string;
  onRetry: () => void | Promise<unknown>;
  retryLabel?: string;
  secondary?: { label: string; to?: string; onClick?: () => void };
  size?: "sm" | "md" | "lg";
  className?: string;
}

const padding = { sm: "py-6", md: "py-10", lg: "py-14" } as const;
const markSize = { sm: 56, md: 76, lg: 96 } as const;

/** Failure state with a branded mark and a retry action, used wherever a fetch can fail. */
export const RetryState: React.FC<RetryStateProps> = ({
  title = "Couldn't load this yet",
  description = "The request didn't come back. Check your connection and try again.",
  detail,
  onRetry,
  retryLabel = "Try again",
  secondary,
  size = "md",
  className = "",
}) => {
  const [busy, setBusy] = useState(false);

  const handleRetry = async () => {
    setBusy(true);
    try {
      await onRetry();
    } finally {
      setBusy(false);
    }
  };

  const px = markSize[size];

  return (
    <div
      role="alert"
      data-testid="retry-state"
      className={`flex flex-col items-center text-center px-4 ${padding[size]} ${className}`}
    >
      <div className="relative mb-4">
        <div className="absolute inset-0 rounded-full bg-danger/15 blur-2xl" aria-hidden="true" />
        <img
          src={loaderMark}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={px}
          height={px}
          style={{ width: px, height: px }}
          className="relative object-contain opacity-40 grayscale"
        />
        <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-danger-soft border border-danger/30 flex items-center justify-center">
          <WifiOff size={13} className="text-danger" />
        </span>
      </div>

      <p className="text-sm md:text-base font-bold text-foreground">{title}</p>
      <p className="mt-1 max-w-xs text-xs md:text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      {detail && (
        <p className="mt-2 max-w-sm text-[10px] font-mono text-muted-foreground/70 break-words">
          {detail}
        </p>
      )}

      <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full max-w-xs sm:w-auto sm:max-w-none">
        <button
          type="button"
          data-testid="retry-button"
          onClick={handleRetry}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider shadow-brand-sm hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          <RefreshCw size={14} className={busy ? "animate-spin" : ""} />
          {busy ? "Retrying…" : retryLabel}
        </button>
        {secondary &&
          (secondary.to ? (
            <Link
              to={secondary.to}
              onClick={secondary.onClick}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-muted/40 text-foreground text-xs font-bold uppercase tracking-wider hover:bg-muted transition-colors"
            >
              {secondary.label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={secondary.onClick}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-muted/40 text-foreground text-xs font-bold uppercase tracking-wider hover:bg-muted transition-colors"
            >
              {secondary.label}
            </button>
          ))}
      </div>
    </div>
  );
};
