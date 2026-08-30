// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import path from "node:path";

import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";

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
    plugins: [nodeShimsForBrowser()],
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
