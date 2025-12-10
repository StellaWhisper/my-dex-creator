import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { DexClient } from "@chainstream-io/sdk";
import { RedPacketClaimsPage } from "@chainstream-io/sdk/openapi";
import { useDexClient } from "@liberfi/react-dex";
import { FetchRedPacketClaimsParams } from "./types";
import { QueryKeys } from "./queryKeys";

export async function fetchRedPacketClaims(client: DexClient, params: FetchRedPacketClaimsParams) {
  return await client.redPacket.getClaims({
    id: params.redPacketId,
    cursor: params.cursor,
    limit: params.limit,
    direction: params.direction,
  });
}

export function useRedPacketClaimsQuery(
  params: FetchRedPacketClaimsParams,
  options: Omit<
    UseQueryOptions<RedPacketClaimsPage, Error, RedPacketClaimsPage, string[]>,
    "queryKey" | "queryFn"
  > = {},
) {
  const client = useDexClient();
  return useQuery({
    queryKey: QueryKeys.redPacketClaims(params),
    queryFn: () => fetchRedPacketClaims(client, params),
    ...options,
  });
}
