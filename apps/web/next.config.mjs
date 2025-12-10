/* eslint-disable no-undef */
const nextConfig = {
  // TODO tv chart need to disable reactStrictMode
  reactStrictMode: false,
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/graphql",
        destination: process.env.GRAPHQL_SERVER_ENDPOINT,
      },
      {
        source: "/dex-api/:path*",
        destination: process.env.DEX_AGGREGATOR_URL + "/:path*",
      },
      {
        source: "/media-track-api/:path*",
        destination: process.env.MEDIA_TRACK_URL + "/:path*",
      },
    ];
  },
  webpack(config) {
    config.optimization.minimize = process.env.NODE_ENV === "production";
    config.module.rules.push({
      test: /\.svg$/i,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: "prefixIds",
                  active: false,
                },
              ],
            },
          },
        },
        "url-loader",
      ],
    });
    return config;
  },
};

export default nextConfig;
