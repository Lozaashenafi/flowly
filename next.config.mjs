/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // REMOVE assetPrefix: "./"
  // It conflicts with trailingSlash and breaks CSS on sub-pages
};

export default nextConfig;
