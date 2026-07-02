#!/usr/bin/env node
import puppeteer from 'puppeteer';

const baseUrl = process.env.BASE_URL ?? `http://localhost:${process.env.PORT ?? '3000'}`;

const routes = [
  '/',
  '/yum-kitchen',
  '/menu',
  '/order',
  '/catering',
  '/order-a-cake',
  '/patticake',
  '/patticake-national-delivery',
  '/about',
  '/careers',
  '/in-the-news',
  '/contact',
  '/accessibility-statement',
  '/location/st-louis-park',
  '/location/shady-oak',
  '/location/saint-paul',
  '/location/woodbury',
  '/logo-animation',
];

const reducedMotionRoutes = ['/', '/yum-kitchen', '/menu', '/order-a-cake', '/patticake', '/logo-animation'];

const viewports = [
  { label: 'desktop', width: 1280, height: 720 },
  { label: 'mobile', width: 390, height: 844 },
];

function routeUrl(route) {
  return new URL(route, baseUrl).toString();
}

function isIdentityTransform(value) {
  return (
    value === 'none' ||
    value === 'matrix(1, 0, 0, 1, 0, 0)' ||
    value === 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)'
  );
}

function hasPositiveDuration(value) {
  return value
    .split(',')
    .map((part) => part.trim())
    .some((part) => part !== '0s' && part !== '0ms');
}

async function settle() {
  await new Promise((resolve) => {
    setTimeout(resolve, 150);
  });
}

async function clickButtonByName(page, name) {
  const clicked = await page.evaluate((buttonName) => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const match = buttons.find((button) => {
      const label = button.getAttribute('aria-label') ?? button.textContent?.trim();
      return label === buttonName;
    });
    if (!match) return false;
    match.click();
    return true;
  }, name);

  if (!clicked) {
    throw new Error(`Could not find button: ${name}`);
  }
}

async function checkVisualRoute(page, route, viewportLabel, routeConsoleMessages) {
  await page.goto(routeUrl(route), { waitUntil: 'load' });
  await settle();

  const result = await page.evaluate((label) => {
    const visible = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };

    const images = Array.from(document.images).map((image) => {
      const rect = image.getBoundingClientRect();
      const isVisible = visible(image);
      const inViewport = rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;

      return {
        alt: image.getAttribute('alt'),
        complete: image.complete,
        height: Math.round(rect.height),
        inViewport,
        naturalHeight: image.naturalHeight,
        naturalWidth: image.naturalWidth,
        src: image.currentSrc || image.src,
        visible: isVisible,
        width: Math.round(rect.width),
      };
    });

    const inViewportImages = images.filter((image) => image.visible && image.inViewport);
    const roleCounts = {};
    let animatedCount = 0;
    let backgroundCount = 0;
    const clippedMedia = [];

    for (const element of Array.from(document.querySelectorAll('body *'))) {
      const style = getComputedStyle(element);
      const className = typeof element.className === 'string' ? element.className : '';

      for (const role of ['motion-role-ambient', 'motion-role-entrance', 'motion-role-feedback', 'motion-role-modal']) {
        if (className.includes(role)) roleCounts[role] = (roleCounts[role] ?? 0) + 1;
      }

      if (style.animationName && style.animationName !== 'none') animatedCount += 1;
      if (style.backgroundImage && style.backgroundImage !== 'none') backgroundCount += 1;

      if (label === 'mobile' && ['IMG', 'VIDEO', 'CANVAS'].includes(element.tagName) && visible(element)) {
        const rect = element.getBoundingClientRect();
        const parentRect = element.parentElement?.getBoundingClientRect();
        if (parentRect && (rect.width > parentRect.width * 1.7 || rect.height > parentRect.height * 1.7)) {
          clippedMedia.push({
            className: className.slice(0, 100),
            media: [Math.round(rect.width), Math.round(rect.height)],
            parent: [Math.round(parentRect.width), Math.round(parentRect.height)],
            tag: element.tagName.toLowerCase(),
          });
        }
      }
    }

    const bodyText = document.body.innerText ?? '';

    return {
      actualPath: window.location.pathname,
      animatedCount,
      backgroundCount,
      blankBody: bodyText.length < 200,
      brokenInViewportImages: inViewportImages
        .filter((image) => !image.complete || image.naturalWidth <= 0 || image.naturalHeight <= 0)
        .map((image) => image.src),
      clippedMedia,
      h1Count: document.querySelectorAll('h1').length,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      imageCount: images.length,
      inViewportImageCount: inViewportImages.length,
      missingVisibleAlt: images.filter((image) => image.visible && image.alt === null).map((image) => image.src),
      overlayText: ['Unhandled Runtime Error', 'Application error', 'Build Error'].filter((text) => bodyText.includes(text)),
      roleCounts,
      title: document.title,
    };
  }, viewportLabel);

  const failures = [];
  if (result.blankBody) failures.push('blank body');
  if (result.h1Count !== 1) failures.push(`expected one h1, found ${result.h1Count}`);
  if (result.horizontalOverflow) failures.push('horizontal overflow');
  if (result.overlayText.length > 0) failures.push(`framework overlay text: ${result.overlayText.join(', ')}`);
  if (result.brokenInViewportImages.length > 0) failures.push(`broken first viewport images: ${result.brokenInViewportImages.join(', ')}`);
  if (result.missingVisibleAlt.length > 0) failures.push(`visible images missing alt: ${result.missingVisibleAlt.join(', ')}`);
  if (result.clippedMedia.length > 0) failures.push(`clipped mobile media: ${JSON.stringify(result.clippedMedia)}`);
  if (routeConsoleMessages.length > 0) {
    failures.push(`console warnings/errors: ${routeConsoleMessages.map((message) => `${message.type}: ${message.text}`).join(' | ')}`);
  }

  return {
    failures,
    result,
    route,
    viewport: viewportLabel,
  };
}

async function checkInteractions(page) {
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto(routeUrl('/yum-kitchen'), { waitUntil: 'load' });
  await clickButtonByName(page, 'Open navigation');
  await settle();
  const navState = await page.evaluate(() => ({
    hasExpandedNav: document.body.innerText.includes('our story') && document.body.innerText.includes('gift cards'),
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  }));

  await page.goto(routeUrl('/yum-kitchen'), { waitUntil: 'load' });
  await clickButtonByName(page, 'Start Order');
  await settle();
  const modalState = await page.evaluate(() => ({
    dialogText: document.querySelector('[role="dialog"]')?.textContent?.slice(0, 200),
    hasDialog: Boolean(document.querySelector('[role="dialog"]')),
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    modalRoleCount: document.querySelectorAll('[class*="motion-role-modal"]').length,
  }));

  await page.goto(routeUrl('/logo-animation'), { waitUntil: 'load' });
  await clickButtonByName(page, 'Replay');
  await settle();
  const logoState = await page.evaluate(() => ({
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    imagesLoaded: Array.from(document.images).every((image) => {
      const rect = image.getBoundingClientRect();
      return rect.width === 0 || (image.complete && image.naturalWidth > 0);
    }),
    replayVisible: Array.from(document.querySelectorAll('button')).some((button) => button.textContent?.includes('Replay')),
  }));

  const failures = [];
  if (!navState.hasExpandedNav) failures.push('mobile navigation did not reveal expected nav links');
  if (navState.horizontalOverflow) failures.push('mobile navigation introduced horizontal overflow');
  if (!modalState.hasDialog) failures.push('order modal dialog did not mount');
  if (modalState.modalRoleCount === 0) failures.push('order modal did not expose motion role classes');
  if (modalState.horizontalOverflow) failures.push('order modal introduced horizontal overflow');
  if (!logoState.replayVisible) failures.push('logo replay control disappeared');
  if (!logoState.imagesLoaded) failures.push('logo animation image did not load');
  if (logoState.horizontalOverflow) failures.push('logo animation introduced horizontal overflow');

  return {
    failures,
    logoState,
    modalState,
    navState,
  };
}

async function checkReducedMotion(page) {
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

  const rows = [];
  for (const route of reducedMotionRoutes) {
    await page.goto(routeUrl(route), { waitUntil: 'load' });
    await settle();

    const items = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[class*="motion-role-"]')).map((element) => {
        const style = getComputedStyle(element);
        return {
          animationName: style.animationName,
          className: String(element.className).slice(0, 120),
          transform: style.transform,
          transitionDuration: style.transitionDuration,
        };
      }),
    );

    const active = items.filter(
      (item) =>
        item.animationName !== 'none' ||
        hasPositiveDuration(item.transitionDuration) ||
        !isIdentityTransform(item.transform),
    );

    rows.push({
      active,
      route,
      roleCount: items.length,
    });
  }

  await page.emulateMediaFeatures([]);
  return rows;
}

const browser = await puppeteer.launch({
  args: ['--no-sandbox'],
  headless: 'new',
});

const failures = [];
const visualRows = [];
const consoleMessages = [];
let currentRoute = '';
let currentViewport = '';

try {
  const page = await browser.newPage();
  page.on('console', (message) => {
    if (['error', 'warning', 'warn'].includes(message.type())) {
      consoleMessages.push({
        route: currentRoute,
        text: message.text(),
        type: message.type(),
        viewport: currentViewport,
      });
    }
  });

  for (const viewport of viewports) {
    await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: 1 });
    for (const route of routes) {
      currentRoute = route;
      currentViewport = viewport.label;
      const beforeCount = consoleMessages.length;
      const row = await checkVisualRoute(page, route, viewport.label, consoleMessages.slice(beforeCount));
      visualRows.push(row);
      for (const failure of row.failures) failures.push(`${viewport.label} ${route}: ${failure}`);
    }
  }

  const interactionResult = await checkInteractions(page);
  for (const failure of interactionResult.failures) failures.push(`interaction: ${failure}`);

  const reducedMotionRows = await checkReducedMotion(page);
  for (const row of reducedMotionRows) {
    if (row.active.length > 0) {
      failures.push(`reduced motion ${row.route}: active role motion remains ${JSON.stringify(row.active)}`);
    }
  }

  if (failures.length > 0) {
    console.error('Rendered visual/motion audit failed:');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  } else {
    const visualChecks = routes.length * viewports.length;
    const totalImages = visualRows.reduce((sum, row) => sum + row.result.imageCount, 0);
    const routesWithMotionRoles = visualRows.filter((row) => Object.keys(row.result.roleCounts).length > 0).length;
    console.log(
      `Rendered visual/motion audit passed: ${visualChecks} route/viewport checks, ${totalImages} image instances, ${routesWithMotionRoles} checks with motion roles, ${reducedMotionRows.length} reduced-motion routes.`,
    );
  }
} finally {
  await browser.close();
}
