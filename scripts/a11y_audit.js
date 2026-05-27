#!/usr/bin/env node
/**
 * Headless a11y audit using axe-core + Puppeteer.
 * Reports zero exit if all pages pass (no serious or critical violations).
 *
 * Usage:
 *   node scripts/a11y_audit.js http://localhost:3000 /menu /location/st-louis-park
 *
 * Requires puppeteer + @axe-core/puppeteer to be installed.
 * Bundled in package.json devDependencies.
 */
const base = process.argv[2] || 'http://localhost:3000';
const paths = process.argv.slice(3);
if (paths.length === 0) paths.push('/');
const { createRequire } = require('module');
const appRequire = createRequire(`${process.cwd()}/package.json`);

(async () => {
  let puppeteer, AxePuppeteer;
  try {
    puppeteer = appRequire('puppeteer');
    AxePuppeteer = appRequire('@axe-core/puppeteer').AxePuppeteer;
  } catch (e) {
    console.error('Install deps first: npm i -D puppeteer @axe-core/puppeteer');
    process.exit(1);
  }

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  let totalSerious = 0;
  let totalCritical = 0;

  for (const path of paths) {
    const url = new URL(path, base).toString();
    const page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle0' });
      const results = await new AxePuppeteer(page)
        .options({ runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] })
        .analyze();
      const serious = results.violations.filter((v) => v.impact === 'serious');
      const critical = results.violations.filter((v) => v.impact === 'critical');
      totalSerious += serious.reduce((acc, v) => acc + v.nodes.length, 0);
      totalCritical += critical.reduce((acc, v) => acc + v.nodes.length, 0);

      console.log(`${url}: ${serious.length} serious, ${critical.length} critical`);
      [...critical, ...serious].slice(0, 5).forEach((v) => {
        console.log(`  [${v.impact}] ${v.id} (${v.nodes.length}): ${v.help}`);
      });
    } catch (e) {
      console.error(`Error auditing ${url}:`, e.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log(`\nTotal: ${totalSerious} serious, ${totalCritical} critical`);
  process.exit(totalSerious + totalCritical > 0 ? 1 : 0);
})();
