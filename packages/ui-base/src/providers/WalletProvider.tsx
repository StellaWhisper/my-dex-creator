import { createContext, PropsWithChildren } from "react";
import { IWallet } from "@liberfi/core";

/**
 * Register the wallet strategy
 */
export const WalletContext = createContext<IWallet>({} as IWallet);

export function WalletProvider({ wallet, children }: PropsWithChildren<{ wallet: IWallet }>) {
  return <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>;
}
