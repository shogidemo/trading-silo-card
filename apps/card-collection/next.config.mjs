/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@trading-silo/shared"],
  images: { unoptimized: true },
  async redirects() {
    return [{
      source: "/_next/image",
      destination: "/media-retired",
      permanent: false,
    }];
  },
};

export default nextConfig;
