import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { DexClient } from "@chainstream-io/sdk";
import { TradePage } from "@chainstream-io/sdk/openapi";
import { useDexClient } from "./DexClientProvider";
import { QueryKeys } from "./queryKeys";
import { chainParam } from "./utils";
import { UseWalletTradesQueryParams } from "./types";

export async function fetchWalletTrades(client: DexClient, param: UseWalletTradesQueryParams) {
  return await client.trade.getTrades({
    limit: 100,
    ...param,
    chain: chainParam(param.chain),
  });
}

export function useWalletTradesQuery(
  param: UseWalletTradesQueryParams,
  options: Omit<
    UseQueryOptions<TradePage, Error, TradePage, string[]>,
    "queryKey" | "queryFn"
  > = {},
) {
  const client = useDexClient();
  return useQuery({
    queryKey: QueryKeys.walletTrades(param),
    queryFn: async () => fetchWalletTrades(client, param),
    ...options,
  });
}
