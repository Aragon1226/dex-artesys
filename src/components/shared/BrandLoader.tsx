import React from "react";
import loaderMark from "@/assets/generated/loader-mark.png";

interface BrandLoaderProps {
  size?: number;
  label?: string;
  className?: string;
}

/** Logo-derived loading mark: pulsing amber emblem with an orbiting ring. */
export const BrandLoader: React.FC<BrandLoaderProps> = ({ size = 48, label, className = "" }) => (
  <div className={`flex flex-col items-center justify-center gap-3 ${className}`} role="status" aria-live="polite">
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" aria-hidden="true" />
      <div
        className="absolute -inset-1.5 rounded-full border-2 border-primary/25 border-t-primary animate-spin"
        aria-hidden="true"
      />
      <img
        src={loaderMark}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="relative object-contain animate-pulse drop-shadow-[0_6px_20px_hsl(var(--brand-primary)/0.35)]"
      />
    </div>
    {label && (
      <p className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
    )}
    <span className="sr-only">Loading</span>
  </div>
);

/** Shimmering placeholder block used by the skeleton compositions. */
export const Shimmer: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`bg-muted/60 dark:bg-card/40 rounded-xl relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
  </div>
);

export type SkeletonVariant = "list" | "history" | "positions" | "chat" | "table";

interface LoadingBlockProps {
  variant?: SkeletonVariant;
  rows?: number;
  /** Show the logo loader above the skeleton rows. */
  brand?: boolean;
  label?: string;
  className?: string;
}

/**
 * Branded loading block: logo mark + skeleton rows shaped like the content
 * that is about to arrive, so empty states never flash during initial fetches.
 */
export const LoadingBlock: React.FC<LoadingBlockProps> = ({
  variant = "list",
  rows = 4,
  brand = true,
  label,
  className = "",
}) => {
  const items = Array.from({ length: rows }, (_, i) => i);

  return (
    <div className={`w-full ${className}`} aria-busy="true">
      {brand && <BrandLoader size={44} label={label} className="py-5" />}

      <div className="space-y-2.5 select-none">
        {variant === "chat"
          ? items.map(i => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                <Shimmer className={`h-12 rounded-2xl ${i % 2 === 0 ? "w-3/5" : "w-2/5"}`} />
              </div>
            ))
          : items.map(i => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border/40 bg-card/30 px-3.5 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {variant !== "table" && <Shimmer className="w-9 h-9 rounded-full shrink-0" />}
                  <div className="space-y-1.5">
                    <Shimmer className="w-24 h-3.5" />
                    <Shimmer className="w-14 h-2.5" />
                  </div>
                </div>
                <div className="text-right space-y-1.5">
                  <Shimmer className="w-20 h-3.5 ml-auto" />
                  <Shimmer
                    className={
                      variant === "positions" || variant === "history"
                        ? "w-16 h-5 rounded-lg ml-auto"
                        : "w-12 h-2.5 ml-auto"
                    }
                  />
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};
