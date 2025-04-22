const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['components'] = path.resolve(__dirname, 'front-end/components');
    return config;
  }
}

module.exports = nextConfig