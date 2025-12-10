import { useTokenListContext } from "./TokenListContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useAddTokenToCollectionMutation,
  useRemoveTokenFromCollectionMutation,
  useTokenAddressesInCollectionQuery,
} from "@liberfi/react-backend";
import { ListError } from "../ListError";
import { DiscoverTokenListSkeleton } from "./DiscoverTokenListSkeleton";
import { ListEmptyData } from "../ListEmptyData";
import { tokenFilters, tokenSort } from "@/libs";
import { DiscoverTokenListItem } from "./DiscoverTokenListItem";
import { Virtuoso } from "react-virtuoso";
import { useAtomValue } from "jotai";
import { chainAtom, useAuth } from "@liberfi/ui-base";
import {
  chainParam,
  convertStreamTokenHoldersToMarketData,
  convertStreamTokenLiquidityToMarketData,
  convertStreamTokenStatToMarketData,
  convertStreamTokenSupplyToMarketData,
  useDexClient,
  useNewTokensQuery,
} from "@liberfi/react-dex";
import { Token } from "@chainstream-io/sdk/openapi";
import {
  ChannelType,
  NewToken,
  TokenHolder,
  TokenLiquidity,
  TokenMetadata,
  TokenStat,
  TokenSupply,
} from "@chainstream-io/sdk/stream";
import { CHAIN_ID, chainSlugs } from "@liberfi/core";
import { reverse, sortBy } from "lodash-es";

export function DiscoverNewTokenList() {
  const { status } = useAuth();

  const { timeframe, filters, sort } = useTokenListContext();

  const chain = useAtomValue(chainAtom);

  const [tokens, setTokens] = useState<Token[]>([]);

  const params = useMemo(() => {
    const sortRequest = sort ? tokenSort(sort, timeframe) : undefined;
    const filterRequest = filters ? tokenFilters(filters, timeframe) : undefined;
    return {
      chain,
      duration: timeframe,
      sortBy: sortRequest?.sortBy,
      sortDirection: sortRequest?.sortDirection,
      filterBy: filterRequest?.filterBy,
    };
  }, [timeframe, filters, sort, chain]);

  // initial fetch & refetch on sort or filter change
  const { data: fetchedTokens, isPending, error } = useNewTokensQuery(params);

  // reset to newest tokens when fetched
  useEffect(() => {
    if (fetchedTokens) {
      setTokens(fetchedTokens.filter((it) => !!it.address));
    }
  }, [fetchedTokens]);

  // subscriptions
  const dexClient = useDexClient();

  const handleNewTokens = useCallback(
    (newToken: NewToken) => {
      setTokens((prev) => {
        const tokens = [newToken].map(
          (it) =>
            ({
              chain: chainSlugs[chain] ?? chainSlugs[CHAIN_ID.SOLANA],
              address: it.tokenAddress,
              name: it.name,
              symbol: it.symbol,
              tokenCreatedAt: it.createdAtMs,
              stats: {},
              marketData: {},
            } as Token),
        );
        // sort by create time desc
        return reverse(sortBy([...tokens, ...prev], "tokenCreatedAt")).slice(0, 100);
      });
    },
    [chain],
  );

  const handleNewTokensMetadata = useCallback((newTokensMetadata: TokenMetadata[]) => {
    setTokens((prev) => {
      newTokensMetadata.forEach((it) => {
        const token = prev.find((t) => t.address === it.tokenAddress);
        if (token) {
          token.imageUrl = it.imageUrl;
          token.socialMedias = {
            ...token.socialMedias,
            ...it.socialMedia,
          };
          token.tokenCreatedAt = it.createdAtMs;
        }
      });
      return [...prev];
    });
  }, []);

  const handleTokenStats = useCallback((stats: TokenStat[]) => {
    setTokens((prev) => {
      stats.forEach((stat) => {
        const token = prev.find((t) => t.address === stat.address);
        if (token) {
          // token.stats = { ...token.stats, ...convertStreamTokenStat(stat) };
          token.marketData = {
            ...token.marketData,
            ...convertStreamTokenStatToMarketData(stat, token.marketData?.totalSupply),
          };
        }
      });
      return [...prev];
    });
  }, []);

  const handleTokenHoldings = useCallback((holders: TokenHolder[]) => {
    setTokens((prev) => {
      holders.forEach((holder) => {
        const token = prev.find((t) => t.address === holder.tokenAddress);
        if (token) {
          token.marketData = {
            ...token.marketData,
            ...convertStreamTokenHoldersToMarketData(holder),
          };
        }
      });
      return [...prev];
    });
  }, []);

  const handleTokenSupply = useCallback((supplies: TokenSupply[]) => {
    setTokens((prev) => {
      supplies.forEach((supply) => {
        const token = prev.find((t) => t.address === supply.tokenAddress);
        if (token) {
          token.marketData = {
            ...token.marketData,
            ...convertStreamTokenSupplyToMarketData(supply, token.marketData?.priceInUsd),
          };
        }
      });
      return [...prev];
    });
  }, []);

  const handleTokenLiquidity = useCallback((liquidities: TokenLiquidity[]) => {
    setTokens((prev) => {
      liquidities.forEach((liquidity) => {
        const token = prev.find((t) => t.address === liquidity.tokenAddress);
        if (token) {
          token.marketData = {
            ...token.marketData,
            ...convertStreamTokenLiquidityToMarketData(liquidity),
          };
        }
      });
      return [...prev];
    });
  }, []);

  useEffect(() => {
    // subscribe new tokens
    const subscribeNewTokens = dexClient.stream.subscribeNewToken({
      chain: chainParam(chain),
      callback: handleNewTokens,
    });

    // subscribe new token metadata
    const subscribeNewTokensMetadata = dexClient.stream.subscribeNewTokensMetadata({
      chain: chainParam(chain),
      callback: handleNewTokensMetadata,
    });

    // subscribe token stats
    const subscribeTokenStats = dexClient.stream.subscribeRankingTokensStats({
      chain: chainParam(chain),
      channelType: ChannelType.New,
      callback: handleTokenStats,
    });

    // subscribe token holdings
    const subscribeTokenHoldings = dexClient.stream.subscribeRankingTokensHolders({
      chain: chainParam(chain),
      channelType: ChannelType.New,
      callback: handleTokenHoldings,
    });

    // subscribe token supply
    const subscribeTokenSupply = dexClient.stream.subscribeRankingTokensSupply({
      chain: chainParam(chain),
      channelType: ChannelType.New,
      callback: handleTokenSupply,
    });

    // subscribe token liquidity
    const subscribeTokenLiquidity = dexClient.stream.subscribeRankingTokensLiquidity({
      chain: chainParam(chain),
      channelType: ChannelType.New,
      callback: handleTokenLiquidity,
    });

    return () => {
      subscribeNewTokens.unsubscribe();
      subscribeNewTokensMetadata.unsubscribe();
      subscribeTokenStats.unsubscribe();
      subscribeTokenHoldings.unsubscribe();
      subscribeTokenSupply.unsubscribe();
      subscribeTokenLiquidity.unsubscribe();
    };
  }, [
    dexClient,
    chain,
    handleNewTokens,
    handleNewTokensMetadata,
    handleTokenStats,
    handleTokenHoldings,
    handleTokenSupply,
    handleTokenLiquidity,
  ]);

  const { data: viewTokenAddressees } = useTokenAddressesInCollectionQuery("views", {
    enabled: status === "authenticated",
  });

  const { mutateAsync: addViewToken } = useAddTokenToCollectionMutation();

  const { mutateAsync: removeViewToken } = useRemoveTokenFromCollectionMutation();

  const [viewList, setViewList] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (viewTokenAddressees) {
      setViewList(viewTokenAddressees.reduce((acc, it) => ({ ...acc, [it]: true }), {}));
    }
  }, [viewTokenAddressees]);

  const handleAddViewToken = useCallback(
    async (address: string) => {
      setViewList((prev) => ({ ...prev, [address]: true }));
      await addViewToken({
        tokenAddress: address,
        type: "views",
      });
    },
    [addViewToken, setViewList],
  );

  const handleRemoveViewToken = useCallback(
    async (address: string) => {
      setViewList((prev) => ({ ...prev, [address]: false }));
      await removeViewToken({
        tokenAddress: address,
        type: "views",
      });
    },
    [removeViewToken, setViewList],
  );

  if (error) {
    return <ListError />;
  }

  if (isPending) {
    return <DiscoverTokenListSkeleton />;
  }

  if (!tokens || tokens.length === 0) {
    return <ListEmptyData />;
  }

  return (
    <Virtuoso
      fixedItemHeight={56}
      data={tokens}
      itemContent={(_, token) => (
        <DiscoverTokenListItem
          token={token}
          isViewed={viewList[token.address]}
          onView={handleAddViewToken}
          onUnview={handleRemoveViewToken}
        />
      )}
      useWindowScroll
    />
  );
}
