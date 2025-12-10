import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { DexClient } from "@chainstream-io/sdk";
import { TradePage } from "@chainstream-io/sdk/openapi";
import { useDexClient } from "./DexClientProvider";
import { QueryKeys } from "./queryKeys";
import { chainParam } from "./utils";
import { UseTokenTradesQueryParams } from "./types";

export async function fetchTokenTrades(client: DexClient, param: UseTokenTradesQueryParams) {
  return await client.trade.getTrades({
    limit: 100,
    ...param,
    chain: chainParam(param.chain),
  });
}

export function useTokenTradesQuery(
  param: UseTokenTradesQueryParams,
  options: Omit<
    UseQueryOptions<TradePage, Error, TradePage, string[]>,
    "queryKey" | "queryFn"
  > = {},
) {
  const client = useDexClient();
  return useQuery({
    queryKey: QueryKeys.tokenTrades(param),
    queryFn: async () => fetchTokenTrades(client, param),
    ...options,
  });
}
