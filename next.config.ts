import type { NextConfig } from "next";

// Built as a static site (out/) and served by the Cloudflare Worker in wrangler.jsonc. Static export has no
// image optimiser, so images are served as they are.
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
