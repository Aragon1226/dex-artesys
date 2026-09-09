import React from "react";
import { Check } from "lucide-react";

export interface StepProgressProps {
  steps: string[];
  /** Zero-based index of the current step. */
  current: number;
  className?: string;
}

/** Compact numbered step indicator used by the deposit and withdrawal flows. */
export const StepProgress: React.FC<StepProgressProps> = ({ steps, current, className = "" }) => (
  <ol className={`flex items-center gap-2 ${className}`} aria-label="Progress">
    {steps.map((label, index) => {
      const done = index < current;
      const active = index === current;
      return (
        <li key={label} className="flex flex-1 items-center gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <span
              aria-current={active ? "step" : undefined}
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${
                done
                  ? "bg-success/15 text-success"
                  : active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {done ? <Check size={12} strokeWidth={3} /> : index + 1}
            </span>
            <span
              className={`truncate text-[11px] font-bold ${
                active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
          )}
        </li>
      );
    })}
  </ol>
);

export default StepProgress;
