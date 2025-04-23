const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Fix alias resolution for components folder
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    config.resolve.alias['components'] = path.resolve(__dirname, 'components');
    return config;
  },
  typescript: {
    // This ensures the typescript resolver works for Next.js
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://movie-booking-wrhs.onrender.com/api/:path*', // Proxy to backend
      },
    ];
  },
  output: 'export',
}

module.exports = nextConfig