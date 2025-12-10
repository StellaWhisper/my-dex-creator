import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { DexClient } from "@chainstream-io/sdk";
import { Token } from "@chainstream-io/sdk/openapi";
import { CHAIN_ID } from "@liberfi/core";
import { useDexClient } from "./DexClientProvider";
import { chainParam } from "./utils";
import { UseHotTokensQueryParams } from "./types";
import { QueryKeys } from "./queryKeys";

const defaultParam: UseHotTokensQueryParams = {
  chain: CHAIN_ID.SOLANA,
  duration: "24h",
};

export async function fetchHotTokens(client: DexClient, param: UseHotTokensQueryParams) {
  return await client.ranking.getHotTokens({ ...param, chain: chainParam(param.chain) });
}

export function useHotTokensQuery(
  param: UseHotTokensQueryParams = defaultParam,
  options: Omit<
    UseQueryOptions<Array<Token>, Error, Array<Token>, string[]>,
    "queryKey" | "queryFn"
  > = {},
) {
  const client = useDexClient();
  return useQuery({
    queryKey: QueryKeys.hotTokens(param),
    queryFn: async () => fetchHotTokens(client, param),
    ...options,
  });
}
