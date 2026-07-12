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
  let totalErrors = 0;

  for (const path of paths) {
    const url = new URL(path, base).toString();
    let passed = false;
    let lastError;

    for (let attempt = 1; attempt <= 2 && !passed; attempt += 1) {
      const page = await browser.newPage();
      page.setDefaultTimeout(15000);
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        await page.waitForSelector('main, #main-content', { timeout: 15000 });
        // Third-party embeds (Google Maps) may never navigate on
        // restricted-network runners; axe throws "Page/Frame is not ready"
        // when injecting into an unnavigated frame. Give embeds a bounded
        // wait, then drop still-blank iframes - there is no content to audit.
        await page.evaluate(async () => {
          const deadline = Date.now() + 8000;
          const blank = (frame) => {
            try {
              return !frame.contentWindow || frame.contentWindow.location.href === 'about:blank';
            } catch {
              return false; // cross-origin frame has navigated; keep it
            }
          };
          let pending = [...document.querySelectorAll('iframe')].filter(blank);
          while (pending.length > 0 && Date.now() < deadline) {
            await new Promise((resolve) => setTimeout(resolve, 250));
            pending = pending.filter(blank);
          }
          pending.forEach((frame) => frame.remove());
        });
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
        passed = true;
      } catch (e) {
        lastError = e;
        if (attempt === 1) console.error(`Retrying ${url} after audit error:`, e.message);
      } finally {
        await page.close();
      }
    }

    if (!passed) {
      totalErrors += 1;
      console.error(`Error auditing ${url}:`, lastError?.message || 'unknown error');
    }
  }

  await browser.close();
  console.log(`\nTotal: ${totalSerious} serious, ${totalCritical} critical`);
  process.exit(totalSerious + totalCritical + totalErrors > 0 ? 1 : 0);
})();
