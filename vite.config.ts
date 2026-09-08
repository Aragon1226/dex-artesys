// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import path from "node:path";

import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// Load non-VITE_ env vars into process.env for server-side code only (never the client bundle).
const serverEnv = loadEnv(process.env["NODE_ENV"] ?? "development", process.cwd(), "");
Object.assign(process.env, serverEnv);

const EVENTS_SHIM = path.resolve(import.meta.dirname, "src/lib/shims/events.ts");
const BUFFER_SHIM = path.resolve(import.meta.dirname, "node_modules/buffer/index.js");

/**
 * The client build stubs Node builtins (`events`, `buffer`) to an empty module, which
 * breaks WalletConnect at runtime ("EventEmitter is not a constructor"). A plain
 * resolve.alias loses to that stub, so resolve them here with `enforce: "pre"`.
 */
function nodeShimsForBrowser() {
  return {
    name: "artesys-node-shims-browser",
    enforce: "pre" as const,
    resolveId(id: string) {
      const isClient = (this as { environment?: { name?: string } }).environment?.name === "client";
      if (!isClient) return null;
      if (id === "events" || id === "node:events") return EVENTS_SHIM;
      if (id === "buffer" || id === "node:buffer") return BUFFER_SHIM;
      return null;
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      nodeShimsForBrowser(),
      // Offline support: Workbox generates /sw.js at build time. Registration is
      // guarded in src/lib/pwa.ts so previews and dev never install a worker.
      VitePWA({
        strategies: "generateSW",
        registerType: "autoUpdate",
        injectRegister: null,
        filename: "sw.js",
        devOptions: { enabled: false },
        manifest: false,
        workbox: {
          globDirectory: ".output/public",
          globPatterns: ["**/*.{js,css,woff2,png,svg,jpg,webp}"],
          // Store-listing screenshots are large and never needed offline.
          globIgnores: ["**/screenshots/**"],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,

          navigateFallback: "/offline.html",
          navigateFallbackDenylist: [/^\/~oauth/, /^\/api\//, /^\/lovable\//],
          cleanupOutdatedCaches: true,
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.mode === "navigate",
              handler: "NetworkFirst",
              options: {
                cacheName: "artesys-pages",
                networkTimeoutSeconds: 5,
                expiration: { maxEntries: 40 },
              },
            },
            {
              urlPattern: ({ url, request, sameOrigin }) =>
                Boolean(sameOrigin) &&
                (request.destination === "script" ||
                  request.destination === "style" ||
                  request.destination === "image" ||
                  request.destination === "font") &&
                !url.pathname.startsWith("/api/"),
              handler: "CacheFirst",
              options: {
                cacheName: "artesys-assets",
                expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: [
        { find: "entities/lib/decode.js", replacement: path.resolve(import.meta.dirname, "node_modules/entities/lib/decode.js") },
        { find: "entities/lib/encode.js", replacement: path.resolve(import.meta.dirname, "node_modules/entities/lib/encode.js") },
        { find: /^entities$/, replacement: path.resolve(import.meta.dirname, "node_modules/entities") },
      ],
    },
    define: {
      global: "globalThis",
    },
    optimizeDeps: {
      include: ["@walletconnect/ethereum-provider", "buffer"],
    },
  },
});
