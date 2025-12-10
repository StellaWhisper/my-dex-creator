/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TradeSettings } from "../src";

const meta = {
  component: TradeSettings,
  decorators: [
    (Story) => (
      <div className="w-full md:w-md lg:w-lg mx-auto bg-content1 rounded-lg py-4 px-6 max-sm:px-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TradeSettings>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {},
} satisfies Story;
