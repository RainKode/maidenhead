import path from "node:path";

// Plain JavaScript on purpose. Hostinger imports this file from a config it
// generates at build time, and a TypeScript config has to be compiled first.
// Next.js 16.3's native compiler needs glibc 2.30, which Hostinger's build
// servers lack, so Next falls back to its WebAssembly compiler — and that
// path can't load Hostinger's wrapper around a .ts config. JavaScript needs
// no compiling, so it loads either way.
/** @type {import("next").NextConfig} */
const nextConfig = {
  turbopack: {
    root: path.resolve("."),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "www.dishoom.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },
};

export default nextConfig;
