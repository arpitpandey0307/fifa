import type { NextConfig } from "next";

/**
 * Next.js configuration for FIFA Nexus AI.
 *
 * - `output: "standalone"` produces a self-contained build for Docker/Cloud Run.
 * - Remote patterns are intentionally empty (all assets are local).
 */
const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: [],
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
