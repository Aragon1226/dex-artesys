import React from "react";
import { Link } from "@/lib/router-compat";
import { Info, Lightbulb, ShieldCheck } from "lucide-react";
import emptyAssets from "@/assets/generated/empty-assets.png";
import emptyHistory from "@/assets/generated/empty-history.png";
import emptySupport from "@/assets/generated/empty-support.png";
import emptyReferrals from "@/assets/generated/empty-referrals.png";

export type EmptyArt = "assets" | "history" | "support" | "referrals";

const art: Record<EmptyArt, string> = {
  assets: emptyAssets,
  history: emptyHistory,
  support: emptySupport,
  referrals: emptyReferrals,
};

export interface EmptyStateProps {
  art?: EmptyArt;
  title: string;
  description?: string;
  /** Short helpful hint rendered in a callout box under the copy. */
  hint?: string;
  hintIcon?: "tip" | "info" | "secure";
  action?: { label: string; to?: string; onClick?: () => void };
  size?: "sm" | "md" | "lg";
  className?: string;
}

const imageSize = { sm: 84, md: 128, lg: 176 } as const;
const padding = { sm: "py-6", md: "py-10", lg: "py-14" } as const;

const hintIcons = { tip: Lightbulb, info: Info, secure: ShieldCheck } as const;

export const EmptyState: React.FC<EmptyStateProps> = ({
  art: artKey = "history",
  title,
  description,
  hint,
  hintIcon = "tip",
  action,
  size = "md",
  className = "",
}) => {
  const HintIcon = hintIcons[hintIcon];
  const px = imageSize[size];

  return (
    <div className={`flex flex-col items-center text-center px-4 ${padding[size]} ${className}`}>
      <div className="relative mb-4">
        <div
          className="absolute inset-0 rounded-full bg-primary/15 blur-2xl"
          aria-hidden="true"
        />
        <img
          src={art[artKey]}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={px}
          height={px}
          style={{ width: px, height: px }}
          className="relative object-contain opacity-90 drop-shadow-[0_10px_30px_hsl(var(--brand-primary)/0.25)]"
        />
      </div>

      <p className="text-sm md:text-base font-bold text-foreground">{title}</p>
      {description && (
        <p className="mt-1 max-w-xs text-xs md:text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}

      {hint && (
        <div className="mt-4 flex items-start gap-2 max-w-sm text-left bg-primary/5 border border-primary/15 rounded-2xl px-3.5 py-3">
          <HintIcon size={14} className="text-primary shrink-0 mt-0.5" />
          <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">{hint}</p>
        </div>
      )}

      {action && (
        <div className="mt-4">
          {action.to ? (
            <Link
              to={action.to}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider shadow-brand-sm hover:opacity-90 transition-opacity"
            >
              {action.label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={action.onClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider shadow-brand-sm hover:opacity-90 transition-opacity"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
