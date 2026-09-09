import React, { useEffect, useState } from "react";
import { Check, ChevronRight, ShieldCheck, Wallet, CandlestickChart, X } from "lucide-react";

const STORAGE_KEY = "crypx_onboarding_dismissed";

export interface GetStartedChecklistProps {
  kycStatus: string | null | undefined;
  funded: boolean;
  traded: boolean;
  onStartKyc: () => void;
  onDeposit: () => void;
  onTrade: () => void;
  className?: string;
}

interface StepDef {
  key: string;
  label: string;
  helper: string;
  icon: typeof ShieldCheck;
  done: boolean;
  pending?: boolean;
  onClick: () => void;
}

export const GetStartedChecklist: React.FC<GetStartedChecklistProps> = ({
  kycStatus,
  funded,
  traded,
  onStartKyc,
  onDeposit,
  onTrade,
  className = "",
}) => {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  const kycDone = kycStatus === "VERIFIED";
  const kycPending = kycStatus === "PENDING";

  const steps: StepDef[] = [
    {
      key: "kyc",
      label: "Verify your identity",
      helper: kycPending ? "Under review" : "Takes about 2 minutes",
      icon: ShieldCheck,
      done: kycDone,
      pending: kycPending,
      onClick: onStartKyc,
    },
    {
      key: "fund",
      label: "Add funds",
      helper: "Deposit to start trading",
      icon: Wallet,
      done: funded,
      onClick: onDeposit,
    },
    {
      key: "trade",
      label: "Make your first trade",
      helper: "Spot or futures markets",
      icon: CandlestickChart,
      done: traded,
      onClick: onTrade,
    },
  ];

  const completed = steps.filter((s) => s.done).length;
  const allDone = completed === steps.length;

  if (dismissed || allDone) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* storage unavailable — hide for this session only */
    }
  };

  return (
    <section
      aria-label="Get started"
      className={`relative rounded-3xl border border-primary/20 bg-card p-4 shadow-sm ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-transparent"
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-foreground">Get started</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {completed} of {steps.length} steps done
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Hide get started steps"
          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted"
        >
          <X size={16} />
        </button>
      </div>

      <div className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${(completed / steps.length) * 100}%` }}
        />
      </div>

      <ul className="relative mt-3 space-y-2">
        {steps.map((step) => (
          <li key={step.key}>
            <button
              type="button"
              onClick={step.onClick}
              disabled={step.done}
              className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all ${
                step.done
                  ? "border-success/25 bg-success/5"
                  : "border-border bg-muted/30 hover:bg-muted active:scale-[0.99]"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  step.done ? "bg-success/15 text-success" : "bg-primary/10 text-primary"
                }`}
              >
                {step.done ? <Check size={18} strokeWidth={3} /> : <step.icon size={18} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-foreground">{step.label}</span>
                <span className="block text-xs text-muted-foreground">
                  {step.done ? "Completed" : step.helper}
                </span>
              </span>
              {!step.done && (
                <ChevronRight size={16} className="shrink-0 text-muted-foreground" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default GetStartedChecklist;
