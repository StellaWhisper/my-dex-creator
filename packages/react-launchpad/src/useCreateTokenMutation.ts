import { DexClient } from "@chainstream-io/sdk";
import { CreateTokenReply } from "@chainstream-io/sdk/openapi";
import { chainParam, useDexClient } from "@liberfi/react-dex";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { CreateTokenParams } from "./types";

export async function createToken(client: DexClient, { chain, ...input }: CreateTokenParams) {
  return await client.dex.createToken({
    chain: chainParam(chain),
    createTokenInput: input,
  });
}

export function useCreateTokenMutation(
  options: Omit<
    UseMutationOptions<CreateTokenReply, Error, CreateTokenParams, string[]>,
    "mutationFn"
  > = {},
) {
  const client = useDexClient();
  return useMutation({
    mutationFn: async (params: CreateTokenParams) => createToken(client, params),
    ...options,
  });
}
