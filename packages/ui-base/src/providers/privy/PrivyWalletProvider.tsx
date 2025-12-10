"use client";

import { PropsWithChildren, useCallback, useMemo, useRef } from "react";
import { useSolanaWallets, useConnectWallet, ConnectedSolanaWallet } from "@privy-io/react-auth";
import { VersionedTransaction } from "@solana/web3.js";
import { CHAIN_ID, IWallet } from "@liberfi/core";
import { useAuth } from "@/hooks";
import { WalletProvider } from "../WalletProvider";

export function PrivyWalletProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();

  // all connected solana wallets, including external & embedded wallets
  const { wallets: solanaWallets } = useSolanaWallets();

  // embedded wallet is always connected when authenticated, but external wallet is not
  const solanaWallet = useMemo(
    () => solanaWallets.find((it) => it.address === user?.solanaAddress),
    [solanaWallets, user],
  );

  const signTxMessage = useRef<Uint8Array | null>(null);
  const signTxUserAddress = useRef<string | null>(null);
  const signTxResolve = useRef<((signature: Uint8Array) => void) | null>(null);
  const signTxReject = useRef<((error: unknown) => void) | null>(null);

  // connect a external wallet to sign transaction
  const { connectWallet } = useConnectWallet({
    onSuccess: ({ wallet }) => {
      try {
        if (wallet.address === signTxUserAddress.current && signTxMessage.current) {
          if (wallet.type === "solana") {
            const versionedTx = VersionedTransaction.deserialize(signTxMessage.current);
            const solanaWallet = wallet as ConnectedSolanaWallet;
            solanaWallet.signTransaction(versionedTx).then((signedVersionedTx) => {
              const signedTx = signedVersionedTx.serialize();
              signTxResolve.current?.(signedTx);
              // reset
              signTxMessage.current = null;
              signTxUserAddress.current = null;
              signTxResolve.current = null;
              signTxReject.current = null;
            });
          } else {
            throw new Error("Unsupported wallet type");
          }
        }
      } catch (error) {
        console.error("PrivyWalletProvider: sign transaction error", error);
        signTxReject.current?.(error);
        // reset
        signTxMessage.current = null;
        signTxUserAddress.current = null;
        signTxResolve.current = null;
        signTxReject.current = null;
      }
    },
    onError: (error) => {
      console.error("PrivyWalletProvider: connect wallet error", error);
      signTxReject.current?.(error);
      // reset
      signTxMessage.current = null;
      signTxUserAddress.current = null;
      signTxResolve.current = null;
      signTxReject.current = null;
    },
  });

  const signTransaction = useCallback(
    async (message: Uint8Array) => {
      const userAddress = user?.solanaAddress;

      // unauthenticated
      if (!userAddress) throw new Error("Unauthenticated");

      if (solanaWallet) {
        // solana wallet is connected
        const versionedTx = VersionedTransaction.deserialize(message);
        const signedVersionedTx = await solanaWallet.signTransaction(versionedTx);
        const signedTx = signedVersionedTx.serialize();
        return signedTx;
      } else {
        // solana wallet is not connected
        signTxMessage.current = message;
        signTxUserAddress.current = userAddress;
        return new Promise<Uint8Array>((resolve, reject) => {
          signTxResolve.current = resolve;
          signTxReject.current = reject;
          connectWallet({ suggestedAddress: userAddress });
        });
      }
    },
    [user, solanaWallet, connectWallet],
  );

  const wallet = useMemo<IWallet>(
    () => ({
      chain: CHAIN_ID.SOLANA,
      address: user?.solanaAddress ?? "",
      signTransaction,
    }),
    [user, signTransaction],
  );

  return <WalletProvider wallet={wallet}>{children}</WalletProvider>;
}
