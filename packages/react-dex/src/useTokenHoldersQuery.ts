import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { DexClient } from "@chainstream-io/sdk";
import { TokenHolderPage } from "@chainstream-io/sdk/openapi";
import { useDexClient } from "./DexClientProvider";
import { QueryKeys } from "./queryKeys";
import { chainParam } from "./utils";
import { UseTokenHoldersQueryParams } from "./types";

export async function fetchTokenHolders(client: DexClient, param: UseTokenHoldersQueryParams) {
  return await client.token.getHolders({
    limit: 100,
    ...param,
    chain: chainParam(param.chain),
  });
}

export function useTokenHoldersQuery(
  param: UseTokenHoldersQueryParams,
  options: Omit<
    UseQueryOptions<TokenHolderPage, Error, TokenHolderPage, string[]>,
    "queryKey" | "queryFn"
  > = {},
) {
  const client = useDexClient();
  return useQuery({
    queryKey: QueryKeys.tokenHolders(param),
    queryFn: async () => fetchTokenHolders(client, param),
    ...options,
  });
}
