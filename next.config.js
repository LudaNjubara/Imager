/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,

    fontLoaders: [{ loader: "@next/font/google", options: { subsets: ["latin"] } }],
  },

  images: {
    domains: ["lh3.googleusercontent.com", "avatars.githubusercontent.com"],
  },
};

module.exports = nextConfig;
