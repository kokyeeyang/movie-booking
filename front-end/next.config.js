const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    config.resolve.alias['components'] = path.resolve(__dirname, 'components');
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // destination: 'http://movie-booking-backend:5000/api/:path*',
        // destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`,
        destination: "https://api.moviebooking.dev/api/:path*",
      },
    ];
  }
};

module.exports = nextConfig;
