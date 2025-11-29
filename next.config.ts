/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: false,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com", pathname: "/v0/b/**" },
      { protocol: "https", hostname: "drive.google.com", pathname: "/uc" },
      { protocol: "https", hostname: "drive.google.com", pathname: "/file/d/**" },
    ],
  },
};

module.exports = nextConfig;
