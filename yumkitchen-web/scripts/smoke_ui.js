#!/usr/bin/env node
const { createRequire } = require('module');

const requireFromApp = createRequire(`${process.cwd()}/package.json`);
const puppeteer = requireFromApp('puppeteer');

const baseUrl = process.argv[2] || 'http://localhost:3000';

async function textIncludes(page, value) {
  return page.evaluate((needle) => document.body.textContent?.toLowerCase().includes(needle.toLowerCase()), value);
}

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(10000);

  try {
    await page.setViewport({ width: 1366, height: 900 });

    await page.goto(`${baseUrl}/preview`, { waitUntil: 'networkidle0' });
    if (!(await textIncludes(page, 'something sweet is taking shape'))) throw new Error('private preview teaser missing');
    const previewText = await page.evaluate(() => document.body.textContent ?? '');
    if (/nation[\s-]*wide/i.test(previewText)) throw new Error('private preview exposes the nationwide launch detail');
    if (!(await page.$('#preview-password'))) throw new Error('private preview password field missing');

    await page.goto(baseUrl, { waitUntil: 'networkidle0' });

    const title = await page.title();
    if (!title.includes('Patticake')) throw new Error(`unexpected Patticake home title: ${title}`);
    if (!(await textIncludes(page, 'now available nationwide'))) throw new Error('Patticake home nationwide launch message missing');
    if (!(await page.$('.patticake-photo-grid'))) throw new Error('Patticake home editorial photo grid missing');
    if (!(await textIncludes(page, 'Ship a Cake'))) throw new Error('Patticake home CTA missing');

    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.reload({ waitUntil: 'networkidle0' });
    if (!(await textIncludes(page, 'Ship a Cake'))) throw new Error('Patticake home CTA missing under reduced motion');
    await page.emulateMediaFeatures([]);

    await page.goto(`${baseUrl}/yum-kitchen`, { waitUntil: 'networkidle0' });
    if (!(await textIncludes(page, 'neighborhood restaurants'))) throw new Error('restaurant home proof points missing');

    await page.evaluate(() => {
      const startOrderButton = [...document.querySelectorAll('button')].find((button) => button.textContent?.trim().toLowerCase() === 'start order');
      if (!startOrderButton) throw new Error('Start Order button not found');
      startOrderButton.click();
    });
    await page.waitForSelector('[role="dialog"]');
    await new Promise((resolve) => setTimeout(resolve, 5600));
    const modalFocusInside = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      return Boolean(dialog && dialog.contains(document.activeElement));
    });
    if (!modalFocusInside) throw new Error('home order modal focus escaped during carousel rotation');
    await page.keyboard.press('Escape');
    await page.waitForSelector('[role="dialog"]', { hidden: true });

    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.reload({ waitUntil: 'networkidle0' });
    if (!(await textIncludes(page, 'start order'))) throw new Error('restaurant home CTA missing under reduced motion');
    await page.emulateMediaFeatures([]);

    await page.evaluate(() => localStorage.setItem('yum_preferred_location', 'st-louis-park'));
    await page.goto(`${baseUrl}/location/woodbury`, { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => localStorage.getItem('yum_preferred_location') === 'woodbury');
    if (!(await textIncludes(page, 'Order Woodbury'))) throw new Error('Woodbury location page did not use Woodbury order actions');
    await page.goto(`${baseUrl}/menu`, { waitUntil: 'networkidle0' });
    if (!(await textIncludes(page, 'Order from Woodbury'))) throw new Error('menu did not inherit Woodbury pickup restaurant after visiting location page');
    await page.evaluate(() => {
      const changeButton = [...document.querySelectorAll('button')].find((button) => button.textContent?.trim() === 'Change Restaurant');
      if (!changeButton) throw new Error('menu Change Restaurant button not found');
      changeButton.click();
    });
    await page.waitForSelector('[role="dialog"]');
    await page.evaluate(() => {
      const stPaulButton = [...document.querySelectorAll('[role="dialog"] button')].find((button) => button.textContent?.toLowerCase().includes('st. paul'));
      if (!stPaulButton) throw new Error('St. Paul location option not found');
      stPaulButton.click();
    });
    await page.waitForFunction(() => document.body.textContent?.includes('Order from St. Paul'));
    await page.goto(`${baseUrl}/order`, { waitUntil: 'networkidle0' });
    if (!(await textIncludes(page, 'Pickup at St. Paul'))) throw new Error('order page did not inherit St. Paul pickup restaurant after changing from the menu');

    await page.goto(`${baseUrl}/order`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('main');
    await page.evaluate(() => {
      const saladButton = [...document.querySelectorAll('button')].find((button) => button.textContent?.trim().toLowerCase() === 'salads');
      if (!saladButton) throw new Error('Salads filter not found');
      saladButton.click();
    });
    await page.waitForFunction(() => document.body.textContent?.toLowerCase().includes('mixed berry salad'));
    await page.evaluate(() => {
      const addButton = [...document.querySelectorAll('button')].find((button) => {
        const label = button.getAttribute('aria-label');
        return label === 'Add mixed berry salad' || label?.startsWith('Add mixed berry salad');
      });
      if (!addButton) throw new Error('Add button not found');
      addButton.click();
    });
    await page.waitForFunction(() => document.body.textContent?.includes('1 favorite selected'));
    await page.evaluate(() => {
      const addAgain = [...document.querySelectorAll('button')].find((button) => button.getAttribute('aria-label')?.startsWith('Add mixed berry salad'));
      if (!addAgain) throw new Error('Cart quantity add button not found');
      addAgain.click();
    });
    await page.waitForFunction(() => document.body.textContent?.includes('2 favorites selected'));
    const checkoutLinks = await page.$$eval('a[data-event="click_order_online"]', (links) => links.length);
    if (checkoutLinks < 2) throw new Error(`expected checkout/order links, found ${checkoutLinks}`);

    await page.goto(`${baseUrl}/order?category=breakfast#favorites`, { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => document.body.textContent?.toLowerCase().includes('breakfast sandwich'));
    const breakfastFilterSelected = await page.evaluate(() => {
      const button = [...document.querySelectorAll('button')].find((candidate) => candidate.textContent?.trim().toLowerCase() === 'breakfast');
      return button?.getAttribute('aria-pressed') === 'true';
    });
    if (!breakfastFilterSelected) throw new Error('deep-linked breakfast filter was not selected');

    await page.goto(`${baseUrl}/menu`, { waitUntil: 'networkidle0' });
    await page.type('input[placeholder*="Search"]', 'salmon');
    await page.waitForFunction(() => document.body.textContent?.toLowerCase().includes('grainy mustard salmon'));
    const resultStatus = await textIncludes(page, 'for "salmon"');
    if (!resultStatus) throw new Error('menu search status missing query text');
    const noResults = await textIncludes(page, 'no menu items found');
    if (noResults) throw new Error('menu search unexpectedly returned no results');

    console.log('UI smoke passed: private preview, home, reduced motion, location handoff, menu restaurant switching, order filters, cart quantity, checkout links, and menu search work.');
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
