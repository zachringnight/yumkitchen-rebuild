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
const patticakePickup = read('app/order-a-cake/page.tsx');
const yumPhotoStory = read('components/PhotoMotionStory.tsx');
const reviewAssets = read('app/asset-gallery/assets.json');
const creativeReviewSync = read('scripts/sync-creative-review-assets.mjs');
const devCacheCleanup = read('scripts/clear-dev-cache.mjs');
const creativeLaunchMotion = read('../social/yum-patticake-creative-launch-2026-07-14/src/CreativeLaunch.tsx');
const carouselCardMotion = read('../social/yum-patticake-creative-launch-2026-07-14/src/CarouselCard.tsx');
const carouselSequenceMotion = read('../social/yum-patticake-creative-launch-2026-07-14/src/CarouselMotion.tsx');
const carouselSpecs = read('../social/yum-patticake-creative-launch-2026-07-14/src/carousel-specs.json');
const motionReviewBuilder = read('../social/yum-patticake-creative-launch-2026-07-14/scripts/build-motion-review.mjs');
const socialSourceOfTruth = read('../social/START-HERE.md');

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
const hasBareReducedMotionLogoHide = /(^|,)\s*\.logo-animation-logo\s*(?:,|\{)/m.test(reducedMotionCss);
const patticakeRibbonCss = getCssBlock(css, '.patticake-message-ribbon span');
// Photos run caption-free: nothing may claim what is in the frame beyond alt
// text. Coverage is derived, not listed. Every .tsx under app/ and components/
// is scanned, so a surface added later is guarded the day it lands rather than
// the day someone remembers to update this file. A caption can only ship by
// adding its path to the allowlist below, which is a deliberate act with a
// reason attached rather than an oversight.
// The exemption is one caption per file, not the file. Each entry pins a marker
// unique to the approved caption and the number of captions the file may carry,
// so a second caption next to a different photo in the same file is still
// caught. The marker is caption text rather than class names, so restyling stays
// free and only a change in what the caption says trips it.
const captionAllowlist = new Map([
  // Captions a photo of people, not food. It names who is in the frame.
  ['app/about/page.tsx', { marker: 'founder Patti Soskin, with Kelli, at yum!', allowed: 1 }],
  // figcaption for review attribution, which is what the element is for.
  ['components/ReviewsWall.tsx', { marker: '{story.creator}, {story.platform}', allowed: 1 }],
]);
const surfaceFiles = ['app', 'components'].flatMap((dir) =>
  fs
    .readdirSync(path.join(root, dir), { recursive: true })
    .map((entry) => `${dir}/${entry}`)
    .filter((file) => file.endsWith('.tsx')));
// Catches <figcaption> and anything self-describing as a caption in a class
// name, which is how the pattern actually comes back: someone rebuilds the
// caption as a styled div. It does not catch a label written as a plain <p> or
// <span> with an unrelated class name, and no source-level grep can. This is a
// tripwire for regression and a signpost for the next coder, not a proof. The
// review gate for a genuinely new photo label is a human reading the diff.
// Split, because an exempt file's exemption covers one <figcaption> and nothing
// else: caption-shaped divs stay guarded there too.
const hasCaptionClassMarkup = (source) => source.includes('photo-motion-caption')
  || /className="[^"]*caption/i.test(source)
  || /className={`[^`]*caption/i.test(source);
const hasCaptionMarkup = (source) => source.includes('<figcaption') || hasCaptionClassMarkup(source);

const captionedSurfaces = surfaceFiles.filter((file) => {
  const source = read(file);
  const exemption = captionAllowlist.get(file);
  if (!exemption) return hasCaptionMarkup(source);

  // An exempt file has to still carry the caption it was exempted for, and no
  // more captions than it was exempted for.
  const captionCount = (source.match(/<figcaption/g) ?? []).length;
  if (!source.includes(exemption.marker) || captionCount !== exemption.allowed) return true;
  // The exemption is for that one figcaption, not for anything caption-shaped
  // the file might grow later.
  return hasCaptionClassMarkup(source);
});
const captionFreePhotoSurfaces = captionedSurfaces.length === 0;
// Caption styling must not outlive the markup, or a caption can come back fully
// dressed. Scoped to the food and cake photo surfaces rather than the whole
// stylesheet, so shared styling for the allowlisted captions above stays legal.
const foodPhotoSurfaceSelectors = ['.photo-motion', '.patticake-photo-grid', '.patticake-hero-peek', '.cake-gallery'];
// Whole selectors, not lines. A descendant selector may be wrapped across lines
// (`.photo-motion-layer\nfigcaption`), and checking line by line would see a
// bare `figcaption` with no surface prefix and wave it through. Everything
// between the previous brace and the next `{` is the selector; collapsing its
// whitespace makes formatting irrelevant to the result.
const cssSelectors = Array.from(css.matchAll(/([^{}]+)\{/g), (match) => match[1].replace(/\s+/g, ' ').trim());
const captionFreePhotoCss = !css.includes('photo-motion-caption')
  && !cssSelectors.some((selector) =>
    selector.includes('figcaption') && foodPhotoSurfaceSelectors.some((prefix) => selector.includes(prefix)));
const positionedPatticakeImageParents = [
  '.patticake-hero-card',
  '.patticake-hero-peek-image',
  '.patticake-photo-grid-image',
].every((selector) => getCssBlock(css, selector).includes('position: relative'));
const activePatticakeCopy = [patticakeHomeSurface, patticakeDelivery, patticakePickup, reviewAssets].join('\n');
const hasRetiredThreeWaysFraming = /one cake(?:\s*[,/]\s*|\s+)three(?:\s+happy)?\s+ways/i.test(activePatticakeCopy);
const launchPosterFractions = Array.from(
  motionReviewBuilder.matchAll(/folder: "launch-motion-[^"]+"[^}]+posterAt: ([0-9.]+)/g),
  (match) => Number(match[1]),
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
  ['reduced motion preserves the header logo', !hasBareReducedMotionLogoHide],
  ['home hero entrance role', home.includes('hero-panel motion-role-entrance')],
  ['shared hero entrance role', read('components/Hero.tsx').includes('hero-panel motion-role-entrance')],
  ['location modal role', read('components/LocationPickerModal.tsx').includes('motion-role-modal')],
  ['role duration drives hero animation', css.includes('hero-panel-in var(--motion-role-duration')],
  ['role duration drives modal animation', css.includes('modal-panel-in var(--motion-role-duration')],
  ['ambient role uses the ambient duration token', getCssBlock(css, '.motion-role-ambient').includes('--motion-duration-ambient')],
  ['home hero single active image', home.includes('const currentHero = heroImages[current]')],
  ['home hero lazy non-initial images', home.includes("loading={current === 0 ? 'eager' : 'lazy'}")],
  ['home hero active announcement', home.includes('aria-live="polite"') && home.includes('currentHeroLabel')],
  ['menu uses a static photo grid rather than ambient cards', menuIntro.includes('menu-photo-grid') && !menuIntro.includes('motion-role-ambient')],
  ['order category filter', order.includes('orderCategoryFilters') && order.includes('selectedCategory')],
  ['header dropdown motion role', header.includes('motion-role-feedback')],
  ['motion provider mounted in shell', shell.includes('<MotionProvider>')],
  ['motion provider lazy + strict', motionProvider.includes('LazyMotion') && motionProvider.includes('strict')],
  ['motion provider honors reduced motion', motionProvider.includes('reducedMotion="user"')],
  ['no-js motion fallback in layout', rootLayout.includes('data-motion-el')],
  ['spring tokens frosting and snap', springs.includes('export const frosting') && springs.includes('export const snap')],
  ['patticake home uses restrained motion primitives', patticakeHomeSurface.includes('<Reveal') && patticakeHomeSurface.includes('patticake-photo-grid')],
  ['patticake delivery page uses restrained motion primitives', patticakeDelivery.includes('<Reveal') && patticakeDelivery.includes('<Stagger') && patticakeDelivery.includes('patticake-delivery-photo-pair')],
  ['no deprecated Patticake sticker treatment', !css.includes('tape-tag') && !patticakeHomeSurface.includes('TapeTag') && !patticakeDelivery.includes('TapeTag')],
  ['no retired three-ways Patticake framing on active surfaces', !hasRetiredThreeWaysFraming],
  ['Patticake home leads with one nationwide feature', patticakeHomeSurface.includes('patticake_home_nationwide_feature') && patticakeHomeSurface.includes('send cake,') && !patticakeHomeSurface.includes('const moments') && !patticakeHomeSurface.includes('pick your cake moment') && !patticakeHomeSurface.includes('md:grid-cols-3')],
  ['Patticake delivery page uses one editorial cake fact band', patticakeDelivery.includes('three layers.') && patticakeDelivery.includes('one real bakery cake.') && patticakeDelivery.includes('divide-y divide-brand-primary/30') && !patticakeDelivery.includes('const cakeFacts') && !patticakeDelivery.includes('md:grid-cols-3')],
  ['Patticake pickup page removes the equal three-card choice block', patticakePickup.includes('Ship Nationwide') && patticakePickup.includes('nationwide gifting') && !patticakePickup.includes('const cakePaths') && !patticakePickup.includes('where should the cake go?') && !patticakePickup.includes('md:grid-cols-3')],
  ['Patticake message ribbon is plain type', !patticakeRibbonCss.includes('background:') && !patticakeRibbonCss.includes('border:') && !patticakeRibbonCss.includes('box-shadow:')],
  ['Patticake fill image parents are positioned', positionedPatticakeImageParents],
  ['photo surfaces carry no visible captions', captionFreePhotoSurfaces && captionFreePhotoCss],
  ['photo frames still wrap positioned images', patticakeHomeSurface.includes('patticake-photo-grid-image') && yumPhotoStory.includes('photo-motion-image')],
  ['active gallery sync uses the current creative launch pack', creativeReviewSync.includes("yum-patticake-creative-launch-2026-07-14") && !creativeReviewSync.includes("yum-patticake-social-motion-pack")],
  ['gallery sync archives stale review assets instead of deleting them', creativeReviewSync.includes("archive', 'retired-review-assets") && creativeReviewSync.includes('archiveUnexpected') && creativeReviewSync.includes('renameSync')],
  ['dev cache cleanup preserves an active server and clears stale locks', devCacheCleanup.includes("spawnSync('lsof'") && devCacheCleanup.includes('lockHasOwner') && devCacheCleanup.includes("process.argv.includes('--force')")],
  ['Remotion launch copy stays in its blue layout panel', creativeLaunchMotion.includes('const photoRight = isWide ? panelWidth : 0') && creativeLaunchMotion.includes('const photoBottom = isWide ? 0 : panelHeight') && creativeLaunchMotion.includes('width: "auto"') && creativeLaunchMotion.includes('height: "auto"') && creativeLaunchMotion.includes('overflow: "hidden"') && !creativeLaunchMotion.includes('bottom: isWide ? 54 : 216') && !creativeLaunchMotion.includes('textShadow')],
  ['Remotion compact motion panels reserve footer room', creativeLaunchMotion.includes(': isSquare ? 540 : isFeed ? 610 : 700') && creativeLaunchMotion.includes('isSquare ? 82 : isFeed ? 88')],
  ['Remotion CTA holds fully for the final two seconds', creativeLaunchMotion.includes('const ctaStart = isShortsCut ? 7.45 : 5.45')],
  ['motion review posters sample fully resolved end frames', motionReviewBuilder.includes('posterAt: 0.88')],
  ['launch motion review posters sample stable photo frames', launchPosterFractions.length === 5 && launchPosterFractions.every((fraction) => fraction >= 0.31 && fraction <= 0.36)],
  ['carousel card counters stay off photography', !carouselCardMotion.includes('top: 58') && !carouselCardMotion.includes('top: 735') && carouselCardMotion.includes('alignItems: "baseline"')],
  ['carousel logo player stays inside the blue panel', !carouselSequenceMotion.includes('bottom: panelHeight - Math.round(badgeSize / 2)') && carouselSequenceMotion.includes('bottom: isFeed ? 28 : 38')],
  ['active carousel uses nationwide framing, not new-home framing', !/new[ -]home/i.test(carouselSpecs) && carouselSpecs.includes('launch-01-nationwide')],
  ['asset gallery sync uses the nationwide carousel id', !/new[ -]home/i.test(reviewAssets) && reviewAssets.includes('carousel-card-launch-01-nationwide')],
  ['social handoff points to the current launch pack', socialSourceOfTruth.includes('yum-patticake-creative-launch-2026-07-14/') && socialSourceOfTruth.includes('historical production references only')],
  ['social handoff retires stale launch and Instagram visual packs', socialSourceOfTruth.includes('yum-social-launch-batch-2026-07/') && socialSourceOfTruth.includes('instagram/') && socialSourceOfTruth.includes('Do not rerender or publish')],
];

const failures = checks.filter(([, passed]) => !passed).map(([label]) => label);

if (failures.length > 0) {
  console.error('Motion audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Motion audit passed: ${checks.length} checks.`);
