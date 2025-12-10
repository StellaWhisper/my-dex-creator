import type { Meta, StoryObj } from "@storybook/react";
import { TokenListPage } from "../src";

const meta = {
  component: TokenListPage,
} satisfies Meta<typeof TokenListPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {},
} satisfies Story;
