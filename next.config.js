/** @type {import('next').NextConfig} */

const HOST = "localhost:3000"
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI: "mongodb://127.0.0.1/image-storage",
    FILE_PATH: "./public/uploads",
    NEXTAUTH_SECRET: "ILikeParrots",
    HOST: HOST,
    NEXTAUTH_URL: HOST,
    FILE_HOST: "http://127.0.0.1:3001",
    ADMIN: "63e3d9234007a4562eddc9e4"
  },
  images: {
    // domains: ["localhost:3000", "localhost:3001"]
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3001",
        pathname: "/"
      }
    ],
    domains: [
      "127.0.0.1"
    ]
  }
}

module.exports = nextConfig
