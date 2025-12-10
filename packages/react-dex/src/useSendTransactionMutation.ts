import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { DexClient } from "@chainstream-io/sdk";
import { SendTxResponse } from "@chainstream-io/sdk/openapi";
import { useDexClient } from "./DexClientProvider";
import { UseSendTransactionMutationParams } from "./types";
import { chainParam } from "./utils";

export async function sendTransaction(client: DexClient, param: UseSendTransactionMutationParams) {
  return await client.transaction.send({ ...param, chain: chainParam(param.chain) });
}

export function useSendTransactionMutation(
  options: Omit<
    UseMutationOptions<SendTxResponse, Error, UseSendTransactionMutationParams>,
    "mutationFn"
  > = {},
) {
  const client = useDexClient();
  return useMutation({
    mutationFn: async (param: UseSendTransactionMutationParams) => sendTransaction(client, param),
    ...options,
  });
}
