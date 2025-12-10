import { Token } from "@chainstream-io/sdk/openapi";
import { formatAmountUSD } from "@liberfi/core";
import { useMemo } from "react";

export function TokenLiquidityCell({ token }: { token: Token }) {
  const liquidity = useMemo(
    () => token.marketData?.tvlInUsd,
    [token.marketData?.tvlInUsd],
  );
  return <>{liquidity ? formatAmountUSD(liquidity) : "--"}</>;
}
