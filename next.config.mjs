/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing setting
  devIndicators: {
    buildActivity: false,
  },

  // REQUIRED FOR MOBILE:
  output: "export", // This tells Next.js to build a static 'out' folder
  images: {
    unoptimized: true, // Mobile apps don't have a server to resize images
  },
  trailingSlash: true, // Prevents 404 errors on page refreshes in the app
  assetPrefix: process.env.NODE_ENV === "production" ? "./" : "",
};

export default nextConfig;
