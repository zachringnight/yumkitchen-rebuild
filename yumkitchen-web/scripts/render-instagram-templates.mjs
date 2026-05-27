import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..', '..');
const templatePath = path.join(root, 'social', 'instagram', 'yum-instagram-templates.html');
const exportDir = path.join(root, 'social', 'instagram', 'exports');

await mkdir(exportDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: 'new',
  defaultViewport: { width: 1200, height: 2000, deviceScaleFactor: 1 },
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(templatePath).href, { waitUntil: 'networkidle0' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images).map((image) => {
        if (image.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', reject, { once: true });
        });
      }),
    );
  });

  const exports = await page.$$eval('[data-export]', (nodes) =>
    nodes.map((node) => ({
      name: node.getAttribute('data-export'),
      width: Math.round(node.getBoundingClientRect().width),
      height: Math.round(node.getBoundingClientRect().height),
    })),
  );

  for (const item of exports) {
    const element = await page.$(`[data-export="${item.name}"]`);
    if (!element) continue;
    const outputPath = path.join(exportDir, `${item.name}.png`);
    await element.screenshot({ path: outputPath, omitBackground: false });
    console.log(`${item.name}.png ${item.width}x${item.height}`);
  }
} finally {
  await browser.close();
}
