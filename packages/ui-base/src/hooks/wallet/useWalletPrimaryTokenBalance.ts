import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { getPrimaryTokenAddress } from "@liberfi/core";
import { chainAtom, walletBalancesAtom } from "@/states";

export function useWalletPrimaryTokenBalance() {
  const chain = useAtomValue(chainAtom);
  const primaryTokenAddress = getPrimaryTokenAddress(chain);
  const walletBalances = useAtomValue(walletBalancesAtom);

  const primaryTokenBalance = useMemo(
    () => walletBalances?.balances?.find((b) => b.tokenAddress === primaryTokenAddress),
    [walletBalances, primaryTokenAddress],
  );
  return primaryTokenBalance;
}
