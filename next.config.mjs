const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'image.onoffice.de',
      },
    ],
  },
  reactStrictMode: true,
}
 
export default nextConfig


