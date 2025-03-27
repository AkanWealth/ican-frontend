import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["i.imgur.com", "example.com"], // Add the external hostname here
  },
};

export default nextConfig;
