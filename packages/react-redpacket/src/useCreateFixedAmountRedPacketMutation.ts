import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { DexClient } from "@chainstream-io/sdk";
import { RedPacketReply } from "@chainstream-io/sdk/openapi";
import { chainParam, useDexClient } from "@liberfi/react-dex";
import { CreateFixedAmountRedPacketParams } from "./types";

export async function createFixedAmountRedPacket(
  client: DexClient,
  params: CreateFixedAmountRedPacketParams,
) {
  return await client.redPacket.createRedpacket({
    chain: chainParam(params.chain),
    createRedPacketInput: {
      chain: chainParam(params.chain),
      creator: params.creator,
      mint: params.mint,
      maxClaims: params.maxClaims,
      fixedAmount: params.fixedAmount,
      memo: params.memo,
      password: params.password,
      claimAuthority: params.claimAuthority,
    },
  });
}

export function useCreateFixedAmountRedPacketMutation(
  options: Omit<
    UseMutationOptions<RedPacketReply, Error, CreateFixedAmountRedPacketParams>,
    "mutationFn"
  > = {},
) {
  const client = useDexClient();
  return useMutation({
    mutationFn: async (param: CreateFixedAmountRedPacketParams) =>
      createFixedAmountRedPacket(client, param),
    ...options,
  });
}
