import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { DexClient } from "@chainstream-io/sdk";
import { RedPacketClaimsPage } from "@chainstream-io/sdk/openapi";
import { useDexClient } from "@liberfi/react-dex";
import { FetchWalletClaimsParams } from "./types";
import { QueryKeys } from "./queryKeys";

export async function fetchWalletClaims(client: DexClient, params: FetchWalletClaimsParams) {
  return await client.redPacket.getClaimsByAddress({
    address: params.address,
    cursor: params.cursor,
    limit: params.limit,
    direction: params.direction,
  });
}

export function useWalletClaimsQuery(
  params: FetchWalletClaimsParams,
  options: Omit<
    UseQueryOptions<RedPacketClaimsPage, Error, RedPacketClaimsPage, string[]>,
    "queryKey" | "queryFn"
  > = {},
) {
  const client = useDexClient();
  return useQuery({
    queryKey: QueryKeys.walletClaims(params),
    queryFn: () => fetchWalletClaims(client, params),
    ...options,
  });
}
