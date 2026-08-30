import React from "react";
import { ArtesysMark } from "@/components/shared/Logo";

interface BrandLoaderProps {
  size?: number;
  label?: string;
  className?: string;
}

/**
 * Logo-derived 3D loading mark: the extruded Artesys prism rotates in real
 * perspective, floating over a soft brand glow with an orbiting gold ring.
 * Theme-safe — every color comes from design tokens, so it reads on both the
 * light surface and the midnight dark background.
 */
export const BrandLoader: React.FC<BrandLoaderProps> = ({ size = 48, label, className = "" }) => (
  <div
    className={`flex flex-col items-center justify-center gap-3 ${className}`}
    role="status"
    aria-live="polite"
    data-testid="brand-loader"
  >
    <div
      className="relative grid place-items-center logo3d-scene"
      style={{ width: size * 1.5, height: size * 1.5 }}
    >
      {/* Brand glow bed */}
      <div
        className="absolute inset-0 rounded-full bg-brand-primary/15 dark:bg-brand-primary/25 blur-2xl animate-[logo3d-glow_2.4s_ease-in-out_infinite]"
        aria-hidden="true"
      />

      {/* Orbiting rings — tilted into the same 3D plane as the mark */}
      <div
        className="absolute inset-[6%] rounded-full border border-brand-primary/30 border-t-brand-primary animate-[logo3d-orbit_1.9s_linear_infinite] logo3d-ring"
        aria-hidden="true"
      />
      <div
        className="absolute inset-[16%] rounded-full border border-brand-gold/30 border-b-brand-gold/80 animate-[logo3d-orbit-rev_2.8s_linear_infinite] logo3d-ring"
        aria-hidden="true"
      />

      {/* The mark itself, spinning on its own Y axis with a gentle float */}
      <div className="logo3d-stage animate-[logo3d-float_3.2s_ease-in-out_infinite]">
        <ArtesysMark
          size={size}
          className="logo3d-mark animate-[logo3d-spin_3.4s_cubic-bezier(0.65,0,0.35,1)_infinite] drop-shadow-[0_8px_22px_hsl(var(--brand-primary)/0.4)]"
        />
      </div>
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
    <div
      className={`w-full ${className}`}
      aria-busy="true"
      data-testid="loading-block"
      data-variant={variant}
    >
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
