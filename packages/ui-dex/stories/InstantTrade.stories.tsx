/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CHAIN_ID } from "@liberfi/core";
import { InstantTrade, TradeDataLoader } from "../src";
import { TradeDataProvider } from "../src/components/trade/providers";

const meta = {
  component: InstantTrade,
  decorators: [
    (Story) => (
      <TradeDataLoader
        chainId={CHAIN_ID.SOLANA}
        address={process.env.TRADE_TOKEN_ADDRESS}
        // synchronize the price to rxjs because the trading view is absent
        synchronizeTokenPrice
      >
        <TradeDataProvider chain={CHAIN_ID.SOLANA} address={process.env.TRADE_TOKEN_ADDRESS}>
          <div className="w-[300px] mx-auto py-4">
            <Story />
          </div>
        </TradeDataProvider>
      </TradeDataLoader>
    ),
  ],
} satisfies Meta<typeof InstantTrade>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {},
} satisfies Story;
