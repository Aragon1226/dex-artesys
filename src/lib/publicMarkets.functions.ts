import { createServerFn } from "@tanstack/react-start";

export const getPublicMarkets = createServerFn({ method: "GET" }).handler(async () => {
  const { readPublicMarkets } = await import("./publicMarkets.server");
  return await readPublicMarkets();
});
