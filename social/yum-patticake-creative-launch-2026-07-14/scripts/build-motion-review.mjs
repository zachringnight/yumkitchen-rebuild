import {execFileSync} from "node:child_process";
import {existsSync, mkdirSync, readdirSync, writeFileSync} from "node:fs";
import {homedir} from "node:os";
import {basename, dirname, extname, join, relative} from "node:path";
import {fileURLToPath} from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const reviewRoot = join(root, "motion-review");
const posters = join(reviewRoot, "posters");
mkdirSync(join(reviewRoot, "data"), {recursive: true});
mkdirSync(posters, {recursive: true});

const groups = [
  {folder: "launch-motion-9x16-10s", label: "Launch moment hero · 9:16", posterAt: 0.34},
  {folder: "launch-motion-9x16-8s", label: "Launch moment cutdown · 9:16", posterAt: 0.34},
  {folder: "launch-motion-4x5", label: "Launch moment feed · 4:5", posterAt: 0.34},
  {folder: "launch-motion-1x1", label: "Launch moment square · 1:1", posterAt: 0.34},
  {folder: "launch-motion-16x9", label: "Launch moment wide · 16:9", posterAt: 0.34},
  {folder: "motion-9x16-10s", label: "Primary 10s · 9:16", posterAt: 0.88},
  {folder: "motion-9x16", label: "Cutdown 8s · 9:16", posterAt: 0.88},
  {folder: "motion-4x5", label: "Feed motion · 4:5", posterAt: 0.88},
  {folder: "motion-1x1", label: "Square motion · 1:1", posterAt: 0.88},
  {folder: "motion-16x9", label: "Wide motion · 16:9", posterAt: 0.88},
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
    execFileSync("ffmpeg", ["-y", "-ss", String(Math.max(0.5, duration * (group.posterAt ?? 0.68))), "-i", video, "-frames:v", "1", "-vf", "scale='min(720,iw)':-2", "-q:v", "2", poster], {stdio: "ignore"});
    review.push({
      id,
      index: review.length + 1,
      title: basename(name, extname(name)).replaceAll("-", " "),
      label: group.label,
      src: relative(reviewRoot, poster),
      href: relative(reviewRoot, video),
      caption: group.folder.startsWith("launch-motion")
        ? "Real launch moment · full-frame photography · baby blue + logo red · silent master"
        : "Real photography · baby blue + logo red · silent master",
      family: group.label,
      bestFor: group.label,
    });
  }
}

writeFileSync(join(reviewRoot, "data", "review-manifest.json"), `${JSON.stringify(review, null, 2)}\n`);
writeFileSync(join(reviewRoot, "data", "review-options.json"), `${JSON.stringify({
  title: "yum! + Patticake motion launch pack",
  summary: `${review.length} rendered MP4 masters across launch-moment films, vertical, feed, square, wide, carousel-derived stories, and animated Patticake logo formats.`,
  preset: "image-wall",
  showCaptions: true,
  minTileWidth: 230,
  contactSheetOutput: "contact-sheet.png",
}, null, 2)}\n`);

const rendererRoot = join(homedir(), ".codex", "plugins", "cache", "openai-curated-remote", "creative-production");
const installedRenderers = existsSync(rendererRoot)
  ? readdirSync(rendererRoot, {withFileTypes: true})
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(rendererRoot, entry.name, "scripts", "review_renderer.py"))
    .filter(existsSync)
    .sort((left, right) => right.localeCompare(left, undefined, {numeric: true}))
  : [];
const reviewRenderer = process.env.CREATIVE_PRODUCTION_REVIEW_RENDERER || installedRenderers[0];

if (reviewRenderer) {
  execFileSync("python3", [
    reviewRenderer,
    "--out-dir", reviewRoot,
    "--manifest", join(reviewRoot, "data", "review-manifest.json"),
    "--review-options", join(reviewRoot, "data", "review-options.json"),
    "--preset", "image-wall",
    "--contact-sheet",
  ], {cwd: root, stdio: "inherit"});
} else {
  const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  const cards = review.map((item) => `
    <a class="card" href="${escapeHtml(item.href)}">
      <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.title)} poster">
      <strong>${escapeHtml(item.title)}</strong>
      <span>${escapeHtml(item.label)}</span>
    </a>`).join("");
  writeFileSync(join(reviewRoot, "review-board.html"), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>yum! and Patticake motion review</title><style>
body{margin:0;background:#cae4fd;color:#8f1c24;font-family:Arial,sans-serif}header{padding:32px 4vw;border-bottom:8px solid #dc3439}h1{margin:0;font-family:Georgia,serif;font-weight:400}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:18px;padding:24px 4vw}.card{display:grid;gap:8px;color:inherit;text-decoration:none}.card img{display:block;width:100%;aspect-ratio:4/5;object-fit:cover;background:#fff}.card strong{font-family:Georgia,serif;font-size:20px;font-weight:400}.card span{font-size:14px;font-weight:700;text-transform:uppercase}
</style></head><body><header><h1>yum! and Patticake motion launch pack</h1><p>${review.length} rendered MP4 masters. Click any poster to play the source video.</p></header><main class="grid">${cards}</main></body></html>\n`);
  execFileSync("ffmpeg", [
    "-y", "-pattern_type", "glob", "-i", join(posters, "*.jpg"),
    "-vf", "scale=320:320:force_original_aspect_ratio=decrease,pad=320:320:(ow-iw)/2:(oh-ih)/2:color=cae4fd,tile=8x11",
    "-frames:v", "1", join(reviewRoot, "contact-sheet.png"),
  ], {stdio: "ignore"});
  console.log("Creative Production renderer not installed. Built the repo-local review fallback.");
}

console.log(`Built motion review for ${review.length} MP4 masters.`);
