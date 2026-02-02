import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ww9xnlrptrfojlyb.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
