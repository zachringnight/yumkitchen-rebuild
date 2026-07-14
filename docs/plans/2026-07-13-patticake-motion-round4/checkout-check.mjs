import { createRequire } from 'node:module';
const require = createRequire(new URL('package.json', `file://${process.cwd()}/`));
const puppeteer = require('puppeteer');

const base = 'http://localhost:3105';
const seed = [
  {
    id: 'patticake:whole',
    cakeSlug: 'patticake',
    name: 'Patticake',
    format: 'whole',
    formatLabel: 'Whole cake',
    unitPrice: 5995,
    image: '/images/patticake/03_top_view.jpg',
    occasion: 'birthday',
    qty: 1,
  },
  {
    id: 'patticake:slice',
    cakeSlug: 'patticake',
    name: 'Patticake',
    format: 'slice',
    formatLabel: 'By the slice',
    unitPrice: 750,
    image: '/images/patticake/03_top_view.jpg',
    occasion: 'thank you',
    qty: 2,
  },
];

const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: 'new' });
const page = await browser.newPage();
await page.evaluateOnNewDocument((items) => {
  window.localStorage.setItem('patticake-cart-v1', JSON.stringify(items));
}, seed);
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
await page.goto(`${base}/patticake/checkout`, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 1500));

const report = await page.evaluate(() => {
  const failures = [];
  const h1 = document.querySelector('h1');
  if (h1?.textContent !== 'send your cake') failures.push(`unexpected h1: ${h1?.textContent}`);
  const header = h1?.closest('[data-motion-el]');
  if (!header) failures.push('checkout header is not wrapped in a motion Reveal');
  else if (getComputedStyle(header).opacity !== '1') failures.push(`header opacity ${getComputedStyle(header).opacity}`);
  const lis = Array.from(document.querySelectorAll('aside ul li'));
  if (lis.length !== 2) failures.push(`expected 2 summary lines, got ${lis.length}`);
  for (const li of lis) {
    if (getComputedStyle(li).opacity !== '1') failures.push('summary line stuck at opacity ' + getComputedStyle(li).opacity);
    if (!li.hasAttribute('data-motion-el')) failures.push('summary li missing data-motion-el');
  }
  const pay = Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.includes('Place order'));
  if (!pay) failures.push('place order button not found');
  const total = document.body.innerText.includes('$74.95') || document.body.innerText.includes('74.95');
  if (!total) failures.push('expected total not rendered');
  return failures;
});

// exercise qty +/- to make sure staggered lis do not re-animate or break layout
const qtyOk = await page.evaluate(() => {
  const inc = Array.from(document.querySelectorAll('aside button')).find((b) => b.getAttribute('aria-label') === 'Increase');
  if (!inc) return 'no increase button';
  inc.click();
  return 'ok';
});
await new Promise((r) => setTimeout(r, 600));
const afterQty = await page.evaluate(() => {
  const lis = Array.from(document.querySelectorAll('aside ul li'));
  return lis.every((li) => getComputedStyle(li).opacity === '1') ? 'ok' : 'li hidden after qty change';
});

await browser.close();
const all = [...report, ...(qtyOk === 'ok' ? [] : [qtyOk]), ...(afterQty === 'ok' ? [] : [afterQty])];
if (all.length) {
  console.error('CHECKOUT CHECK FAILED:');
  for (const f of all) console.error(`- ${f}`);
  process.exit(1);
}
console.log('Checkout check passed: header reveal, 2 staggered summary lines visible, totals render, qty change safe.');
