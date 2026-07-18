import {execFileSync} from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import {homedir, tmpdir} from "node:os";
import {dirname, extname, join, resolve} from "node:path";
import {fileURLToPath} from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const resolveRenderer = () => {
  if (process.env.CREATIVE_PRODUCTION_REVIEW_RENDERER) {
    const configured = resolve(process.env.CREATIVE_PRODUCTION_REVIEW_RENDERER);
    if (!existsSync(configured)) throw new Error(`Creative Production renderer not found: ${configured}`);
    return configured;
  }

  const rendererRoot = join(homedir(), ".codex", "plugins", "cache", "openai-curated-remote", "creative-production");
  if (!existsSync(rendererRoot)) return undefined;
  return readdirSync(rendererRoot, {withFileTypes: true})
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(rendererRoot, entry.name, "scripts", "review_renderer.py"))
    .filter(existsSync)
    .sort((left, right) => right.localeCompare(left, undefined, {numeric: true}))[0];
};

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const renderFallback = (outDir, manifestPath, optionsPath) => {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const options = JSON.parse(readFileSync(optionsPath, "utf8"));
  const cards = manifest.map((item) => `
    <a class="card" href="${escapeHtml(item.href)}">
      <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.title)}">
      <strong>${escapeHtml(item.title)}</strong>
      <span>${escapeHtml(item.label)}</span>
    </a>`).join("");

  writeFileSync(join(outDir, "review-board.html"), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(options.title)}</title><style>
body{margin:0;background:#cae4fd;color:#8f1c24;font-family:Arial,sans-serif}header{padding:32px 4vw;border-bottom:8px solid #dc3439}h1{margin:0;font-family:Georgia,serif;font-weight:400}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:18px;padding:24px 4vw}.card{display:grid;gap:8px;color:inherit;text-decoration:none}.card img{display:block;width:100%;aspect-ratio:4/5;object-fit:cover;background:#fff}.card strong{font-family:Georgia,serif;font-size:20px;font-weight:400}.card span{font-size:14px;font-weight:700;text-transform:uppercase}
</style></head><body><header><h1>${escapeHtml(options.title)}</h1><p>${escapeHtml(options.summary)}</p></header><main class="grid">${cards}</main></body></html>\n`);

  const staging = mkdtempSync(join(tmpdir(), "yum-review-"));
  try {
    manifest.forEach((item, index) => {
      const source = resolve(outDir, item.src);
      if (!existsSync(source)) throw new Error(`Review image not found: ${source}`);
      copyFileSync(source, join(staging, `${String(index + 1).padStart(3, "0")}${extname(source)}`));
    });
    const columns = Math.max(1, Math.ceil(Math.sqrt(manifest.length * 1.25)));
    const rows = Math.max(1, Math.ceil(manifest.length / columns));
    execFileSync("ffmpeg", [
      "-y", "-pattern_type", "glob", "-i", join(staging, "*"),
      "-vf", `scale=320:320:force_original_aspect_ratio=decrease,pad=320:320:(ow-iw)/2:(oh-ih)/2:color=cae4fd,tile=${columns}x${rows}`,
      "-frames:v", "1", join(outDir, options.contactSheetOutput ?? "contact-sheet.png"),
    ], {stdio: "ignore"});
  } finally {
    rmSync(staging, {recursive: true, force: true});
  }
};

const renderer = resolveRenderer();
const renderBoard = (outDir) => {
  const manifestPath = join(outDir, "data", "review-manifest.json");
  const optionsPath = join(outDir, "data", "review-options.json");
  mkdirSync(outDir, {recursive: true});
  if (renderer) {
    execFileSync("python3", [
      renderer,
      "--out-dir", outDir,
      "--manifest", manifestPath,
      "--review-options", optionsPath,
      "--contact-sheet",
    ], {cwd: root, stdio: "inherit"});
  } else {
    renderFallback(outDir, manifestPath, optionsPath);
  }
};

renderBoard(root);
renderBoard(join(root, "carousel-review"));
console.log(`Built static and carousel review boards with ${renderer ? "Creative Production" : "the repo-local fallback"}.`);
