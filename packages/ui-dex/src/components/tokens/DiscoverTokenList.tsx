import { useTokenListContext } from "./TokenListContext";
import { DiscoverTokenListHeaders } from "./DiscoverTokenListHeaders";
import { DiscoverTrendingTokenList } from "./DiscoverTrendingTokenList";
import { DiscoverNewTokenList } from "./DiscoverNewTokenList";

export function DiscoverTokenList() {
  const { subType } = useTokenListContext();
  return (
    <>
      <DiscoverTokenListHeaders />
      {subType === "trending" && <DiscoverTrendingTokenList />}
      {subType === "new" && <DiscoverNewTokenList />}
    </>
  );
}
