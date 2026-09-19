import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "upload.wikimedia.org",
        protocol: "https",
      },
      {
        hostname: "tong.visitkorea.or.kr",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
