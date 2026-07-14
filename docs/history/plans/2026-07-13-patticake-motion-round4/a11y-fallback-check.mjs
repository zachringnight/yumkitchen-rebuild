import { createRequire } from 'node:module';
const require = createRequire(new URL('package.json', `file://${process.cwd()}/`));
const puppeteer = require('puppeteer');

const base = 'http://localhost:3105';
const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: 'new' });
const failures = [];

// 1. Reduced motion: after load + scroll-through, every data-motion-el must be
//    fully visible with an identity/none transform (MotionConfig reducedMotion="user").
{
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto(`${base}/patticake`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 900));
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.7;
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
  });
  await new Promise((r) => setTimeout(r, 2000));
  const bad = await page.evaluate(() => {
    const isIdentity = (t) => t === 'none' || t === 'matrix(1, 0, 0, 1, 0, 0)';
    return Array.from(document.querySelectorAll('[data-motion-el]'))
      .filter((el) => el.getClientRects().length > 0)
      .map((el) => {
        const s = getComputedStyle(el);
        return { cls: String(el.className).slice(0, 60), opacity: s.opacity, transform: s.transform };
      })
      .filter((r) => Number(r.opacity) < 0.9 || !isIdentity(r.transform));
  });
  if (bad.length) failures.push(`reduced-motion: ${bad.length} motion elements not at rest: ${JSON.stringify(bad.slice(0, 3))}`);
  await page.close();
}

// 2. No-JS: with JavaScript disabled, every data-motion-el must be visible
//    (the <noscript> fallback must neutralize SSR'd hidden/offset styles).
{
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(false);
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto(`${base}/patticake`, { waitUntil: 'load' });
  await new Promise((r) => setTimeout(r, 500));
  const result = await page.evaluate(() => {
    const isIdentity = (t) => t === 'none' || t === 'matrix(1, 0, 0, 1, 0, 0)';
    const els = Array.from(document.querySelectorAll('[data-motion-el]')).filter((el) => el.getClientRects().length > 0);
    const bad = els
      .map((el) => {
        const s = getComputedStyle(el);
        return { cls: String(el.className).slice(0, 60), opacity: s.opacity, transform: s.transform };
      })
      .filter((r) => Number(r.opacity) < 0.9 || !isIdentity(r.transform));
    return { total: els.length, bad, textLen: document.body.innerText.length };
  });
  if (result.total === 0) failures.push('no-js: no data-motion-el elements found in SSR output');
  if (result.bad.length) failures.push(`no-js: ${result.bad.length}/${result.total} motion elements hidden without JS: ${JSON.stringify(result.bad.slice(0, 3))}`);
  if (result.textLen < 500) failures.push('no-js: page body text suspiciously short');
  await page.close();
}

await browser.close();
if (failures.length) {
  console.error('A11Y/FALLBACK CHECK FAILED:');
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}
console.log('A11y/fallback check passed: reduced-motion elements at rest; no-JS renders every motion element visible.');
