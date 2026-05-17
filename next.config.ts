import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },
  react: {
    strictMode: false,
  },
  experimental: {
    optimizePackageImports: [
      {
        name: 'framer-motion',
        package: 'framer-motion',
      },
      {
        name: 'lucide-react',
        package: 'lucide-react',
      },
    ],
  },
};

export default nextConfig;
