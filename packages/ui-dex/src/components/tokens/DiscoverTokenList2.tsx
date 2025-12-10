import { useTokenListContext } from "./TokenListContext";
import { DiscoverTrendingTokenList2 } from "./DiscoverTrendingTokenList2";
import { DiscoverNewTokenList2 } from "./DiscoverNewTokenList2";

export function DiscoverTokenList2({ height }: { height?: number }) {
  const { subType } = useTokenListContext();
  return (
    <>
      {subType === "trending" && <DiscoverTrendingTokenList2 height={height} />}
      {subType === "new" && <DiscoverNewTokenList2 height={height} />}
    </>
  );
}
