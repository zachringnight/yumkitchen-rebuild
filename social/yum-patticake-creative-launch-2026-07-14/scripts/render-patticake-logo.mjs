import {execFileSync} from "node:child_process";
import {mkdirSync} from "node:fs";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const bin = join(root, "node_modules", ".bin", "remotion");
const entry = join(root, "src", "index.tsx");
const output = join(root, "exports", "brand-motion");
const qa = join(root, "qa-frames", "patticake-slice-logo");

mkdirSync(output, {recursive: true});
mkdirSync(qa, {recursive: true});

const run = (args) => execFileSync(bin, args, {cwd: root, stdio: "inherit"});
const socialVideoArgs = [
  "--codec=h264",
  "--crf=16",
  "--x264-preset=medium",
  "--gop=60",
  "--pixel-format=yuv420p",
  "--color-space=bt709",
  "--image-format=png",
  "--muted",
  "--concurrency=4",
];

for (const master of [
  {composition: "Patticake-Slice-Logo-Blue", filename: "patticake-slice-logo-blue-4s-1x1.mp4"},
  {composition: "Patticake-Slice-Logo-Blue-Vertical", filename: "patticake-slice-logo-blue-4s-9x16.mp4"},
  {composition: "Patticake-Slice-Logo-Blue-Feed", filename: "patticake-slice-logo-blue-4s-4x5.mp4"},
]) {
  run([
    "render",
    entry,
    master.composition,
    join(output, master.filename),
    ...socialVideoArgs,
  ]);
}

run([
  "render",
  entry,
  "Patticake-Slice-Logo-Transparent",
  join(output, "patticake-slice-logo-transparent.webm"),
  "--codec=vp9",
  "--pixel-format=yuva420p",
  "--image-format=png",
  "--muted",
  "--concurrency=4",
]);

run([
  "render",
  entry,
  "Patticake-Slice-Logo-Transparent",
  join(output, "patticake-slice-logo-transparent-prores4444.mov"),
  "--codec=prores",
  "--prores-profile=4444",
  "--pixel-format=yuva444p10le",
  "--image-format=png",
  "--muted",
  "--concurrency=4",
]);

run([
  "still",
  entry,
  "Patticake-Slice-Logo-Lockup",
  join(output, "patticake-slice-logo-lockup.png"),
  "--image-format=png",
]);

for (const frame of [24, 52, 82, 116]) {
  run([
    "still",
    entry,
    "Patticake-Slice-Logo-Blue",
    join(qa, `frame-${String(frame).padStart(3, "0")}.png`),
    `--frame=${frame}`,
    "--image-format=png",
  ]);
}

const deliveryZip = join(root, "delivery-zips", "patticake-slice-logo-motion.zip");
mkdirSync(join(root, "delivery-zips"), {recursive: true});
execFileSync("zip", [
  "-j",
  "-FS",
  "-X",
  deliveryZip,
  join(output, "patticake-slice-logo-blue-4s-1x1.mp4"),
  join(output, "patticake-slice-logo-blue-4s-9x16.mp4"),
  join(output, "patticake-slice-logo-blue-4s-4x5.mp4"),
  join(output, "patticake-slice-logo-transparent.webm"),
  join(output, "patticake-slice-logo-transparent-prores4444.mov"),
  join(output, "patticake-slice-logo-lockup.png"),
], {cwd: root, stdio: "inherit"});
