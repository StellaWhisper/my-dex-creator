import { DexClient } from "@chainstream-io/sdk";
import { Token } from "@chainstream-io/sdk/openapi";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { CHAIN_ID } from "@liberfi/core";
import { useDexClient } from "./DexClientProvider";
import { QueryKeys } from "./queryKeys";
import { UseFinalStretchTokensQueryParams } from "./types";
import { chainParam } from "./utils";

const defaultParam: UseFinalStretchTokensQueryParams = {
  chain: CHAIN_ID.SOLANA,
};

export async function fetchFinalStretchTokens(
  client: DexClient,
  param: UseFinalStretchTokensQueryParams,
) {
  return await client.ranking.getFinalStretchTokens({ ...param, chain: chainParam(param.chain) });
}

export function useFinalStretchTokensQuery(
  param: UseFinalStretchTokensQueryParams = defaultParam,
  options: Omit<
    UseQueryOptions<Array<Token>, Error, Array<Token>, string[]>,
    "queryKey" | "queryFn"
  > = {},
) {
  const client = useDexClient();
  return useQuery({
    queryKey: QueryKeys.finalStretchTokens(param),
    queryFn: async () => fetchFinalStretchTokens(client, param),
    ...options,
  });
}
