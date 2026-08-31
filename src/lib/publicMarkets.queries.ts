import { queryOptions } from "@tanstack/react-query";
import { getPublicMarkets } from "./publicMarkets.functions";
import type { PublicMarket } from "./publicMarkets.types";

export type { PublicMarket };

export const publicMarketsQuery = () =>
  queryOptions({
    queryKey: ["public-markets"],
    queryFn: () => getPublicMarkets() as Promise<PublicMarket[]>,
    staleTime: 20_000,
    refetchInterval: 30_000,
  });
