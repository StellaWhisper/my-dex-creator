import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { DexClient } from "@chainstream-io/sdk";
import { RedPacketSendTxResponse } from "@chainstream-io/sdk/openapi";
import { chainParam, useDexClient } from "@liberfi/react-dex";
import { SendRedPacketTransactionParams } from "./types";

export async function sendRedPacketTransaction(
  client: DexClient,
  { chain, ...sendInputTx }: SendRedPacketTransactionParams,
) {
  return await client.redPacket.redpacketSend({
    chain: chainParam(chain),
    redPacketSendTxInput: sendInputTx,
  });
}

export function useSendRedPacketTransactionMutation(
  options: Omit<
    UseMutationOptions<RedPacketSendTxResponse, Error, SendRedPacketTransactionParams>,
    "mutationFn"
  > = {},
) {
  const client = useDexClient();

  return useMutation({
    mutationFn: (params: SendRedPacketTransactionParams) =>
      sendRedPacketTransaction(client, params),
    ...options,
  });
}
