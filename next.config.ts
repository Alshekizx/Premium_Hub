import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  images: {
    remotePatterns: [
      // Unsplash
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Firebase Storage
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**", // keep this for Firebase
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/uc", // Google Drive direct link path
      },
       {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/file/d/**',
      },
    ],
  },
};

export default nextConfig;
