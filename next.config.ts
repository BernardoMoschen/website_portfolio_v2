import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bernardomoschen.dev',
      },
    ],
  },
};

export default nextConfig;
