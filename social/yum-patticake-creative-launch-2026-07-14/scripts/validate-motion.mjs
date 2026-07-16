import {execFileSync} from "node:child_process";
import {readdirSync, writeFileSync} from "node:fs";
import {dirname, join, relative} from "node:path";
import {fileURLToPath} from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const specs = JSON.parse(await import("node:fs").then(({readFileSync}) => readFileSync(join(root, "src", "specs.json"), "utf8")));
const manifest = JSON.parse(await import("node:fs").then(({readFileSync}) => readFileSync(join(root, "manifest.json"), "utf8")));

const jobs = [];
const addFolder = (folder, expected) => {
  for (const name of readdirSync(join(root, "exports", folder)).filter((file) => file.endsWith(".mp4")).sort()) {
    jobs.push({path: join(root, "exports", folder, name), ...expected});
  }
};

addFolder("motion-9x16-10s", {width: 1080, height: 1920, duration: 10, codec: "h264", pixFmt: "yuv420p", bt709: true});
addFolder("motion-9x16", {width: 1080, height: 1920, duration: 8, codec: "h264", pixFmt: "yuv420p", bt709: true});
addFolder("motion-4x5", {width: 1080, height: 1350, duration: 8, codec: "h264", pixFmt: "yuv420p", bt709: true});
addFolder("motion-1x1", {width: 1080, height: 1080, duration: 8, codec: "h264", pixFmt: "yuv420p", bt709: true});
addFolder("motion-16x9", {width: 1280, height: 720, duration: 8, codec: "h264", pixFmt: "yuv420p", bt709: true});

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
  scope: "All delivered Yum and Patticake motion masters",
  expectedCounts: {socialLanes: specs.length, canonicalMotionMasters: manifest.counts.canonicalMotionMasters, optionalCutdowns: manifest.counts.optionalMotionCutdowns},
  totals: {files: results.length, passed: results.filter((result) => result.pass).length, failed: results.filter((result) => !result.pass).length},
  results,
};

writeFileSync(join(root, "motion-qa-report.json"), `${JSON.stringify(report, null, 2)}\n`);
if (report.totals.failed > 0) {
  console.error(JSON.stringify(report.totals));
  process.exit(1);
}
console.log(JSON.stringify(report.totals));
