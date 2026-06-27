import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.thesportsdb.com" },
      { protocol: "https", hostname: "r2.thesportsdb.com" },
      { protocol: "https", hostname: "**.thesportsdb.com" },
      { protocol: "https", hostname: "sportsrc.org" },
      { protocol: "https", hostname: "**.sportsrc.org" },
    ],
  },
};

export default nextConfig;
