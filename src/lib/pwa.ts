// Single registration point for the generated service worker.
// Registration is refused in dev, in any Lovable preview/iframe context, and
// whenever ?sw=off is present; in those cases stale registrations are removed.

const SW_URL = "/sw.js";

function isPreviewHost(hostname: string): boolean {
  return (
    hostname.startsWith("id-preview--") ||
    hostname.startsWith("preview--") ||
    hostname === "lovableproject.com" ||
    hostname.endsWith(".lovableproject.com") ||
    hostname === "lovableproject-dev.com" ||
    hostname.endsWith(".lovableproject-dev.com") ||
    hostname === "beta.lovable.dev" ||
    hostname.endsWith(".beta.lovable.dev")
  );
}

async function unregisterAppServiceWorkers(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.allSettled(
    registrations
      .filter((registration) => {
        const scriptUrl =
          registration.active?.scriptURL ??
          registration.waiting?.scriptURL ??
          registration.installing?.scriptURL ??
          "";
        return scriptUrl.endsWith(SW_URL);
      })
      .map((registration) => registration.unregister()),
  );
}

export function registerServiceWorker(): void {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  const inIframe = window.self !== window.top;
  const swDisabled = new URL(window.location.href).searchParams.get("sw") === "off";
  const refused =
    !import.meta.env.PROD || inIframe || swDisabled || isPreviewHost(window.location.hostname);

  if (refused) {
    void unregisterAppServiceWorkers();
    return;
  }

  void navigator.serviceWorker.register(SW_URL, { scope: "/" }).catch(() => {
    // A failed registration must never break the app shell.
  });
}
