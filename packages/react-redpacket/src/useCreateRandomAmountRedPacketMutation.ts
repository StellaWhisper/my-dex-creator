import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { DexClient } from "@chainstream-io/sdk";
import { RedPacketReply } from "@chainstream-io/sdk/openapi";
import { chainParam, useDexClient } from "@liberfi/react-dex";
import { CreateRandomAmountRedPacketParams } from "./types";

export async function createRandomAmountRedPacket(
  client: DexClient,
  params: CreateRandomAmountRedPacketParams,
) {
  return await client.redPacket.createRedpacket({
    chain: chainParam(params.chain),
    createRedPacketInput: {
      chain: chainParam(params.chain),
      creator: params.creator,
      mint: params.mint,
      maxClaims: params.maxClaims,
      totalAmount: params.totalAmount,
      memo: params.memo,
      password: params.password,
      claimAuthority: params.claimAuthority,
    },
  });
}

export function useCreateRandomAmountRedPacketMutation(
  options: Omit<
    UseMutationOptions<RedPacketReply, Error, CreateRandomAmountRedPacketParams>,
    "mutationFn"
  > = {},
) {
  const client = useDexClient();
  return useMutation({
    mutationFn: async (param: CreateRandomAmountRedPacketParams) =>
      createRandomAmountRedPacket(client, param),
    ...options,
  });
}
