/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  reactStrictMode: true,
  
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
  
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  
  // Build configuration
  eslint: {
    ignoreDuringBuilds: true, // Temporarily ignore ESLint warnings to allow deployment
  },
}

export default nextConfig