import type { NextConfig } from "next";
import withPWA from "next-pwa";

const config: NextConfig = {};

const nextConfig = withPWA({
  ...config,
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

export default nextConfig;
