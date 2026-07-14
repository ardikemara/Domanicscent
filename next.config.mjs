/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["postgres"],
  },
  env: {
    // Expose VERCEL_ENV ke client biar analytics bisa bedain production vs
    // preview/dev (guard di lib/analytics.js). Di local dev nilainya kosong.
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV || "",
  },
};

export default nextConfig;
