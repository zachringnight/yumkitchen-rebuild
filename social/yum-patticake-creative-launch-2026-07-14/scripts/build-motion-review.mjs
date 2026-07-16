import {execFileSync} from "node:child_process";
import {mkdirSync, readdirSync, writeFileSync} from "node:fs";
import {basename, dirname, extname, join, relative} from "node:path";
import {fileURLToPath} from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const reviewRoot = join(root, "motion-review");
const posters = join(reviewRoot, "posters");
mkdirSync(join(reviewRoot, "data"), {recursive: true});
mkdirSync(posters, {recursive: true});

const groups = [
  {folder: "motion-9x16-10s", label: "Primary 10s · 9:16"},
  {folder: "motion-9x16", label: "Cutdown 8s · 9:16"},
  {folder: "motion-4x5", label: "Feed motion · 4:5"},
  {folder: "motion-1x1", label: "Square motion · 1:1"},
  {folder: "motion-16x9", label: "Wide motion · 16:9"},
  {folder: "carousel-motion-9x16", label: "Carousel story · 9:16"},
  {folder: "carousel-motion-4x5", label: "Carousel story · 4:5"},
  {folder: "brand-motion", label: "Patticake brand motion", files: [
    "patticake-slice-logo-blue-4s-1x1.mp4",
    "patticake-slice-logo-blue-4s-4x5.mp4",
    "patticake-slice-logo-blue-4s-9x16.mp4",
  ]},
];

const review = [];
for (const group of groups) {
  const folder = join(root, "exports", group.folder);
  const videos = (group.files ?? readdirSync(folder).filter((name) => name.endsWith(".mp4"))).sort();
  for (const name of videos) {
    const video = join(folder, name);
    const id = `${group.folder}-${basename(name, extname(name))}`;
    const poster = join(posters, `${id}.jpg`);
    const duration = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", video], {encoding: "utf8"}).trim());
    execFileSync("ffmpeg", ["-y", "-ss", String(Math.max(0.5, duration * 0.68)), "-i", video, "-frames:v", "1", "-vf", "scale='min(720,iw)':-2", "-q:v", "2", poster], {stdio: "ignore"});
    review.push({
      id,
      index: review.length + 1,
      title: basename(name, extname(name)).replaceAll("-", " "),
      label: group.label,
      src: relative(reviewRoot, poster),
      href: relative(reviewRoot, video),
      caption: "Real photography · baby blue + logo red · silent master",
      family: group.label,
      bestFor: group.label,
    });
  }
}

writeFileSync(join(reviewRoot, "data", "review-manifest.json"), `${JSON.stringify(review, null, 2)}\n`);
writeFileSync(join(reviewRoot, "data", "review-options.json"), `${JSON.stringify({
  title: "yum! + Patticake motion launch pack",
  summary: `${review.length} rendered MP4 masters across vertical, feed, square, wide, carousel-derived stories, and animated Patticake logo formats.`,
  preset: "image-wall",
  showCaptions: true,
  minTileWidth: 230,
  contactSheetOutput: "contact-sheet.png",
}, null, 2)}\n`);

execFileSync("python3", [
  "/Users/zsoskin/.codex/plugins/cache/openai-curated-remote/creative-production/0.1.25/scripts/review_renderer.py",
  "--out-dir", reviewRoot,
  "--manifest", join(reviewRoot, "data", "review-manifest.json"),
  "--review-options", join(reviewRoot, "data", "review-options.json"),
  "--preset", "image-wall",
  "--contact-sheet",
], {cwd: root, stdio: "inherit"});

console.log(`Built motion review for ${review.length} MP4 masters.`);
