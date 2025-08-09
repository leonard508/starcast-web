/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Optimized images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'starcast.co.za',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    emotion: true,
  },
  
  // Bundle optimization
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
  },
  
  
  // Headers for performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, max-age=0, must-revalidate'
          },
        ],
      },
    ];
  },
  
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  
  // Build configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
}

export default nextConfig