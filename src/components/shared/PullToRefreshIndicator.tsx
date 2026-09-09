import { RefreshCw } from "lucide-react";

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  isReady: boolean;
}

/** Small floating badge that reflects pull-to-refresh drag state. */
export const PullToRefreshIndicator = ({
  pullDistance,
  isRefreshing,
  isReady,
}: PullToRefreshIndicatorProps) => {
  const visible = isRefreshing || pullDistance > 4;
  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed left-1/2 top-2 z-50 -translate-x-1/2"
      style={{ transform: `translate(-50%, ${Math.min(pullDistance, 56)}px)` }}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 rounded-full border border-border bg-card/95 px-3 py-1.5 text-[11px] font-bold text-muted-foreground shadow-lg backdrop-blur">
        <RefreshCw
          size={13}
          className={isRefreshing ? "animate-spin text-primary" : isReady ? "text-primary" : ""}
        />
        <span>{isRefreshing ? "Refreshing" : isReady ? "Release to refresh" : "Pull down"}</span>
      </div>
    </div>
  );
};
