import { createContext, PropsWithChildren, useContext } from "react";
import { DexClient } from "@chainstream-io/sdk";

export const DexClientContext = createContext<DexClient>({} as DexClient);

export function DexClientProvider({ client, children }: PropsWithChildren<{ client: DexClient }>) {
  return <DexClientContext.Provider value={client}>{children}</DexClientContext.Provider>;
}

export function useDexClient() {
  const client = useContext(DexClientContext);
  if (!client) {
    throw new Error("useDexClient must be used within a DexClientProvider");
  }
  return client;
}
