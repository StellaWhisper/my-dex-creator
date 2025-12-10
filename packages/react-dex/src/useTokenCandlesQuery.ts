import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { DexClient } from "@chainstream-io/sdk";
import { Candle } from "@chainstream-io/sdk/openapi";
import { useDexClient } from "./DexClientProvider";
import { QueryKeys } from "./queryKeys";
import { chainParam } from "./utils";
import { UseTokenCandlesQueryParams } from "./types";

export async function fetchTokenCandles(
  client: DexClient,
  { chain, from, ...others }: UseTokenCandlesQueryParams,
) {
  return await client.token.getCandles({ ...others, chain: chainParam(chain), from });
}

export function useTokenCandlesQuery(
  param: UseTokenCandlesQueryParams,
  options: Omit<UseQueryOptions<Candle[], Error, Candle[], string[]>, "queryKey" | "queryFn"> = {},
) {
  const client = useDexClient();
  return useQuery({
    queryKey: QueryKeys.tokenCandles(param),
    queryFn: async () => fetchTokenCandles(client, param),
    ...options,
  });
}
