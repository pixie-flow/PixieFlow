/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, context) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    config.module.rules.push({
      test: /\.wgsl$/,
      type: "asset/source",
    });
    return config;
  },
};

module.exports = nextConfig;