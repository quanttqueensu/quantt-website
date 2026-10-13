import type { NextConfig } from "next";

// Built as a static site (out/) and served by the Cloudflare Worker in wrangler.jsonc. Static export has no
// image optimiser, so images are served as they are.
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // /hiring became /portfolios when recruiting closed. Temporary, so /hiring can
  // come back as its own page next recruiting cycle.
  async redirects() {
    return [{ source: "/hiring", destination: "/portfolios", permanent: false }];
  },
};

export default nextConfig;
