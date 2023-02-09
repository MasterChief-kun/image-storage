/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI: "mongodb://127.0.0.1/image-storage",
    FILE_PATH: "./public/uploads",
    NEXTAUTH_SECRET: "ILikeParrots",
    HOST: "localhost:3000",
  },
  images: {
    domains: ["localhost:3000"]
  }
}

module.exports = nextConfig
