/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.scrydex.com',
        pathname: '/riftbound/**',
      },
      {
        protocol: 'https',
        hostname: 'ddragon.leagueoflegends.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
};

module.exports = nextConfig;
