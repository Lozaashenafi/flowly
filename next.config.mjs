/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    buildActivity: false,
  },
};
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  reactStrictMode: true,
});

export default nextConfig;
