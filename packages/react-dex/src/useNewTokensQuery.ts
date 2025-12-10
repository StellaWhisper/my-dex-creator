import { DexClient } from "@chainstream-io/sdk";
import { Token } from "@chainstream-io/sdk/openapi";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { CHAIN_ID } from "@liberfi/core";
import { useDexClient } from "./DexClientProvider";
import { QueryKeys } from "./queryKeys";
import { UseNewTokensQueryParams } from "./types";
import { chainParam } from "./utils";

const defaultParam: UseNewTokensQueryParams = {
  chain: CHAIN_ID.SOLANA,
};

export async function fetchNewTokens(client: DexClient, param: UseNewTokensQueryParams) {
  return await client.ranking.getNewTokens({ ...param, chain: chainParam(param.chain) });
}

export function useNewTokensQuery(
  param: UseNewTokensQueryParams = defaultParam,
  options: Omit<
    UseQueryOptions<Array<Token>, Error, Array<Token>, string[]>,
    "queryKey" | "queryFn"
  > = {},
) {
  const client = useDexClient();
  return useQuery({
    queryKey: QueryKeys.newTokens(param),
    queryFn: async () => fetchNewTokens(client, param),
    ...options,
  });
}
