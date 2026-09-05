import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow LAN access during development (HP test from 192.168.1.86)
  // Without this, Next.js blocks HMR/RSC chunks as cross-origin and the
  // page renders with no client-side JS (empty state on remote devices).
  allowedDevOrigins: ["192.168.1.86", "127.0.0.1", "localhost"],
};

export default nextConfig;
