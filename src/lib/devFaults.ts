/**
 * Dev-only fault injection used by end-to-end tests to exercise retry states for
 * fetches that always succeed through local fallbacks (e.g. the market feed).
 *
 * Enabled only when `import.meta.env.DEV` is true, via a URL flag:
 *   /app/market?forceFetchError=market
 * Multiple scopes can be comma separated: ?forceFetchError=market,assets
 */
export function isFaultInjected(scope: string): boolean {
  if (!import.meta.env.DEV) return false;
  if (typeof window === "undefined") return false;
  const raw = new URLSearchParams(window.location.search).get("forceFetchError");
  if (!raw) return false;
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .includes(scope.toLowerCase());
}

/** Throws when the given scope has an injected fault (dev + URL flag only). */
export function throwIfFaultInjected(scope: string, message = "Injected test failure"): void {
  if (isFaultInjected(scope)) {
    throw new Error(message);
  }
}
