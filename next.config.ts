import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://pub-89c71be2d1fb4e5988b265a5dcd75b02.r2.dev/**')],
  },
};

export default nextConfig;
