import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { DexClient } from "@chainstream-io/sdk";
import { Token } from "@chainstream-io/sdk/openapi";
import { CHAIN_ID } from "@liberfi/core";
import { useDexClient } from "./DexClientProvider";
import { QueryKeys } from "./queryKeys";
import { chainParam } from "./utils";

export async function fetchToken(client: DexClient, chain: CHAIN_ID, tokenAddress: string) {
  return await client.token.getToken({ chain: chainParam(chain), tokenAddress });
}

export function useTokenQuery(
  chain: CHAIN_ID,
  tokenAddress: string,
  options: Omit<UseQueryOptions<Token, Error, Token, string[]>, "queryKey" | "queryFn"> = {},
) {
  const client = useDexClient();
  return useQuery({
    queryKey: QueryKeys.token(chain, tokenAddress),
    queryFn: async () => fetchToken(client, chain, tokenAddress),
    ...options,
  });
}
