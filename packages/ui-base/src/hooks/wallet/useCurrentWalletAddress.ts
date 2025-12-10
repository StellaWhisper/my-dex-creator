import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { CHAIN_ID } from "@liberfi/core";
import { chainAtom } from "@/states";
import { useAuth } from "../useAuth";

/**
 * Get the current active wallet address
 */
export function useCurrentWalletAddress() {
  const chain = useAtomValue(chainAtom);

  const { user } = useAuth();

  const walletAddress = useMemo(() => {
    switch (chain) {
      case CHAIN_ID.SOLANA:
        return user?.solanaAddress ?? null;
      default:
        return null;
    }
  }, [chain, user]);

  return walletAddress;
}
