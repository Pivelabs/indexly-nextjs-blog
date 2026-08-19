// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,

  images: {
    // ONLY external domains – never your own!
    remotePatterns: [
      { protocol: "https", hostname: "keywordly.ai" },
      { protocol: "https", hostname: "files.wordpress.com" },
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "i1.wp.com" },
      { protocol: "https", hostname: "i2.wp.com" },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 31536000,
  },

  async headers() {
    return [
      {
        source: "/blog/api/ghost-image",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // static assets
      {
        source: "/:path*.(js|css|png|jpg|jpeg|gif|svg|webp|avif)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/admin",
        destination: `${process.env.GHOST_URL}/ghost`,
        permanent: true,
      },
    ];
  },

  compress: true,
  experimental: { scrollRestoration: true },
};

export default nextConfig;