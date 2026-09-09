import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days GPU decoding cache
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'date-fns', 'dayjs'],
  },
  async headers() {
    return [
      {
        // Cho phép các file tĩnh trong tibetan-study được nhúng qua iframe
        source: '/tibetan-study/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/:path*',
      },
    ];
  },
};

export default nextConfig;