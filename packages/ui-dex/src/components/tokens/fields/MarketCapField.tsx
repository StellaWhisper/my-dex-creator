import { ListField } from "@/components/ListField";
import { Number } from "@/components/Number";
import { Token } from "@chainstream-io/sdk/openapi";

export interface MarketCapFieldProps {
  className?: string;
  token: Token;
}

export function MarketCapField({ className, token }: MarketCapFieldProps) {
  return (
    <ListField width={146} className={className}>
      <div className="flex gap-1 text-xs">
        <div className="text-foreground">
          {token.marketData.marketCapInUsd ? (
            <Number value={token.marketData.marketCapInUsd} abbreviate defaultCurrencySign="$" />
          ) : (
            "-"
          )}
        </div>
        /
        <div>
          {token.marketData.tvlInUsd ? (
            <Number value={token.marketData.tvlInUsd} abbreviate defaultCurrencySign="$" />
          ) : (
            "-"
          )}
        </div>
      </div>
    </ListField>
  );
}
