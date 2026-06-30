/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  allowedDevOrigins: ['patticake.com', 'www.patticake.com'],
  trailingSlash: false,
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: 'yumkitchen.com' }],
  },
  async redirects() {
    return [
      {
        source: '/featured-menu',
        destination: '/menu',
        permanent: true,
      },
      {
        source: '/order-now',
        destination: '/order',
        permanent: true,
      },
      {
        source: '/jobs/general-job-description',
        destination: '/careers',
        permanent: true,
      },
      {
        source: '/patticake-national-delivery',
        destination: '/patticake',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
