import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'www.pohang.go.kr',
        pathname: '/phtour/**',
        protocol: 'https',
      },
    ],
  },
};

export default nextConfig;
