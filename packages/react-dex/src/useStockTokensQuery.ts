import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { DexClient } from "@chainstream-io/sdk";
import { Token } from "@chainstream-io/sdk/openapi";
import { CHAIN_ID } from "@liberfi/core";
import { useDexClient } from "./DexClientProvider";
import { QueryKeys } from "./queryKeys";
import { UseStockTokensQueryParams } from "./types";
import { chainParam } from "./utils";

const defaultParam: UseStockTokensQueryParams = {
  chain: CHAIN_ID.SOLANA,
};

export async function fetchStockTokens(client: DexClient, param: UseStockTokensQueryParams) {
  return await client.ranking.getStocksTokens({ ...param, chain: chainParam(param.chain) });
}

export function useStockTokensQuery(
  param: UseStockTokensQueryParams = defaultParam,
  options: Omit<
    UseQueryOptions<Array<Token>, Error, Array<Token>, string[]>,
    "queryKey" | "queryFn"
  > = {},
) {
  const client = useDexClient();
  return useQuery({
    queryKey: QueryKeys.stockTokens(param),
    queryFn: async () => fetchStockTokens(client, param),
    ...options,
  });
}
