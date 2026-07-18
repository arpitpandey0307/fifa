import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: [],
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
