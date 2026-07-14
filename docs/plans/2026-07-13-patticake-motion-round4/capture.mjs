#!/usr/bin/env node
// Usage (from yumkitchen-web/): node ../docs/plans/2026-07-13-patticake-motion-round4/capture.mjs <prefix>
import { createRequire } from 'node:module';

// resolve puppeteer from the invoking directory (yumkitchen-web/), not this script's dir
const require = createRequire(new URL('package.json', `file://${process.cwd()}/`));
const puppeteer = require('puppeteer');

const prefix = process.argv[2] ?? 'shot';
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3105';
const outDir = new URL('.', import.meta.url).pathname;
const routes = [
  ['/', 'home'],
  ['/patticake', 'patticake'],
  ['/order-a-cake', 'order-a-cake'],
  ['/patticake/checkout', 'checkout'],
];
const viewports = [
  ['desktop', 1280, 2400],
  ['mobile', 390, 2400],
];

const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: 'new' });
const page = await browser.newPage();
for (const [label, width, height] of viewports) {
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  for (const [route, name] of routes) {
    await page.goto(new URL(route, baseUrl).toString(), { waitUntil: 'networkidle0' });
    // let entrance springs finish before capturing
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((resolve) => setTimeout(resolve, 1200));
    await page.screenshot({ path: `${outDir}${prefix}-${name}-${label}.png`, fullPage: true });
    console.log(`${prefix}-${name}-${label}.png`);
  }
}
await browser.close();
