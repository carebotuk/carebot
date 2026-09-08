import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [{ source: "/products/flashbot-new", destination: "/products/flashbot-max", permanent: true }];
  },
};

export default nextConfig;
