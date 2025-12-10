/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CHAIN_ID } from "@liberfi/core";
import { TradeDataLoader } from "../src/components/trade";
import { TradeDataProvider } from "../src/components/trade/providers";
import { TradePage } from "../src/pages/TradePage";

const meta = {
  component: TradePage,
  decorators: [
    (Story) => (
      <TradeDataLoader chainId={CHAIN_ID.SOLANA} address={process.env.TRADE_TOKEN_ADDRESS}>
        <TradeDataProvider chain={CHAIN_ID.SOLANA} address={process.env.TRADE_TOKEN_ADDRESS}>
          <Story />
        </TradeDataProvider>
      </TradeDataLoader>
    ),
  ],
} satisfies Meta<typeof TradePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {},
} satisfies Story;
