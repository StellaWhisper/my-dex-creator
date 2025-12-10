import { DexClient } from "@chainstream-io/sdk";
import { Token } from "@chainstream-io/sdk/openapi";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { CHAIN_ID } from "@liberfi/core";
import { useDexClient } from "./DexClientProvider";
import { QueryKeys } from "./queryKeys";
import { UseMigratedTokensQueryParams } from "./types";
import { chainParam } from "./utils";

const defaultParam: UseMigratedTokensQueryParams = {
  chain: CHAIN_ID.SOLANA,
};

export async function fetchMigratedTokens(client: DexClient, param: UseMigratedTokensQueryParams) {
  return await client.ranking.getMigratedTokens({ ...param, chain: chainParam(param.chain) });
}

export function useMigratedTokensQuery(
  param: UseMigratedTokensQueryParams = defaultParam,
  options: Omit<
    UseQueryOptions<Array<Token>, Error, Array<Token>, string[]>,
    "queryKey" | "queryFn"
  > = {},
) {
  const client = useDexClient();
  return useQuery({
    queryKey: QueryKeys.migratedTokens(param),
    queryFn: async () => fetchMigratedTokens(client, param),
    ...options,
  });
}
