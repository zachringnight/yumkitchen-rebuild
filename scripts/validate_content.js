const fs = require('fs');
const path = require('path');

const appDir = process.cwd();
const expectedSlugs = ['st-louis-park', 'shady-oak', 'saint-paul', 'woodbury'];
const requiredPublicFiles = [
  'favicon.png',
  'og/default.jpg',
  'og/home.jpg',
  'og/menu.jpg',
  'og/catering.jpg',
  'pdfs/takeout-menu.pdf',
  'pdfs/gf-allergy-menu.pdf',
];
const forbiddenLocationNames = ['edina', 'maple grove', 'roseville'];
const forbiddenScrapeFragments = ['Follow for more yum!', 'Quick Links'];

let failures = 0;

function fail(message) {
  failures += 1;
  console.error(`FAIL: ${message}`);
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(appDir, relativePath), 'utf8'));
}

function exists(relativePath) {
  return fs.existsSync(path.join(appDir, relativePath));
}

const locations = readJson('lib/locations-seed.json');
const slugs = locations.map((location) => location.slug);
if (JSON.stringify(slugs) !== JSON.stringify(expectedSlugs)) {
  fail(`location slugs changed: ${JSON.stringify(slugs)}`);
} else {
  pass('real location slugs preserved');
}

for (const location of locations) {
  if (!location.order_url || !/^https:\/\/(www\.)?(toasttab|order\.toasttab)\.com\//.test(location.order_url)) {
    fail(`${location.slug} has invalid Toast order URL`);
  }
  if (!location.maps_url || !/^https:\/\//.test(location.maps_url)) {
    fail(`${location.slug} has invalid maps URL`);
  }
  if (!location.phone_e164 || !location.phone_e164.startsWith('+1')) {
    fail(`${location.slug} has invalid E.164 phone`);
  }
}
if (failures === 0) pass('Toast, maps, and phone fields are valid');

const menu = readJson('lib/menu-seed.json');
const items = menu.sections.flatMap((section) => section.items.map((item) => ({ ...item, section: section.name })));
if (items.length !== 82) {
  fail(`menu item count expected 82, found ${items.length}`);
} else {
  pass('all 82 menu items preserved');
}
for (const item of items) {
  if (!item.name) fail(`menu item without name in ${item.section}`);
  const description = item.description || '';
  for (const fragment of forbiddenScrapeFragments) {
    if (description.includes(fragment)) fail(`scraped footer fragment found in ${item.section} / ${item.name}`);
  }
}

for (const file of requiredPublicFiles) {
  if (!exists(path.join('public', file))) {
    fail(`required public file missing: ${file}`);
  }
}
if (requiredPublicFiles.every((file) => exists(path.join('public', file)))) {
  pass('required favicon, OG, and PDF files exist');
}

const sourceFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next') continue;
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(absolute);
    } else if (/\.(ts|tsx|css|md)$/.test(entry.name)) {
      sourceFiles.push(absolute);
    }
  }
}
walk(path.join(appDir, 'app'));
walk(path.join(appDir, 'components'));
walk(path.join(appDir, 'lib'));

const publicRefs = new Set();
const publicRefPattern = /['"]\/(images|og|pdfs)\/[^'")\s]+/g;
for (const file of sourceFiles) {
  const text = fs.readFileSync(file, 'utf8');
  for (const forbidden of forbiddenLocationNames) {
    if (text.toLowerCase().includes(forbidden)) fail(`forbidden generated location "${forbidden}" found in ${path.relative(appDir, file)}`);
  }
  for (const match of text.matchAll(publicRefPattern)) {
    publicRefs.add(match[0].slice(2));
  }
}

for (const ref of publicRefs) {
  if (!exists(path.join('public', ref))) fail(`referenced public asset missing: ${ref}`);
}
if ([...publicRefs].every((ref) => exists(path.join('public', ref)))) {
  pass(`all ${publicRefs.size} referenced public assets exist`);
}

if (failures > 0) {
  console.error(`Content validation failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log('Content validation passed.');
