import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { walletBalancesAtom } from "@/states";

export function useWalletTokenBalance(tokenAddress: string) {
  const walletBalances = useAtomValue(walletBalancesAtom);
  const tokenBalance = useMemo(
    () => walletBalances?.balances?.find((b) => b.tokenAddress === tokenAddress),
    [walletBalances, tokenAddress],
  );
  return tokenBalance;
}
