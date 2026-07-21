import {execFileSync} from "node:child_process";
import {existsSync, readFileSync, readdirSync, writeFileSync} from "node:fs";
import {dirname, join, relative} from "node:path";
import {fileURLToPath} from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const specs = JSON.parse(readFileSync(join(root, "src", "specs.json"), "utf8"));
const launchMomentSpecs = JSON.parse(readFileSync(join(root, "src", "launch-moment-specs.json"), "utf8"));
const manifest = JSON.parse(readFileSync(join(root, "manifest.json"), "utf8"));
const creativeLaunchSource = readFileSync(join(root, "src", "CreativeLaunch.tsx"), "utf8");
const launchMomentSource = readFileSync(join(root, "src", "LaunchMoment.tsx"), "utf8");
const motionReviewSource = readFileSync(join(root, "scripts", "build-motion-review.mjs"), "utf8");
const renderAllSource = readFileSync(join(root, "scripts", "render-all.mjs"), "utf8");
const packageSource = readFileSync(join(root, "scripts", "package-delivery.sh"), "utf8");
const socialSourceOfTruth = readFileSync(join(root, "..", "START-HERE.md"), "utf8");
const fullToolkitGenerator = readFileSync(join(root, "..", "scripts", "build_full_social_toolkit.py"), "utf8");
const retiredLaunchBuilder = readFileSync(join(root, "..", "scripts", "build_social_launch_batch.py"), "utf8");
const retiredMotionPackBuilder = readFileSync(join(root, "..", "scripts", "build_social_motion_pack.py"), "utf8");
const retiredMotionTemplateBuilder = readFileSync(join(root, "..", "scripts", "build_2026_social_motion_template.py"), "utf8");
const retiredInstagramReadme = readFileSync(join(root, "..", "instagram", "README.md"), "utf8");
const retiredInstagramBuilder = readFileSync(join(root, "..", "..", "yumkitchen-web", "scripts", "render-instagram-templates.mjs"), "utf8");
const retiredMotionPackReadme = readFileSync(join(root, "..", "yum-patticake-social-motion-pack", "README.md"), "utf8");
const retiredMotionTemplateReadme = readFileSync(join(root, "..", "yum-social-motion-template-2026", "README.md"), "utf8");
const agentContract = readFileSync(join(root, "..", "..", "AGENTS.md"), "utf8");
const carouselCardSource = readFileSync(join(root, "src", "CarouselCard.tsx"), "utf8");
const carouselMotionSource = readFileSync(join(root, "src", "CarouselMotion.tsx"), "utf8");
const carouselSpecsSource = readFileSync(join(root, "src", "carousel-specs.json"), "utf8");
const activeCreativeProductionStatePaths = [
  "run-state.json",
  "moodboard-widget-payload.json",
  "data/stream.json",
  "motion-review/run-state.json",
  "motion-review/moodboard-widget-payload.json",
  "motion-review/data/stream.json",
  "carousel-review/run-state.json",
  "carousel-review/moodboard-widget-payload.json",
  "carousel-review/data/stream.json",
];
const launchPosterFractions = Array.from(
  motionReviewSource.matchAll(/folder: "launch-motion-[^"]+"[^}]+posterAt: ([0-9.]+)/g),
  (match) => Number(match[1]),
);
const creativeLayoutChecks = {
  photoAreaReserved: creativeLaunchSource.includes("const photoRight = isWide ? panelWidth : 0") && creativeLaunchSource.includes("const photoBottom = isWide ? 0 : panelHeight") && creativeLaunchSource.includes('width: "auto"') && creativeLaunchSource.includes('height: "auto"') && creativeLaunchSource.includes('overflow: "hidden"'),
  noLegacyPhotoCopyBox: !creativeLaunchSource.includes("bottom: isWide ? 54 : 216"),
  noTextGlow: !creativeLaunchSource.includes("textShadow") && !creativeLaunchSource.includes("drop-shadow"),
  launchMomentsKeepCopyOffPhotography: launchMomentSource.includes("const PhotoScene") && launchMomentSource.includes("const MessageScene") && !/const PhotoScene[\s\S]*?message/.test(launchMomentSource.split("const MessageScene")[0]),
  launchMomentsUseFullFramePhotos: launchMomentSource.includes('width: "100%"') && launchMomentSource.includes('height: "100%"') && launchMomentSource.includes('objectFit: "cover"'),
  launchMomentsStayBlueAndRed: launchMomentSource.includes('blue: "#cae4fd"') && launchMomentSource.includes('red: "#dc3439"') && !launchMomentSource.includes("#fffdf7") && !launchMomentSource.includes("#2d2d2d"),
  launchMomentsHaveNoGlowOrStickerLayer: !launchMomentSource.includes("textShadow") && !launchMomentSource.includes("drop-shadow") && !launchMomentSource.includes("boxShadow"),
  launchMomentsUseExactNationwideCopy: launchMomentSpecs.some((spec) => spec.hook === "patticake is now available nationwide."),
  launchMomentsHoldReadableAction: launchMomentSource.includes("const sceneWeights = [0.15, 0.125, 0.15, 0.125, 0.15, 0.3]") && launchMomentSource.includes("const actionIn = interpolate(frame, [4, 12]"),
  adobeFinishedSourcesArePreserved: ["yum-packaging-counter-adobe.png", "yum-bakery-gift-boxes-adobe.png", "yum-chef-kitchen-adobe.png"].every((name) => existsSync(join(root, "public", "images", name))),
  logoPlayerInsidePanel: creativeLaunchSource.includes("left: isWide ? width - panelWidth + safeX : safeX"),
  compactMotionPanelSafe: creativeLaunchSource.includes(": isSquare ? 540 : isFeed ? 610 : 700") && creativeLaunchSource.includes("isSquare ? 82 : isFeed ? 88"),
  stableReviewPosters: motionReviewSource.includes('posterAt: 0.88'),
  stableLaunchReviewPosters: launchPosterFractions.length === 5 && launchPosterFractions.every((fraction) => fraction >= 0.31 && fraction <= 0.36),
  twoSecondCtaHold: creativeLaunchSource.includes('const ctaStart = isShortsCut ? 7.45 : 5.45'),
  staticReviewBoardsRefreshWithMetadata: renderAllSource.includes('render-static-reviews.mjs'),
  staleDeliveryBundlesAreQuarantined: packageSource.includes('archive/prior-dated-bundles') && packageSource.includes('archive/prior-dated-staging'),
  deliveryZipChecksumsArePublished: packageSource.includes('> "$OUT/SHA256SUMS.txt"') && packageSource.includes('shasum -a 256 "$file"'),
  brandMotionBundleRefreshesFromCurrentExports: packageSource.includes('"$OUT/patticake-slice-logo-motion.zip"') && packageSource.includes('cd "$ROOT/exports/brand-motion"'),
  launchMomentBundleRefreshesFromCurrentExports: packageSource.includes('"$OUT/yum-patticake-launch-moments.zip"') && packageSource.includes('cd "$ROOT"') && packageSource.includes("exports/launch-motion-9x16-10s"),
  allCarouselSetsHaveDeliveryBundles: [
    "yum-pick-your-kitchen-carousel.zip",
    "yum-feed-the-room-carousel.zip",
    "patticake-send-cake-carousel.zip",
    "patticake-meet-patticake-carousel.zip",
    "patticake-how-to-patticake-carousel.zip",
    "patticake-occasions-carousel.zip",
  ].every((name) => packageSource.includes(name) && renderAllSource.includes(name)),
  staleVisualPacksAreRetired: socialSourceOfTruth.includes("yum-social-launch-batch-2026-07/") && socialSourceOfTruth.includes("instagram/") && socialSourceOfTruth.includes("Do not rerender or publish"),
  retiredLaunchBuilderFailsClosed: retiredLaunchBuilder.includes("ALLOW_RETIRED_YUM_LAUNCH_BATCH_REBUILD") && retiredLaunchBuilder.includes("Retired builder blocked"),
  retiredInstagramKitIsNotPublishable: retiredInstagramReadme.includes("Historical and superseded") && retiredInstagramReadme.includes("Do not rerender or publish"),
  retiredInstagramBuilderFailsClosed: retiredInstagramBuilder.includes("ALLOW_RETIRED_YUM_INSTAGRAM_REBUILD") && retiredInstagramBuilder.includes("Retired builder blocked"),
  retiredMotionPacksAreNotPublishable: [retiredMotionPackReadme, retiredMotionTemplateReadme].every((source) => source.includes("Historical and superseded") && source.includes("Do not rerender or publish")),
  retiredMotionBuildersFailClosed: retiredMotionPackBuilder.includes("ALLOW_RETIRED_YUM_MOTION_PACK_REBUILD") && retiredMotionTemplateBuilder.includes("ALLOW_RETIRED_YUM_MOTION_TEMPLATE_REBUILD"),
  fullToolkitCannotRegenerateCardOverlays: fullToolkitGenerator.includes("dedicated baby-blue field") && fullToolkitGenerator.includes("Never place the copy field over the photograph") && !fullToolkitGenerator.includes("white headline card") && !fullToolkitGenerator.includes("Text cards:"),
  historicalToolkitBoardIsPreserved: fullToolkitGenerator.includes('Path("review-assets")') && fullToolkitGenerator.includes('Path("review-board.html")') && fullToolkitGenerator.includes("if not preserved_review:"),
  staleCreativeProductionSessionsAreQuarantined: activeCreativeProductionStatePaths.every((relativePath) => !existsSync(join(root, relativePath))) && existsSync(join(root, "archive", "creative-production-snapshots-2026-07-16", "README.md")),
  activeReviewOptionsRemainReproducible: ["data/review-options.json", "motion-review/data/review-options.json", "carousel-review/data/review-options.json"].every((relativePath) => existsSync(join(root, relativePath))),
  agentContractRoutesSocialWorkToSourceOfTruth: agentContract.includes("social/START-HERE.md") && agentContract.includes("must not be rerendered or published"),
  carouselCountersOffPhotos: !carouselCardSource.includes("top: 58") && !carouselCardSource.includes("top: 735") && carouselCardSource.includes('alignItems: "baseline"'),
  carouselPlayerInsidePanel: !carouselMotionSource.includes("bottom: panelHeight - Math.round(badgeSize / 2)") && carouselMotionSource.includes("bottom: isFeed ? 28 : 38"),
  noRetiredNewHomeFraming: !/new[ -]home/i.test(carouselSpecsSource) && carouselSpecsSource.includes("launch-01-nationwide"),
  retiredThreeWaysFramingCannotRebuild: !retiredMotionPackBuilder.includes("one cake, three ways to share it") && retiredMotionPackBuilder.includes("cake, delivered with love"),
  thankYouUsesNeutralCakeProof: !specs.find((spec) => spec.id === "patticake-thank-you")?.images.includes("06_8inch_a.jpg"),
};

const jobs = [];
const assetSetChecks = [];
const canonicalNames = specs.map((spec) => `${spec.id}.mp4`).sort();
const launchMomentNames = launchMomentSpecs.map((spec) => `${spec.id}.mp4`).sort();
const checkAssetSet = (folder, expectedNames, extension) => {
  const actualNames = readdirSync(join(root, "exports", folder)).filter((file) => !extension || file.endsWith(extension)).sort();
  const expectedNameSet = new Set(expectedNames);
  const actualNameSet = new Set(actualNames);
  const missing = expectedNames.filter((name) => !actualNameSet.has(name));
  const unexpected = actualNames.filter((name) => !expectedNameSet.has(name));
  assetSetChecks.push({folder, expected: expectedNames.length, actual: actualNames.length, missing, unexpected, pass: missing.length === 0 && unexpected.length === 0});
  return actualNames;
};

const addFolder = (folder, expected, expectedNames = canonicalNames) => {
  const actualNames = checkAssetSet(folder, expectedNames, ".mp4");

  for (const name of actualNames) {
    jobs.push({path: join(root, "exports", folder, name), ...expected});
  }
};

addFolder("motion-9x16-10s", {width: 1080, height: 1920, duration: 10, codec: "h264", pixFmt: "yuv420p", bt709: true});
addFolder("motion-9x16", {width: 1080, height: 1920, duration: 8, codec: "h264", pixFmt: "yuv420p", bt709: true});
addFolder("motion-4x5", {width: 1080, height: 1350, duration: 8, codec: "h264", pixFmt: "yuv420p", bt709: true});
addFolder("motion-1x1", {width: 1080, height: 1080, duration: 8, codec: "h264", pixFmt: "yuv420p", bt709: true});
addFolder("motion-16x9", {width: 1280, height: 720, duration: 8, codec: "h264", pixFmt: "yuv420p", bt709: true});
addFolder("launch-motion-9x16-10s", {width: 1080, height: 1920, duration: 10, codec: "h264", pixFmt: "yuv420p", bt709: true}, launchMomentNames);
addFolder("launch-motion-9x16-8s", {width: 1080, height: 1920, duration: 8, codec: "h264", pixFmt: "yuv420p", bt709: true}, launchMomentNames);
addFolder("launch-motion-4x5", {width: 1080, height: 1350, duration: 8, codec: "h264", pixFmt: "yuv420p", bt709: true}, launchMomentNames);
addFolder("launch-motion-1x1", {width: 1080, height: 1080, duration: 8, codec: "h264", pixFmt: "yuv420p", bt709: true}, launchMomentNames);
addFolder("launch-motion-16x9", {width: 1280, height: 720, duration: 8, codec: "h264", pixFmt: "yuv420p", bt709: true}, launchMomentNames);

const staticNames = specs.map((spec) => `${spec.id}.png`).sort();
for (const folder of ["story-9x16", "feed-4x5", "square-1x1", "wide-16x9", "link-1.91x1", "pin-2x3"]) {
  checkAssetSet(folder, staticNames, ".png");
}

const carouselSetIds = [...new Set(manifest.carousels.map((card) => card.setId))].sort();
for (const setId of carouselSetIds) {
  const expectedNames = manifest.carousels
    .filter((card) => card.setId === setId)
    .map((card) => `${String(card.card).padStart(2, "0")}-${card.id}.png`)
    .sort();
  checkAssetSet(join("carousel-4x5", setId), expectedNames, ".png");
}
checkAssetSet("carousel-motion-9x16", carouselSetIds.map((setId) => `${setId}.mp4`), ".mp4");
checkAssetSet("carousel-motion-4x5", carouselSetIds.map((setId) => `${setId}.mp4`), ".mp4");
checkAssetSet("brand-motion", [
  "patticake-slice-logo-blue-4s-1x1.mp4",
  "patticake-slice-logo-blue-4s-4x5.mp4",
  "patticake-slice-logo-blue-4s-9x16.mp4",
  "patticake-slice-logo-lockup.png",
  "patticake-slice-logo-transparent-prores4444.mov",
  "patticake-slice-logo-transparent.webm",
].sort());

for (const set of manifest.carouselMotion) {
  jobs.push({path: join(root, set.outputs.reel), width: 1080, height: 1920, duration: set.durations.reelSeconds, codec: "h264", pixFmt: "yuv420p", bt709: true});
  jobs.push({path: join(root, set.outputs.feed), width: 1080, height: 1350, duration: set.durations.feedSeconds, codec: "h264", pixFmt: "yuv420p", bt709: true});
}

for (const brand of [
  {name: "patticake-slice-logo-blue-4s-1x1.mp4", width: 1080, height: 1080},
  {name: "patticake-slice-logo-blue-4s-9x16.mp4", width: 1080, height: 1920},
  {name: "patticake-slice-logo-blue-4s-4x5.mp4", width: 1080, height: 1350},
]) {
  jobs.push({path: join(root, "exports", "brand-motion", brand.name), width: brand.width, height: brand.height, duration: 4, codec: "h264", pixFmt: "yuv420p", bt709: true});
}
jobs.push({path: join(root, manifest.brandMotion.outputs.transparentWebm), width: 1080, height: 1080, duration: 4, codec: "vp9", alphaTag: true});
jobs.push({path: join(root, manifest.brandMotion.outputs.transparentMov), width: 1080, height: 1080, duration: 4, codec: "prores", alphaPixels: true});

const results = jobs.map((job) => {
  const probe = JSON.parse(execFileSync("ffprobe", [
    "-v", "error",
    "-show_entries", "stream=index,codec_type,codec_name,width,height,pix_fmt,color_space:stream_tags=alpha_mode:format=duration",
    "-of", "json",
    job.path,
  ], {encoding: "utf8"}));
  const video = probe.streams.find((stream) => stream.codec_type === "video");
  const audio = probe.streams.filter((stream) => stream.codec_type === "audio");
  const duration = Number(probe.format.duration);
  const checks = {
    dimensions: video.width === job.width && video.height === job.height,
    duration: Math.abs(duration - job.duration) < 0.02,
    codec: video.codec_name === job.codec,
    noAudio: audio.length === 0,
    pixelFormat: job.pixFmt ? video.pix_fmt === job.pixFmt : true,
    colorSpace: job.bt709 ? video.color_space === "bt709" : true,
    alpha: job.alphaTag ? video.tags?.alpha_mode === "1" : job.alphaPixels ? video.pix_fmt.startsWith("yuva") : true,
  };
  return {
    path: relative(root, job.path),
    expected: {width: job.width, height: job.height, duration: job.duration, codec: job.codec},
    actual: {width: video.width, height: video.height, duration, codec: video.codec_name, pixFmt: video.pix_fmt, colorSpace: video.color_space ?? null, audioStreams: audio.length, alphaMode: video.tags?.alpha_mode ?? null},
    checks,
    pass: Object.values(checks).every(Boolean),
  };
});

const report = {
  generated: new Date().toISOString(),
  scope: "All delivered Yum and Patticake motion masters, including real launch-moment films",
  expectedCounts: {socialLanes: specs.length, launchMomentFilms: launchMomentSpecs.length, canonicalMotionMasters: manifest.counts.canonicalMotionMasters, optionalCutdowns: manifest.counts.optionalMotionCutdowns},
  totals: {files: results.length, passed: results.filter((result) => result.pass).length, failed: results.filter((result) => !result.pass).length},
  assetSetChecks,
  creativeLayoutChecks,
  results,
};

writeFileSync(join(root, "motion-qa-report.json"), `${JSON.stringify(report, null, 2)}\n`);
if (report.totals.failed > 0 || assetSetChecks.some((check) => !check.pass) || !Object.values(creativeLayoutChecks).every(Boolean)) {
  console.error(JSON.stringify({totals: report.totals, assetSetChecks, creativeLayoutChecks}));
  process.exit(1);
}
console.log(JSON.stringify({totals: report.totals, assetSetChecks, creativeLayoutChecks}));
