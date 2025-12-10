import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { DexClient } from "@chainstream-io/sdk";
import { Token } from "@chainstream-io/sdk/openapi";
import { useDexClient } from "./DexClientProvider";
import { QueryKeys } from "./queryKeys";
import { chainParam } from "./utils";
import { UseTokensQueryParams } from "./types";

export async function fetchTokens(client: DexClient, param: UseTokensQueryParams) {
  return await client.token.getTokens({
    ...param,
    tokenAddresses: param.tokenAddresses.sort().join(","),
    chain: chainParam(param.chain),
  });
}

export function useTokensQuery(
  param: UseTokensQueryParams,
  options: Omit<
    UseQueryOptions<Array<Token>, Error, Array<Token>, string[]>,
    "queryKey" | "queryFn"
  > = {},
) {
  const client = useDexClient();
  return useQuery({
    queryKey: QueryKeys.tokens(param),
    queryFn: async () => fetchTokens(client, param),
    ...options,
  });
}
