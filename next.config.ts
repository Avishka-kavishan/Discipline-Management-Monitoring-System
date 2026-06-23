import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",          // Generates a static `out/` folder
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "", // Set by CI for GitHub Pages sub-path
  images: {
    unoptimized: true,       // Required — Next.js image optimisation is not available in static export
  },
};

export default nextConfig;
