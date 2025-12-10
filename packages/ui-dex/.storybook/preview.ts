import type { Preview, Decorator } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import { withAppLayout } from "./withAppLayout";
import "./globals.css";

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;

export const decorators: Decorator[] = [
  withAppLayout,
  withThemeByClassName({
    themes: {
      light: "light",
      dark: "dark",
    },
    defaultTheme: "dark",
  }),
];
