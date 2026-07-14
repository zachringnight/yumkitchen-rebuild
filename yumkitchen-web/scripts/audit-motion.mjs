#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const css = read('app/globals.css');
const home = read('components/HomeDesign.tsx');
const menuIntro = read('components/MenuMotionIntro.tsx');
const order = read('app/order/OrderClient.tsx');
const header = read('components/SiteHeader.tsx');
const shell = read('components/SiteShell.tsx');
const motionProvider = read('components/motion/MotionProvider.tsx');
const rootLayout = read('app/layout.tsx');
const springs = read('components/motion/springs.ts');
const patticakeHomeSurface = read('components/PatticakeHome.tsx');
const patticakeDelivery = read('app/patticake/page.tsx');

const getCssBlock = (source, selector) => {
  const start = source.indexOf(selector);
  if (start === -1) return '';

  const openBrace = source.indexOf('{', start);
  if (openBrace === -1) return '';

  let depth = 0;
  for (let index = openBrace; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }

  return '';
};

const hasRuleWithSelectorsAndDeclarations = (cssBlock, selectors, declarations) => {
  const rulePattern = /([^{}]+)\{([^{}]*)\}/gs;

  for (const match of cssBlock.matchAll(rulePattern)) {
    const selectorList = match[1];
    const body = match[2];
    const hasSelectors = selectors.every((selector) => selectorList.includes(selector));
    const hasDeclarations = declarations.every((declaration) => body.includes(declaration));

    if (hasSelectors && hasDeclarations) return true;
  }

  return false;
};

const reducedMotionRoleSelectors = [
  '.motion-role-ambient',
  '.motion-role-entrance',
  '.motion-role-feedback',
  '.motion-role-modal',
];
const reducedMotionResetDeclarations = [
  'animation: none',
  'transform: none',
  'transition: none',
];
const reducedMotionCss = getCssBlock(css, '@media (prefers-reduced-motion: reduce)');
const hasReducedMotionRoleReset = hasRuleWithSelectorsAndDeclarations(
  reducedMotionCss,
  reducedMotionRoleSelectors,
  reducedMotionResetDeclarations,
);

const checks = [
  ['motion token slow', css.includes('--motion-duration-slow')],
  ['motion token base', css.includes('--motion-duration-base')],
  ['motion token fast', css.includes('--motion-duration-fast')],
  ['entrance role class', css.includes('.motion-role-entrance')],
  ['ambient role class', css.includes('.motion-role-ambient')],
  ['feedback role class', css.includes('.motion-role-feedback')],
  ['modal role class', css.includes('.motion-role-modal')],
  ['reduced motion media query', css.includes('@media (prefers-reduced-motion: reduce)')],
  ['ambient disabled in reduced motion', hasReducedMotionRoleReset],
  ['home hero entrance role', home.includes('hero-panel motion-role-entrance')],
  ['shared hero entrance role', read('components/Hero.tsx').includes('hero-panel motion-role-entrance')],
  ['location modal role', read('components/LocationPickerModal.tsx').includes('motion-role-modal')],
  ['role duration drives hero animation', css.includes('hero-panel-in var(--motion-role-duration')],
  ['role duration drives modal animation', css.includes('modal-panel-in var(--motion-role-duration')],
  ['role duration drives ambient animation', css.includes('yum-soft-float var(--motion-role-duration')],
  ['home hero single active image', home.includes('const currentHero = heroImages[current]')],
  ['home hero lazy non-initial images', home.includes("loading={current === 0 ? 'eager' : 'lazy'}")],
  ['home hero active announcement', home.includes('aria-live="polite"') && home.includes('currentHeroLabel')],
  ['menu motion labeled ambient', menuIntro.includes('motion-role-ambient')],
  ['order category filter', order.includes('orderCategoryFilters') && order.includes('selectedCategory')],
  ['header dropdown motion role', header.includes('motion-role-feedback')],
  ['motion provider mounted in shell', shell.includes('<MotionProvider>')],
  ['motion provider lazy + strict', motionProvider.includes('LazyMotion') && motionProvider.includes('strict')],
  ['motion provider honors reduced motion', motionProvider.includes('reducedMotion="user"')],
  ['no-js motion fallback in layout', rootLayout.includes('data-motion-el')],
  ['spring tokens frosting and snap', springs.includes('export const frosting') && springs.includes('export const snap')],
  ['patticake home uses motion primitives', patticakeHomeSurface.includes('<Reveal') && patticakeHomeSurface.includes('<TapeTag')],
  ['patticake delivery page uses motion primitives', patticakeDelivery.includes('<Reveal') && patticakeDelivery.includes('<Stagger') && patticakeDelivery.includes('<TapeTag')],
];

const failures = checks.filter(([, passed]) => !passed).map(([label]) => label);

if (failures.length > 0) {
  console.error('Motion audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Motion audit passed: ${checks.length} checks.`);
