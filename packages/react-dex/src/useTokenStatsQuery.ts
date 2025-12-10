import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { DexClient } from "@chainstream-io/sdk";
import { TokenStat } from "@chainstream-io/sdk/openapi";
import { CHAIN_ID } from "@liberfi/core";
import { useDexClient } from "./DexClientProvider";
import { QueryKeys } from "./queryKeys";
import { chainParam } from "./utils";

export async function fetchTokenStats(client: DexClient, chain: CHAIN_ID, tokenAddress: string) {
  return await client.token.getStats({ chain: chainParam(chain), tokenAddress });
}

export function useTokenStatsQuery(
  chain: CHAIN_ID,
  tokenAddress: string,
  options: Omit<
    UseQueryOptions<TokenStat | null, Error, TokenStat | null, string[]>,
    "queryKey" | "queryFn"
  > = {},
) {
  const client = useDexClient();
  return useQuery({
    queryKey: QueryKeys.tokenStats(chain, tokenAddress),
    queryFn: async () => fetchTokenStats(client, chain, tokenAddress),
    ...options,
  });
}
