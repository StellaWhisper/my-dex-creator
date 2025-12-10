import webpack from "webpack";
import type { StorybookConfig } from "@storybook/react-webpack5";
import { join, dirname, resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, "package.json")));
}

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  // link to the public folder of the web app
  staticDirs: ["../../../apps/web/public"],
  addons: [
    getAbsolutePath("@storybook/addon-webpack5-compiler-swc"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-interactions"),
    {
      name: getAbsolutePath("@storybook/addon-styling-webpack"),
      options: {
        rules: [
          {
            test: /\.css$/,
            sideEffects: true,
            use: [
              require.resolve("style-loader"),
              {
                loader: require.resolve("css-loader"),
                options: {
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve("postcss-loader"),
                options: {
                  implementation: require.resolve("postcss"),
                },
              },
            ],
          },
        ],
      },
    },
    getAbsolutePath("@storybook/addon-themes"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {},
  },
  webpackFinal: (config) => {
    if (!config.plugins) config.plugins = [];
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
    );

    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};
    config.resolve.alias = {
      ...config.resolve.alias,
      ["@"]: resolve(__dirname, "../src"),
    };
    return config;
  },
  swc: () => ({
    jsc: {
      transform: {
        react: {
          runtime: "automatic",
        },
      },
    },
  }),
};
export default config;
