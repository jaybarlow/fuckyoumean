/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Cloudflare Pages compatibility
  // Uncomment the following if you encounter issues with Cloudflare Pages
  /*
  experimental: {
    runtime: 'experimental-edge',
  },
  */
  
  // Optimize images
  images: {
    domains: ['yrjuwkopkdwkcqvbnzbc.supabase.co'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
}

module.exports = nextConfig 