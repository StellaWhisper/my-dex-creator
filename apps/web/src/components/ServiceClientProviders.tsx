"use client";

import { PropsWithChildren, useMemo } from "react";
import Cookies from "js-cookie";
import { QueryClientProvider } from "@tanstack/react-query";
import { DexClient } from "@chainstream-io/sdk";
import { GraphQLClientProvider } from "@liberfi/react-backend";
import { DexClientProvider } from "@liberfi/react-dex";
import { PinataProvider, useDexTokenProvider } from "@liberfi/ui-base";
import { queryClient } from "@/libs/queryClient";
import { graphqlClient } from "@/libs/graphqlClient";
import { pinata } from "@/libs/pinata";
import { APIClientProvider } from "@liberfi.io/hooks";
import { Client } from "@liberfi.io/api-chainstream";
import { MediaTrackClient } from "@liberfi.io/ui-media-track/client";
import { MediaTrackProvider } from "@liberfi.io/ui-media-track";

const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

export function ServiceClientProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <GraphQLClientProvider client={graphqlClient}>
        <DexClientLoader>
          <PinataProvider client={pinata}>{children}</PinataProvider>
        </DexClientLoader>
      </GraphQLClientProvider>
    </QueryClientProvider>
  );
}

function DexClientLoader({ children }: PropsWithChildren) {
  const loader = useMemo(
    () => ({
      async set(token: string, expiresAt: Date) {
        Cookies.set("dex-token", token, {
          expires: expiresAt,
          secure: true,
          sameSite: "strict",
        });
      },
      async get() {
        return Cookies.get("dex-token") ?? null;
      },
    }),
    [],
  );

  const dexTokenProvider = useDexTokenProvider(loader);

  const dexClient = useMemo(
    () =>
      new DexClient(dexTokenProvider, {
        serverUrl: baseUrl + process.env.NEXT_PUBLIC_DEX_AGGREGATOR_URL,
      }),
    [dexTokenProvider],
  );

  const apiClient = useMemo(
    () =>
      new Client(dexTokenProvider, {
        serverUrl: baseUrl + process.env.NEXT_PUBLIC_DEX_AGGREGATOR_URL,
      }),
    [dexTokenProvider],
  );

  const mediaTrackClient = useMemo(
    () =>
      new MediaTrackClient({
        endpoint: baseUrl + process.env.NEXT_PUBLIC_MEDIA_TRACK_URL,
        streamEndpoint: process.env.NEXT_PUBLIC_MEDIA_TRACK_STREAM_URL,
        accessToken: dexTokenProvider,
      }),
    [dexTokenProvider],
  );

  return (
    <DexClientProvider client={dexClient}>
      <APIClientProvider client={apiClient} subscribeClient={apiClient}>
        <MediaTrackProvider client={mediaTrackClient}>{children}</MediaTrackProvider>
      </APIClientProvider>
    </DexClientProvider>
  );
}
