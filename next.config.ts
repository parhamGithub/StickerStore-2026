import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/api/:path*",
      },
      {
        source: "/avatars/:path*",
        destination: "http://localhost:4000/avatars/:path*",
      },
    ];
  },
};

export default nextConfig;
