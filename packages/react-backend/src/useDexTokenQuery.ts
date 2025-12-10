import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { gql, GraphQLClient } from "graphql-request";
import { QueryKeys } from "./queryKeys";
import { useGraphQLClient } from "./GraphQLClientProvider";

export const DEX_TOKEN_QUERY = gql`
  query DexToken {
    dexToken {
      accessToken
    }
  }
`;

export async function fetchDexToken(_client: GraphQLClient) {
  const res = await fetch("/api/auth/dex", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data.accessToken as string;
}

export const useDexTokenQuery = (
  options: Omit<UseQueryOptions<string, Error, string, string[]>, "queryKey" | "queryFn"> = {},
) => {
  const client = useGraphQLClient();
  return useQuery({
    ...options,
    queryKey: QueryKeys.dexToken(),
    queryFn: async () => {
      return await fetchDexToken(client);
    },
  });
};
