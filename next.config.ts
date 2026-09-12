import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["192.168.1.86", "127.0.0.1", "localhost"],
  // better-sqlite3 is a native module; keep it out of the bundler
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
