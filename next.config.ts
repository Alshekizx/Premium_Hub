import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 experimental: {
    reactCompiler: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      { 
        protocol: "https", hostname: 
        "firebasestorage.googleapis.com", 
        pathname: "/v0/b/**" },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
