import { createRequire } from 'node:module';
const require = createRequire(new URL('package.json', `file://${process.cwd()}/`));
const puppeteer = require('puppeteer');

const base = 'http://localhost:3105';
const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
const failures = [];

async function clickSend() {
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.trim() === 'Send These Words');
    if (!btn) throw new Error('Send These Words button not found');
    btn.click();
  });
  await new Promise((r) => setTimeout(r, 900));
}

// /patticake — delivery form prefill
await page.goto(`${base}/patticake`, { waitUntil: 'networkidle0' });
await page.evaluate(() => {
  const input = document.getElementById('patticake-message-preview');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(input, 'go team maya');
  input.dispatchEvent(new Event('input', { bubbles: true }));
});
await new Promise((r) => setTimeout(r, 300));
const wordCount = await page.evaluate(() => document.querySelectorAll('.message-preview-word').length);
if (wordCount !== 3) failures.push(`expected 3 preview words, got ${wordCount}`);
await clickSend();
const delivery = await page.evaluate(() => ({
  hash: window.location.hash,
  value: document.getElementById('cake-gift-message')?.value,
  pulsed: document.getElementById('cake-gift-message')?.classList.contains('message-field-pulse'),
}));
if (delivery.hash !== '#delivery-support') failures.push(`patticake hash: ${delivery.hash}`);
if (delivery.value !== 'go team maya') failures.push(`gift message value: "${delivery.value}"`);
if (!delivery.pulsed) failures.push('gift message field did not pulse');

// /order-a-cake — pickup textarea seed
await page.goto(`${base}/order-a-cake`, { waitUntil: 'networkidle0' });
await clickSend();
const pickup = await page.evaluate(() => ({
  hash: window.location.hash,
  value: document.getElementById('cake-message')?.value,
  pulsed: document.getElementById('cake-message')?.classList.contains('message-field-pulse'),
}));
if (pickup.hash !== '#cake-inquiry') failures.push(`order-a-cake hash: ${pickup.hash}`);
if (!pickup.value?.includes('Words on the cake: "love you"')) failures.push(`pickup message value: "${pickup.value}"`);
if (!pickup.pulsed) failures.push('pickup message field did not pulse');

await browser.close();
if (failures.length) {
  console.error('HANDOFF CHECK FAILED:');
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}
console.log('Handoff check passed: word pops, prefill, hash, and pulse on both pages.');
