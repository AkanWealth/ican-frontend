import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["i.imgur.com", "example.com", "next-s3-upload.codingvalue.com","ican-media-bucket.s3.eu-north-1.amazonaws.com"], // Add the external hostname here
  },
};

export default nextConfig;