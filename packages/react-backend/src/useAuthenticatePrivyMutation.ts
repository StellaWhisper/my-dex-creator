import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { gql, GraphQLClient } from "graphql-request";
import { AuthenticationResult, PrivyAuthenticateInput } from "./types";
import { useGraphQLClient } from "./GraphQLClientProvider";
import { QueryKeys } from "./queryKeys";

export const AUTHENTICATE_PRIVY_MUTATION = gql`
  mutation AuthenticatePrivy($input: PrivyAuthenticateInput!) {
    authenticatePrivy(input: $input) {
      success
      token
    }
  }
`;

export async function authenticatePrivy(_client: GraphQLClient, input: PrivyAuthenticateInput) {
  const res = await fetch("/api/auth/privy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ accessToken: input.accessToken, identityToken: input.identityToken }),
  });
  const data = await res.json();
  const token = data.accessToken as string;
  return { success: true, token };
}

export const useAuthenticatePrivyMutation = ({
  onSuccess,
  ...options
}: Omit<
  UseMutationOptions<AuthenticationResult, Error, PrivyAuthenticateInput>,
  "mutationFn"
> = {}) => {
  const gqlClient = useGraphQLClient();
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async (input: PrivyAuthenticateInput) => {
      return await authenticatePrivy(gqlClient, input);
    },
    onSuccess(data, variables, result, context) {
      queryClient.invalidateQueries({ queryKey: QueryKeys.currentUser() });
      onSuccess?.(data, variables, result, context);
    },
  });
};
