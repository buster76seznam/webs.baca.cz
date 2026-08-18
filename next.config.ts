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

  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
    ],
  },
};

export default nextConfig;
