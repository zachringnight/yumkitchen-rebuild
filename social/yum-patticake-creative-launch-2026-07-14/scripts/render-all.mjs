import {execFileSync} from "node:child_process";
import {mkdirSync, readFileSync, writeFileSync} from "node:fs";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const bin = join(root, "node_modules", ".bin", "remotion");
const entry = join(root, "src", "index.tsx");
const specs = JSON.parse(readFileSync(join(root, "src", "specs.json"), "utf8"));
const launchMomentSpecs = JSON.parse(readFileSync(join(root, "src", "launch-moment-specs.json"), "utf8"));
const carouselSpecs = JSON.parse(readFileSync(join(root, "src", "carousel-specs.json"), "utf8"));
const renderOnlyIds = new Set(
  (process.env.RENDER_ONLY ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
);
const renderOnlyCarouselSets = new Set(
  (process.env.RENDER_CAROUSEL_ONLY ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
);
const renderOnlyLaunchMomentIds = new Set(
  (process.env.RENDER_LAUNCH_ONLY ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
);
const renderSpecs = renderOnlyIds.size > 0
  ? specs.filter((spec) => renderOnlyIds.has(spec.id))
  : specs;
const renderLaunchMomentSpecs = renderOnlyLaunchMomentIds.size > 0
  ? launchMomentSpecs.filter((spec) => renderOnlyLaunchMomentIds.has(spec.id))
  : launchMomentSpecs;
const renderCarouselSpecs = renderOnlyCarouselSets.size > 0
  ? carouselSpecs.filter((card) => renderOnlyCarouselSets.has(card.setId))
  : carouselSpecs;
const formats = [
  {suffix: "story", folder: "story-9x16"},
  {suffix: "feed", folder: "feed-4x5"},
  {suffix: "square", folder: "square-1x1"},
  {suffix: "wide", folder: "wide-16x9"},
  {suffix: "link", folder: "link-1.91x1"},
  {suffix: "pin", folder: "pin-2x3"},
];
const carouselMotionSets = [
  {setId: "pick-your-kitchen", reelSeconds: 10, feedSeconds: 8},
  {setId: "feed-the-room", reelSeconds: 8.5, feedSeconds: 7.5},
  {setId: "send-cake", reelSeconds: 9, feedSeconds: 8},
  {setId: "meet-patticake", reelSeconds: 9, feedSeconds: 8},
  {setId: "how-to-patticake", reelSeconds: 9, feedSeconds: 8},
  {setId: "patticake-occasions", reelSeconds: 9, feedSeconds: 8},
];
const renderCarouselMotionSets = renderOnlyCarouselSets.size > 0
  ? carouselMotionSets.filter((set) => renderOnlyCarouselSets.has(set.setId))
  : carouselMotionSets;
const renderMode = process.env.RENDER_METADATA_ONLY === "1"
  ? "metadata"
  : process.env.RENDER_LAUNCH_MOTION_ONLY === "1"
    ? "launch-moment"
  : process.env.RENDER_ALL_MOTION_ONLY === "1"
    ? "all-motion"
  : process.env.RENDER_FORMAT_MOTION_ONLY === "1"
    ? "format-motion"
  : process.env.RENDER_CAROUSEL_MOTION_ONLY === "1"
    ? "carousel-motion"
  : process.env.RENDER_CAROUSELS_ONLY === "1"
  ? "carousels"
  : process.env.RENDER_SHORTS_ONLY === "1"
    ? "shorts"
    : process.env.RENDER_STILLS_ONLY === "1"
      ? "stills"
      : process.env.RENDER_MOTION_ONLY === "1"
        ? "motion"
        : "all";
const renderMotion = renderMode === "all" || renderMode === "motion";
const renderStills = renderMode === "all" || renderMode === "stills";
const renderShorts = renderMode === "all" || renderMode === "shorts";
const renderCarousels = renderMode === "all" || renderMode === "carousels";
const renderFormatMotion = renderMode === "all" || renderMode === "all-motion" || renderMode === "format-motion";
const renderCarouselMotion = renderMode === "all" || renderMode === "all-motion" || renderMode === "carousel-motion";
const renderLaunchMoments = renderMode === "all" || renderMode === "all-motion" || renderMode === "launch-moment";
const renderVerticalMotion = renderMotion || renderMode === "all-motion";
const renderPrimaryMotion = renderShorts || renderMode === "all-motion";

for (const folder of [
  "motion-9x16",
  "motion-9x16-10s",
  "motion-4x5",
  "motion-1x1",
  "motion-16x9",
  "carousel-motion-9x16",
  "carousel-motion-4x5",
  "launch-motion-9x16-10s",
  "launch-motion-9x16-8s",
  "launch-motion-4x5",
  "launch-motion-1x1",
  "launch-motion-16x9",
  "carousel-4x5",
  ...formats.map((item) => item.folder),
]) {
  mkdirSync(join(root, "exports", folder), {recursive: true});
}
mkdirSync(join(root, "data"), {recursive: true});

const run = (args) => execFileSync(bin, args, {cwd: root, stdio: "inherit"});
const socialVideoArgs = [
  "--codec=h264",
  "--crf=18",
  "--x264-preset=medium",
  "--gop=60",
  "--pixel-format=yuv420p",
  "--color-space=bt709",
  "--image-format=png",
  "--muted",
  "--concurrency=4",
];

for (const spec of renderSpecs) {
  if (renderVerticalMotion) {
    run([
      "render",
      entry,
      `${spec.id}-motion`,
      join(root, "exports", "motion-9x16", `${spec.id}.mp4`),
      ...socialVideoArgs,
    ]);
  }

  if (renderPrimaryMotion) {
    run([
      "render",
      entry,
      `${spec.id}-shorts`,
      join(root, "exports", "motion-9x16-10s", `${spec.id}.mp4`),
      ...socialVideoArgs,
    ]);
  }

  if (renderFormatMotion) {
    for (const format of [
      {composition: `${spec.id}-feed-motion`, folder: "motion-4x5"},
      {composition: `${spec.id}-square-motion`, folder: "motion-1x1"},
      {composition: `${spec.id}-wide-motion`, folder: "motion-16x9"},
    ]) {
      run([
        "render",
        entry,
        format.composition,
        join(root, "exports", format.folder, `${spec.id}.mp4`),
        ...socialVideoArgs,
      ]);
    }
  }

  if (renderStills) {
    for (const format of formats) {
      run([
        "still",
        entry,
        `${spec.id}-${format.suffix}`,
        join(root, "exports", format.folder, `${spec.id}.png`),
        "--image-format=png",
      ]);
    }
  }
}

if (renderLaunchMoments) {
  for (const spec of renderLaunchMomentSpecs) {
    for (const format of [
      {composition: `${spec.id}-launch-10s`, folder: "launch-motion-9x16-10s"},
      {composition: `${spec.id}-launch-8s`, folder: "launch-motion-9x16-8s"},
      {composition: `${spec.id}-launch-feed`, folder: "launch-motion-4x5"},
      {composition: `${spec.id}-launch-square`, folder: "launch-motion-1x1"},
      {composition: `${spec.id}-launch-wide`, folder: "launch-motion-16x9"},
    ]) {
      run([
        "render",
        entry,
        format.composition,
        join(root, "exports", format.folder, `${spec.id}.mp4`),
        ...socialVideoArgs,
      ]);
    }
  }
}

if (renderCarouselMotion) {
  for (const set of renderCarouselMotionSets) {
    run([
      "render",
      entry,
      `carousel-${set.setId}-motion-reel`,
      join(root, "exports", "carousel-motion-9x16", `${set.setId}.mp4`),
      ...socialVideoArgs,
    ]);
    run([
      "render",
      entry,
      `carousel-${set.setId}-motion-feed`,
      join(root, "exports", "carousel-motion-4x5", `${set.setId}.mp4`),
      ...socialVideoArgs,
    ]);
  }
}

if (renderCarousels) {
  for (const card of renderCarouselSpecs) {
    const setFolder = join(root, "exports", "carousel-4x5", card.setId);
    mkdirSync(setFolder, {recursive: true});
    run([
      "still",
      entry,
      `carousel-${card.id}`,
      join(setFolder, `${String(card.card).padStart(2, "0")}-${card.id}.png`),
      "--image-format=png",
    ]);
  }
}

const manifest = {
  name: "yum! and Patticake creative launch pack",
  created: new Date().toISOString(),
  source: "current high-resolution Yum site and social photography plus the consolidated Patticake design system dated 2026-07-09, with three real Yum photographs finished through Adobe auto tone on 2026-07-21",
  system: {
    colors: {
      babyBlue: "#cae4fd",
      logoRed: "#dc3439",
      ribbonRedDeep: "#8f1c24"
    },
    type: {display: "Trocchi 400", utility: "Archivo Narrow 400/700"},
    signature: "unobstructed real photography beside or above a dedicated baby-blue field, one message at a time, logo-red action, and active logo player"
  },
  counts: {
    lanes: specs.length,
    videos8s: specs.length,
    videos10s: specs.length,
    motion4x5: specs.length,
    motion1x1: specs.length,
    motion16x9: specs.length,
    carouselMotion9x16: carouselMotionSets.length,
    carouselMotion4x5: carouselMotionSets.length,
    launchMomentFilms: launchMomentSpecs.length,
    launchMomentMasters: launchMomentSpecs.length * 4,
    launchMomentCutdowns: launchMomentSpecs.length,
    canonicalMotionMasters: specs.length * 4 + launchMomentSpecs.length * 4 + carouselMotionSets.length * 2 + 5,
    optionalMotionCutdowns: specs.length + launchMomentSpecs.length,
    totalMotionFiles: specs.length * 5 + launchMomentSpecs.length * 5 + carouselMotionSets.length * 2 + 5,
    staticExports: specs.length * formats.length,
    carouselSets: new Set(carouselSpecs.map((card) => card.setId)).size,
    carouselCards: carouselSpecs.length
  },
  publishing: {
    platformGuide: "platform-publishing.md",
    carouselOrder: "carousel-publishing.md",
    captionsAndAltText: "social-copy-and-alt-text.md"
  },
  deliveryBundles: [
    "delivery-zips/yum-pick-your-kitchen-carousel.zip",
    "delivery-zips/yum-feed-the-room-carousel.zip",
    "delivery-zips/patticake-send-cake-carousel.zip",
    "delivery-zips/patticake-meet-patticake-carousel.zip",
    "delivery-zips/patticake-how-to-patticake-carousel.zip",
    "delivery-zips/patticake-occasions-carousel.zip",
    "delivery-zips/yum-people-behind-the-plate-social.zip",
    "delivery-zips/yum-patticake-motion-8s.zip",
    "delivery-zips/yum-patticake-motion-10s.zip",
    "delivery-zips/patticake-slice-logo-motion.zip",
    "delivery-zips/yum-patticake-launch-moments.zip",
    "delivery-zips/yum-patticake-creative-launch-motion-2026-07-21.zip",
    "delivery-zips/patticake-com-launch-rollout-2026-07-21.zip"
  ],
  assets: specs.map((spec) => ({
    ...spec,
    outputs: {
      motion8s: `exports/motion-9x16/${spec.id}.mp4`,
      motion10s: `exports/motion-9x16-10s/${spec.id}.mp4`,
      motion4x5: `exports/motion-4x5/${spec.id}.mp4`,
      motion1x1: `exports/motion-1x1/${spec.id}.mp4`,
      motion16x9: `exports/motion-16x9/${spec.id}.mp4`,
      story: `exports/story-9x16/${spec.id}.png`,
      feed: `exports/feed-4x5/${spec.id}.png`,
      square: `exports/square-1x1/${spec.id}.png`,
      wide: `exports/wide-16x9/${spec.id}.png`,
      link: `exports/link-1.91x1/${spec.id}.png`,
      pin: `exports/pin-2x3/${spec.id}.png`
    }
  })),
  launchMoments: launchMomentSpecs.map((spec) => ({
    ...spec,
    outputs: {
      motion10s: `exports/launch-motion-9x16-10s/${spec.id}.mp4`,
      motion8s: `exports/launch-motion-9x16-8s/${spec.id}.mp4`,
      motion4x5: `exports/launch-motion-4x5/${spec.id}.mp4`,
      motion1x1: `exports/launch-motion-1x1/${spec.id}.mp4`,
      motion16x9: `exports/launch-motion-16x9/${spec.id}.mp4`,
    },
  })),
  carousels: carouselSpecs.map((card) => ({
    ...card,
    output: `exports/carousel-4x5/${card.setId}/${String(card.card).padStart(2, "0")}-${card.id}.png`
  })),
  carouselMotion: carouselMotionSets.map((set) => ({
    setId: set.setId,
    outputs: {
      reel: `exports/carousel-motion-9x16/${set.setId}.mp4`,
      feed: `exports/carousel-motion-4x5/${set.setId}.mp4`,
    },
    durations: {reelSeconds: set.reelSeconds, feedSeconds: set.feedSeconds},
  })),
  brandMotion: {
    concept: "Real Patticake slice resolves into a simplified three-layer brand mark and yum! lockup.",
    sourcePhoto: "public/images/layers_slice_vertical.jpg",
    outputs: {
      squareMp4: "exports/brand-motion/patticake-slice-logo-blue-4s-1x1.mp4",
      verticalMp4: "exports/brand-motion/patticake-slice-logo-blue-4s-9x16.mp4",
      feedMp4: "exports/brand-motion/patticake-slice-logo-blue-4s-4x5.mp4",
      transparentWebm: "exports/brand-motion/patticake-slice-logo-transparent.webm",
      transparentMov: "exports/brand-motion/patticake-slice-logo-transparent-prores4444.mov",
      lockupPng: "exports/brand-motion/patticake-slice-logo-lockup.png",
      deliveryZip: "delivery-zips/patticake-slice-logo-motion.zip",
    },
  }
};
writeFileSync(join(root, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

const review = specs.map((spec, index) => ({
  id: spec.id,
  index: index + 1,
  title: spec.hook,
  label: spec.lane,
  src: `exports/feed-4x5/${spec.id}.png`,
  href: `exports/motion-9x16-10s/${spec.id}.mp4`,
  caption: `${spec.brand} / ${spec.cta}`,
  family: spec.lane,
  bestFor: "Reels, Stories, feed, square, paid social, and wide social placements"
}));
writeFileSync(join(root, "data", "review-manifest.json"), `${JSON.stringify(review, null, 2)}\n`);
writeFileSync(join(root, "data", "review-options.json"), `${JSON.stringify({
  title: "yum! and Patticake creative launch pack",
  summary: `${specs.length} photo-first social lanes plus ${launchMomentSpecs.length} real launch-moment films, with true motion masters in 9:16, 4:5, 1:1, and 16:9, ${carouselMotionSets.length * 2} set-driven carousel motion cuts, and an active Patticake logo player.`,
  preset: "image-wall",
  showCaptions: true,
  contactSheetOutput: "contact-sheet.png"
}, null, 2)}\n`);

const carouselReviewRoot = join(root, "carousel-review");
mkdirSync(join(carouselReviewRoot, "data"), {recursive: true});
const carouselReview = carouselSpecs.map((card, index) => ({
  id: card.id,
  index: index + 1,
  title: card.headline,
  label: `${card.setTitle} · ${card.card}/${card.total}`,
  src: `../exports/carousel-4x5/${card.setId}/${String(card.card).padStart(2, "0")}-${card.id}.png`,
  href: `../exports/carousel-4x5/${card.setId}/${String(card.card).padStart(2, "0")}-${card.id}.png`,
  caption: card.role === "cta" ? `${card.brand} / ${card.cta}` : `${card.brand} / ${card.lane}`,
  family: card.setTitle,
  bestFor: "Instagram and Facebook carousel posts"
}));
writeFileSync(join(carouselReviewRoot, "data", "review-manifest.json"), `${JSON.stringify(carouselReview, null, 2)}\n`);
writeFileSync(join(carouselReviewRoot, "data", "review-options.json"), `${JSON.stringify({
  title: "yum! and Patticake swipe stories",
  summary: `${new Set(carouselSpecs.map((card) => card.setId)).size} packaging-led carousel sequences with real photography, one message per card, and a clear conversion close.`,
  preset: "image-wall",
  showCaptions: true,
  minTileWidth: 260,
  contactSheetOutput: "contact-sheet.png"
}, null, 2)}\n`);

const copy = ["# campaign copy", ""];
for (const spec of specs) {
  copy.push(`## ${spec.hook}`, "", spec.support, "", `Proof: ${spec.proof}`, `CTA: ${spec.cta}`, `Destination: ${spec.destination}`, "");
}
copy.push("## launch-moment motion", "");
for (const spec of launchMomentSpecs) {
  copy.push(`### ${spec.hook}`, "", ...spec.messages, "", `CTA: ${spec.cta}`, `Destination: ${spec.destination}`, `Use: ${spec.usage}`, "");
}
writeFileSync(join(root, "campaign-copy.md"), `${copy.join("\n").trimEnd()}\n`);

const carouselCopy = ["# carousel publishing order", ""];
for (const setId of [...new Set(carouselSpecs.map((card) => card.setId))]) {
  const cards = carouselSpecs.filter((card) => card.setId === setId);
  carouselCopy.push(`## ${cards[0].setTitle}`, "");
  for (const card of cards) {
    carouselCopy.push(`${card.card}. ${card.headline} - ${card.support}`);
  }
  const finalCard = cards[cards.length - 1];
  if (finalCard.destination) carouselCopy.push("", `Destination: ${finalCard.destination}`);
  carouselCopy.push("");
}
writeFileSync(join(root, "carousel-publishing.md"), `${carouselCopy.join("\n").trimEnd()}\n`);

execFileSync(process.execPath, [join(here, "render-static-reviews.mjs")], {cwd: root, stdio: "inherit"});
