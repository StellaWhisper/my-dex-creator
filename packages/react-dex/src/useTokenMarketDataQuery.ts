import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { DexClient } from "@chainstream-io/sdk";
import { TokenMarketData } from "@chainstream-io/sdk/openapi";
import { CHAIN_ID } from "@liberfi/core";
import { useDexClient } from "./DexClientProvider";
import { chainParam } from "./utils";
import { QueryKeys } from "./queryKeys";

export async function fetchTokenMarketData(
  client: DexClient,
  chain: CHAIN_ID,
  tokenAddress: string,
) {
  return client.token.getMarketData({ chain: chainParam(chain), tokenAddress });
}

export function useTokenMarketDataQuery(
  chain: CHAIN_ID,
  tokenAddress: string,
  options: Omit<
    UseQueryOptions<TokenMarketData | null, Error, TokenMarketData | null, string[]>,
    "queryKey" | "queryFn"
  > = {},
) {
  const client = useDexClient();
  return useQuery({
    queryKey: QueryKeys.tokenMarketData(chain, tokenAddress),
    queryFn: async () => fetchTokenMarketData(client, chain, tokenAddress),
    ...options,
  });
}
