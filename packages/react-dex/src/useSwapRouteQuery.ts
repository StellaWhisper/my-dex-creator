import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { DexClient } from "@chainstream-io/sdk";
import { SwapRouteResponse } from "@chainstream-io/sdk/openapi";
import { useDexClient } from "./DexClientProvider";
import { QueryKeys } from "./queryKeys";
import { chainParam } from "./utils";
import { UseSwapRouteQueryParams } from "./types";

export async function fetchSwapRoute(client: DexClient, param: UseSwapRouteQueryParams) {
  return await client.dex.route({ ...param, chain: chainParam(param.chain) });
}

export function useSwapRouteQuery(
  param: UseSwapRouteQueryParams,
  options: Omit<
    UseQueryOptions<SwapRouteResponse, Error, SwapRouteResponse, string[]>,
    "queryKey" | "queryFn"
  > = {},
) {
  const client = useDexClient();
  return useQuery({
    queryKey: QueryKeys.swapRoute(param),
    queryFn: async () => fetchSwapRoute(client, param),
    ...options,
  });
}
