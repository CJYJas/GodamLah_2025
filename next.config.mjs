import withPWA from "@ducanh2912/next-pwa";

// 1. Define the PWA options first
const pwaOptions = {
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // IMPORTANT: Add runtime caching for robust offline capability
  runtimeCaching: [
    {
      urlPattern: /^https?:\/\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'start-url-cache',
        expiration: {
          maxEntries: 10,
        },
      },
    },
  ],
  // Also crucial to ensure necessary files aren't skipped
  buildExcludes: [
      /middleware-manifest\.json$/,
      /ssg-manifest\.json$/,
      /build-manifest\.json$/,
      /_ssgManifest\.js$/,
  ],
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

// 2. Apply the PWA wrapper to the core config, passing PWA options directly.
// The modern package uses this direct wrapper approach.
export default withPWA(pwaOptions)(nextConfig);