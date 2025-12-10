"use client";

import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { usePrivy, useIdentityToken, useUser, WalletWithMetadata } from "@privy-io/react-auth";
import { AuthenticatedUser, IAuthentication } from "@liberfi/core";
import { authenticatePrivy, useGraphQLClient } from "@liberfi/react-backend";
import { AuthProvider } from "../AuthProvider";

/**
 * Privy auth strategy
 *
 * TODO renew backend access token
 */
export const PrivyAuthProvider = ({ children }: PropsWithChildren) => {
  const graphqlClient = useGraphQLClient();

  // privy auth status
  const { ready, authenticated, getAccessToken, login, logout } = usePrivy();

  // privy user info
  const { user: privyUser, refreshUser } = useUser();

  // privy id token
  const { identityToken } = useIdentityToken();

  // privy access token
  const [privyAccessToken, setPrivyAccessToken] = useState<string | null>(null);

  // backend access token
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // exchange privy access token on sign-in
  useEffect(() => {
    if (ready && authenticated) {
      getAccessToken().then((accessToken) => {
        setPrivyAccessToken(accessToken);
      });
    }
  }, [ready, authenticated, getAccessToken]);

  // exchange privy access token to backend access token
  useEffect(() => {
    if (privyAccessToken && identityToken) {
      authenticatePrivy(graphqlClient, { accessToken: privyAccessToken, identityToken })
        .then((res) => {
          if (res.success && res.token) {
            setAccessToken(res.token);
            // must set Authorization header. cookies may be invalidated due to CORS.
            graphqlClient.setHeader("Authorization", `Bearer ${res.token}`);
          } else {
            console.error(
              "PrivyAuthProvider: exchange privy access token to backend access token failed",
              res,
            );
          }
        })
        .catch((err) => {
          console.error(
            "PrivyAuthProvider: exchange privy access token to backend access token failed",
            err,
          );
        });
    }
  }, [privyAccessToken, identityToken, graphqlClient]);

  // calculate auth status
  const status = useMemo(() => {
    if (!ready) {
      // privy is authenticating
      return "authenticating";
    } else if (!authenticated) {
      // privy is unauthenticated
      return "unauthenticated";
    } else if (!accessToken) {
      // backend is authenticating
      return "authenticating";
    } else {
      return "authenticated";
    }
  }, [ready, authenticated, accessToken]);

  // calculate user info
  const user = useMemo<AuthenticatedUser | null>(() => {
    if (!privyUser) return null;

    const solanaAccount = privyUser.linkedAccounts.find(
      (it) => it.type === "wallet" && it.chainType === "solana",
    );
    const solanaAddress = solanaAccount ? (solanaAccount as WalletWithMetadata).address : undefined;

    const ethereumAccount = privyUser.linkedAccounts.find(
      (it) => it.type === "wallet" && it.chainType === "ethereum",
    );
    const ethereumAddress = ethereumAccount
      ? (ethereumAccount as WalletWithMetadata).address
      : undefined;

    return {
      ...privyUser,
      ethereumAddress,
      solanaAddress,
    };
  }, [privyUser]);

  // auth strategy
  const authentication = useMemo<IAuthentication>(
    () => ({
      status,
      user: status === "authenticated" ? user : null,
      signIn: () => login(),
      signOut: () => logout(),
      refreshAccessToken: () => refreshUser().then(() => {}),
    }),
    [status, user, login, logout, refreshUser],
  );

  return <AuthProvider authentication={authentication}>{children}</AuthProvider>;
};
