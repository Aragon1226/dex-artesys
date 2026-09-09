import { useEffect, useRef, useState } from "react";

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<unknown> | unknown;
  /** Pixels the user must drag before the refresh fires. */
  threshold?: number;
  enabled?: boolean;
}

interface PullToRefreshState {
  /** Current drag distance in pixels, already damped for display. */
  pullDistance: number;
  isRefreshing: boolean;
  isReady: boolean;
}

/**
 * Touch pull-to-refresh for scroll containers that start at the top of the page.
 * Only active for touch input; mouse/desktop sessions are untouched.
 */
export const usePullToRefresh = ({
  onRefresh,
  threshold = 70,
  enabled = true,
}: UsePullToRefreshOptions): PullToRefreshState => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const refreshRef = useRef(onRefresh);
  refreshRef.current = onRefresh;

  useEffect(() => {
    if (!enabled) return;

    const handleStart = (event: TouchEvent) => {
      if (window.scrollY > 4 || event.touches.length !== 1) return;
      startY.current = event.touches[0].clientY;
    };

    const handleMove = (event: TouchEvent) => {
      if (startY.current === null) return;
      const delta = event.touches[0].clientY - startY.current;
      if (delta <= 0) {
        setPullDistance(0);
        return;
      }
      // Damp the drag so the indicator feels elastic rather than 1:1.
      setPullDistance(Math.min(delta * 0.5, threshold * 1.6));
    };

    const handleEnd = () => {
      const shouldRefresh = pullDistance >= threshold;
      startY.current = null;
      setPullDistance(0);
      if (!shouldRefresh || isRefreshing) return;
      setIsRefreshing(true);
      void Promise.resolve(refreshRef.current()).finally(() => setIsRefreshing(false));
    };

    window.addEventListener("touchstart", handleStart, { passive: true });
    window.addEventListener("touchmove", handleMove, { passive: true });
    window.addEventListener("touchend", handleEnd);
    window.addEventListener("touchcancel", handleEnd);
    return () => {
      window.removeEventListener("touchstart", handleStart);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("touchcancel", handleEnd);
    };
  }, [enabled, threshold, pullDistance, isRefreshing]);

  return { pullDistance, isRefreshing, isReady: pullDistance >= threshold };
};
