const STORAGE_KEY = "crypx_pending_ref_v1";
const COOKIE_KEY = "artesys_ref";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function readCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_KEY}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/** Keeps the referral code across OAuth redirects and page reloads. */
export function setPendingReferralCode(code: string): void {
  const trimmed = code.trim();
  if (!trimmed || typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, trimmed);
  } catch {
    // Private-mode storage failures must never block sign-up.
  }
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(trimmed)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

export function getPendingReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored?.trim()) return stored.trim();
  } catch {
    // Fall through to the cookie copy.
  }
  const cookie = readCookie();
  return cookie?.trim() ? cookie.trim() : null;
}

export function clearPendingReferralCode(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors.
  }
  document.cookie = `${COOKIE_KEY}=; path=/; max-age=0; samesite=lax`;
}
