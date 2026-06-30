// Old WordPress press-archive posts (yumkitchen.com/<slug>/). They are not rebuilt
// on the new site, so without these they 404 after DNS cutover. Redirect them to the
// press hub. Slugs sourced from the in-the-news entries in lib/site.ts.
const pressArchiveRedirects = [
  '14-best-restaurants-in-minnetonka-mn',
  '235-2',
  '5-best-things-the-startribune-food-critics-ate-this-week',
  'best-business-lunch-in-the-twin-cities',
  'best-patios-in-the-twin-cities',
  'breakfast-with-megs-and-eggs',
  'celebrate-rosh-hashanah-with-yum',
  'coming-to-woodbury',
  'critics-choice',
  'derusha-eats-feature',
  'inside-yum',
  'passover-friendly-food',
  'patti-on-motivation',
  'pick-up-picnic-eats',
  'pregame-mnufc-at-yum-st-paul',
  'top-15-best-chocolate-chip-cookies-in-the-twin-cities',
  'top-bakeries-in-the-twin-cities',
  'top-dessert-in-the-twin-cities',
  'where-to-pick-up-local-soup',
  'woodbury-magazine-feature',
  'yum-at-taste-of-the-twin-cities',
  'yum-on-good-company',
].map((slug) => ({ source: `/${slug}`, destination: '/in-the-news', permanent: true }));

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
      ...pressArchiveRedirects,
    ];
  },
};

module.exports = nextConfig;
