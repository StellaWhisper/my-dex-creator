import type { Meta, StoryObj } from "@storybook/react";
import { PulsePage } from "../src";

const meta = {
  component: PulsePage,
} satisfies Meta<typeof PulsePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {},
} satisfies Story;
