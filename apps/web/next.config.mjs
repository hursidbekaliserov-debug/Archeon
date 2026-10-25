/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@naqshlab/shared"],
  experimental: {
    // optimize package imports
  },
};

export default nextConfig;
