import {
  RouteRequest,
  GetFinalStretchTokensRequest,
  GetHotTokensRequest,
  GetMigratedTokensRequest,
  GetNewTokensRequest,
  GetStocksTokensRequest,
  GetCandlesRequest,
  GetHoldersRequest,
  GetTokensRequest,
  SearchRequest,
  GetTradesRequest,
  SendRequest,
} from "@chainstream-io/sdk/openapi";
import { CHAIN_ID } from "@liberfi/core";

export type ChainParam =
  | "sol"
  | "base"
  | "bsc"
  | "polygon"
  | "arbitrum"
  | "optimism"
  | "avalanche"
  | "eth"
  | "zksync"
  | "sui";


export type Timeframe = "1m" | "5m" | "15m" | "30m" | "1h" | "4h" | "24h";

export type UseHotTokensQueryParams = Omit<GetHotTokensRequest, "chain"> & {
  chain: CHAIN_ID;
};

export type UseNewTokensQueryParams = Omit<GetNewTokensRequest, "chain"> & {
  chain: CHAIN_ID;
};

export type UseFinalStretchTokensQueryParams = Omit<GetFinalStretchTokensRequest, "chain"> & {
  chain: CHAIN_ID;
};

export type UseMigratedTokensQueryParams = Omit<GetMigratedTokensRequest, "chain"> & {
  chain: CHAIN_ID;
};

export type UseSearchTokensQueryParams = Omit<SearchRequest, "chains"> & {
  chains?: CHAIN_ID[];
};

export type UseSendTransactionMutationParams = Omit<SendRequest, "chain"> & {
  chain: CHAIN_ID;
};

export type UseStockTokensQueryParams = Omit<GetStocksTokensRequest, "chain"> & {
  chain: CHAIN_ID;
};

export type UseSwapRouteQueryParams = Omit<RouteRequest, "chain"> & {
  chain: CHAIN_ID;
};

export type UseTokenCandlesQueryParams = Omit<GetCandlesRequest, "chain" | "_from"> & {
  chain: CHAIN_ID;
  from?: number;
};

export type UseTokenHoldersQueryParams = Omit<GetHoldersRequest, "chain"> & {
  chain: CHAIN_ID;
};

export type UseTokensQueryParams = Omit<GetTokensRequest, "chain" | "tokenAddresses"> & {
  chain: CHAIN_ID;
  tokenAddresses: string[];
};

export type UseTokenTradesQueryParams = Omit<
  GetTradesRequest,
  "chain" | "walletAddress" | "tokenAddress"
> & {
  chain: CHAIN_ID;
  tokenAddress: string;
};

export type UseWalletTradesQueryParams = Omit<
  GetTradesRequest,
  "chain" | "walletAddress" | "tokenAddress"
> & {
  chain: CHAIN_ID;
  walletAddress: string;
};

export class InvalidParamError extends Error {
  constructor(param: string) {
    super(`Invalid param "${param}"`);
    this.name = "InvalidParamError";
  }
}
