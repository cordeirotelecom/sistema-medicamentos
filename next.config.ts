import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: '/sistema-medicamentos',
  assetPrefix: '/sistema-medicamentos/'
};

export default nextConfig;
