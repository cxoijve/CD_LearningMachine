/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://210.125.91.91:5000/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig 