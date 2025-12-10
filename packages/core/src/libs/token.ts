import { CHAIN_ID } from "./chain";

export const SOL_TOKEN_ADDRESS = "11111111111111111111111111111111";
export const SOL_TOKEN_SYMBOL = "SOL";
export const SOL_TOKEN_DECIMALS = 9;
export const SOL_USDC_TOKEN_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
export const SOL_USDT_TOKEN_ADDRESS = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
export const SOL_WRAPPED_TOKEN_ADDRESS = "So11111111111111111111111111111111111111112";

export const getPrimaryTokenSymbol = (chainId: CHAIN_ID) => {
  switch (chainId) {
    case CHAIN_ID.SOLANA:
      return SOL_TOKEN_SYMBOL;
    default:
      return undefined;
  }
};

export const getPrimaryTokenAddress = (chainId: CHAIN_ID) => {
  switch (chainId) {
    case CHAIN_ID.SOLANA:
      return SOL_TOKEN_ADDRESS;
    default:
      return undefined;
  }
};

export const getPrimaryTokenDecimals = (chainId: CHAIN_ID) => {
  switch (chainId) {
    case CHAIN_ID.SOLANA:
      return SOL_TOKEN_DECIMALS;
    default:
      return undefined;
  }
};

export const getPrimaryTokenAvatar = (chainId: CHAIN_ID) => {
  switch (chainId) {
    case CHAIN_ID.SOLANA:
      return "/images/tokens/sol.svg";
    default:
      return undefined;
  }
};

export const SOLANA_PROTOCOLS = [
  "bags",
  "believe",
  "bonk",
  "boop",
  "heaven",
  "jupstudio",
  "launchlab",
  "meteora",
  "moonit",
  "moonshot",
  "orca",
  "pump",
  "raydium",
  "sugar",
  "virtual-curve",
];

export const getTokenProtocol = (chainId: CHAIN_ID, protocolFamily: string) => {
  switch (chainId) {
    case CHAIN_ID.SOLANA:
      return SOLANA_PROTOCOLS.find((p) => new RegExp(p, "i").test(protocolFamily));
    default:
      return undefined;
  }
};

export const getWrappedTokenAddress = (chainId: CHAIN_ID, tokenAddress: string) => {
  switch (chainId) {
    case CHAIN_ID.SOLANA:
      return tokenAddress === SOL_TOKEN_ADDRESS ? SOL_WRAPPED_TOKEN_ADDRESS : undefined;
    default:
      return undefined;
  }
};

export const getUnwrappedTokenAddress = (chainId: CHAIN_ID, tokenAddress: string) => {
  switch (chainId) {
    case CHAIN_ID.SOLANA:
      return tokenAddress === SOL_WRAPPED_TOKEN_ADDRESS ? SOL_TOKEN_ADDRESS : undefined;
    default:
      return undefined;
  }
};
