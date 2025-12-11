/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Disable server-side image optimization as it's not needed for this project
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
