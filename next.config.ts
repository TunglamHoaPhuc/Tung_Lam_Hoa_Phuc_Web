import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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