#!/usr/bin/env node
const { createRequire } = require('module');

const requireFromApp = createRequire(`${process.cwd()}/package.json`);
const puppeteer = requireFromApp('puppeteer');

const baseUrl = process.argv[2] || 'http://localhost:3000';
const seedRoutes = [
  '/',
  '/menu',
  '/order',
  '/catering',
  '/order-a-cake',
  '/about',
  '/careers',
  '/contact',
  '/in-the-news',
  '/accessibility-statement',
  '/location/st-louis-park',
  '/location/shady-oak',
  '/location/saint-paul',
  '/location/woodbury',
];

function normalizeInternalHref(href, fromUrl = baseUrl) {
  const base = new URL(baseUrl);
  const url = new URL(href, fromUrl);
  if (url.origin !== base.origin) return null;
  if (/\.(pdf|png|jpe?g|webp|gif|svg)$/i.test(url.pathname)) return null;
  return `${url.pathname}${url.search}${url.hash}`;
}

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(12000);

  const internalTargets = new Set(seedRoutes);
  const failures = [];

  try {
    for (const route of seedRoutes) {
      const response = await page.goto(new URL(route, baseUrl).toString(), { waitUntil: 'networkidle0' });
      if (!response || response.status() >= 400) {
        failures.push(`${route} returned ${response?.status() ?? 'no response'}`);
        continue;
      }
      const fromUrl = page.url();
      const hrefs = await page.$$eval('a[href]', (links) => links.map((link) => link.getAttribute('href')).filter(Boolean));
      for (const href of hrefs) {
        if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
        const normalized = normalizeInternalHref(href, fromUrl);
        if (normalized) internalTargets.add(normalized);
      }
    }

    for (const target of internalTargets) {
      const url = new URL(target, baseUrl);
      const response = await page.goto(`${url.origin}${url.pathname}${url.search}`, { waitUntil: 'networkidle0' });
      if (!response || response.status() >= 400) {
        failures.push(`${target} returned ${response?.status() ?? 'no response'}`);
        continue;
      }
      if (url.hash) {
        const hash = decodeURIComponent(url.hash.slice(1));
        const hasAnchor = await page.evaluate((id) => Boolean(document.getElementById(id) || document.querySelector(`[name="${CSS.escape(id)}"]`)), hash);
        if (!hasAnchor) failures.push(`${target} points to a missing anchor`);
      }
    }
  } finally {
    await browser.close();
  }

  if (failures.length > 0) {
    console.error('Link audit failed:');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Link audit passed: ${internalTargets.size} internal routes and anchors checked.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
