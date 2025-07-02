import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  // Copy .well-known directory to output
  async rewrites() {
    return [];
  },
};

export default nextConfig;
