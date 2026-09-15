import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export target for Firebase Hosting — this site has no per-request dynamic
  // data or server actions, so a live Next.js server (Cloud Run/Functions) isn't needed.
  // Trade-off accepted: no next/image optimization API (images.unoptimized required below).
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
