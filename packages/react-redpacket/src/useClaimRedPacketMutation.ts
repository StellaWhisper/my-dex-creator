import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { DexClient } from "@chainstream-io/sdk";
import { RedPacketReply } from "@chainstream-io/sdk/openapi";
import { chainParam, useDexClient } from "@liberfi/react-dex";
import { ClaimRedPacketParams } from "./types";

export async function claimRedPacket(client: DexClient, params: ClaimRedPacketParams) {
  return await client.redPacket.claimRedpacket({
    chain: chainParam(params.chain),
    claimRedPacketInput: {
      chain: chainParam(params.chain),
      shareId: params.shareId,
      password: params.password,
      claimer: params.claimer,
    },
  });
}

export function useClaimRedPacketMutation(
  options: Omit<UseMutationOptions<RedPacketReply, Error, ClaimRedPacketParams>, "mutationFn"> = {},
) {
  const client = useDexClient();
  return useMutation({
    mutationFn: async (param: ClaimRedPacketParams) => claimRedPacket(client, param),
    ...options,
  });
}
