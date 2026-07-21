import {execFileSync} from 'node:child_process';
import {copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, statSync, writeFileSync} from 'node:fs';
import {basename, dirname, extname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const webRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const packRoot = join(webRoot, '..', 'social', 'yum-patticake-creative-launch-2026-07-14');
const reviewRoot = join(packRoot, 'motion-review');
const sourceManifest = JSON.parse(readFileSync(join(reviewRoot, 'data', 'review-manifest.json'), 'utf8'));
const creativeManifest = JSON.parse(readFileSync(join(packRoot, 'manifest.json'), 'utf8'));
const publicRoot = join(webRoot, 'public', 'review-assets');
const videoRoot = join(publicRoot, 'videos');
const posterRoot = join(publicRoot, 'posters');
const dataPath = join(webRoot, 'app', 'asset-gallery', 'assets.json');
const retiredRoot = join(publicRoot, 'archive', 'retired-review-assets');

mkdirSync(videoRoot, {recursive: true});
mkdirSync(posterRoot, {recursive: true});
mkdirSync(retiredRoot, {recursive: true});

const titleMap = {
  'patticake birthday': 'birthday cake, handled.',
  'patticake event': 'cake for the table.',
  'patticake gift drop': 'send cake, not a card.',
  'yum catering room': 'feed the room.',
  'yum four kitchens': 'four kitchens. pick your yum!',
  'yum lunch decision': 'what should we eat?',
  'yum people behind the plate': 'meet the people behind yum!',
  'feed the room': 'feed the room.',
  'pick your kitchen': 'pick your yum.',
  'send cake': 'send cake.',
  'patticake slice logo blue 4s 1x1': 'patticake slice logo',
  'patticake slice logo blue 4s 4x5': 'patticake slice logo',
  'patticake slice logo blue 4s 9x16': 'patticake slice logo',
};

for (const item of creativeManifest.assets) titleMap[item.id.replaceAll('-', ' ')] = item.hook;
for (const item of creativeManifest.launchMoments ?? []) titleMap[item.id.replaceAll('-', ' ')] = item.hook;
titleMap['meet patticake'] = 'patticake is now available nationwide.';
titleMap['how to patticake'] = 'start with the note.';
titleMap['patticake occasions'] = 'every good reason for cake.';

const staticFormats = {
  story: {filter: 'vertical', collection: 'Story still', format: '9:16'},
  feed: {filter: 'feed', collection: 'Feed still', format: '4:5'},
  square: {filter: 'square', collection: 'Square still', format: '1:1'},
  wide: {filter: 'wide', collection: 'Wide still', format: '16:9'},
  link: {filter: 'wide', collection: 'Link still', format: '1.91:1'},
  pin: {filter: 'vertical', collection: 'Pinterest still', format: '2:3'},
};

function groupFor(label, id) {
  if (label.startsWith('Launch moment')) {
    return {
      filter: 'launch',
      collection: 'Launch moment',
      format: label.includes('9:16') ? '9:16' : label.includes('4:5') ? '4:5' : label.includes('1:1') ? '1:1' : '16:9',
    };
  }
  if (label.startsWith('Primary')) return {filter: 'vertical', collection: 'Primary vertical', format: '9:16'};
  if (label.startsWith('Cutdown')) return {filter: 'vertical', collection: 'Vertical cutdown', format: '9:16'};
  if (label.startsWith('Feed motion')) return {filter: 'feed', collection: 'Feed motion', format: '4:5'};
  if (label.startsWith('Square motion')) return {filter: 'square', collection: 'Square motion', format: '1:1'};
  if (label.startsWith('Wide motion')) return {filter: 'wide', collection: 'Wide motion', format: '16:9'};
  if (label.startsWith('Carousel story')) return {filter: 'stories', collection: 'Motion story', format: label.includes('9:16') ? '9:16' : '4:5'};
  return {filter: 'brand', collection: 'Brand motion', format: id.includes('9x16') ? '9:16' : id.includes('4x5') ? '4:5' : '1:1'};
}

function needsRefresh(source, output) {
  try {
    return statSync(output).mtimeMs < statSync(source).mtimeMs;
  } catch {
    return true;
  }
}

const assets = sourceManifest.map((item) => {
  const sourceVideo = resolve(reviewRoot, item.href);
  const sourcePoster = resolve(reviewRoot, item.src);
  const outputVideo = join(videoRoot, `${item.id}.mp4`);
  const outputPoster = join(posterRoot, `${item.id}.jpg`);

  if (needsRefresh(sourceVideo, outputVideo)) {
    execFileSync('ffmpeg', [
      '-y', '-i', sourceVideo,
      '-an',
      '-vf', "scale='min(540,iw)':-2",
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '25',
      '-pix_fmt', 'yuv420p',
      '-colorspace', 'bt709',
      '-color_primaries', 'bt709',
      '-color_trc', 'bt709',
      '-movflags', '+faststart',
      outputVideo,
    ], {stdio: 'ignore'});
  }

  if (needsRefresh(sourcePoster, outputPoster)) copyFileSync(sourcePoster, outputPoster);

  const probe = JSON.parse(execFileSync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'stream=width,height:format=duration',
    '-of', 'json',
    outputVideo,
  ], {encoding: 'utf8'}));
  const group = groupFor(item.label, item.id);
  const normalizedTitle = item.title.toLowerCase();
  const launchMoment = (creativeManifest.launchMoments ?? []).find((entry) => entry.id.replaceAll('-', ' ') === normalizedTitle);

  return {
    id: item.id,
    title: titleMap[normalizedTitle] ?? normalizedTitle,
    filename: `${item.id}.mp4`,
    label: item.label.replaceAll('·', '/'),
    collection: group.collection,
    filter: group.filter,
    format: group.format,
    brand: launchMoment ? (launchMoment.brand === 'patticake' ? 'Patticake' : 'yum!') : normalizedTitle.includes('patticake') || normalizedTitle === 'send cake' ? 'Patticake' : 'yum!',
    kind: 'motion',
    duration: Number(Number(probe.format.duration).toFixed(1)),
    width: probe.streams[0].width,
    height: probe.streams[0].height,
    media: `/review-assets/videos/${item.id}.mp4`,
    poster: `/review-assets/posters/${item.id}.jpg`,
  };
});

function buildImagePreview(source, output) {
  if (needsRefresh(source, output)) {
    execFileSync('magick', [source, '-auto-orient', '-resize', '900x900>', '-quality', '88', output], {stdio: 'ignore'});
  }
  const [width, height] = execFileSync('magick', ['identify', '-format', '%w %h', output], {encoding: 'utf8'}).trim().split(' ').map(Number);
  return {width, height};
}

for (const item of creativeManifest.assets) {
  for (const [key, group] of Object.entries(staticFormats)) {
    const source = resolve(packRoot, item.outputs[key]);
    const id = `static-${key}-${item.id}`;
    const output = join(posterRoot, `${id}.jpg`);
    const dimensions = buildImagePreview(source, output);
    assets.push({
      id,
      title: item.hook,
      filename: `${item.id}.png`,
      label: `${group.collection} / ${group.format}`,
      collection: group.collection,
      filter: group.filter,
      format: group.format,
      brand: item.brand === 'patticake' ? 'Patticake' : 'yum!',
      kind: 'static',
      duration: null,
      ...dimensions,
      media: `/review-assets/posters/${id}.jpg`,
      poster: `/review-assets/posters/${id}.jpg`,
    });
  }
}

for (const card of creativeManifest.carousels) {
  const source = resolve(packRoot, card.output);
  const id = `carousel-card-${card.id}`;
  const output = join(posterRoot, `${id}.jpg`);
  const dimensions = buildImagePreview(source, output);
  assets.push({
    id,
    title: card.headline,
    filename: card.output.split('/').at(-1),
    label: `${card.setTitle} / ${card.card} of ${card.total}`,
    collection: 'Carousel card',
    filter: 'carousel',
    format: '4:5',
    brand: card.brand === 'patticake' ? 'Patticake' : 'yum!',
    kind: 'static',
    duration: null,
    ...dimensions,
    media: `/review-assets/posters/${id}.jpg`,
    poster: `/review-assets/posters/${id}.jpg`,
  });
}

function archiveUnexpected(folder, expectedNames) {
  for (const name of readdirSync(folder)) {
    if (expectedNames.has(name)) continue;
    const source = join(folder, name);
    const extension = extname(name);
    const stem = basename(name, extension);
    let target = join(retiredRoot, name);
    if (existsSync(target)) target = join(retiredRoot, `${stem}-${Math.round(statSync(source).mtimeMs)}${extension}`);
    renameSync(source, target);
  }
}

archiveUnexpected(
  videoRoot,
  new Set(assets.filter((asset) => asset.kind === 'motion').map((asset) => basename(asset.media))),
);
archiveUnexpected(
  posterRoot,
  new Set(assets.map((asset) => basename(asset.poster))),
);

writeFileSync(dataPath, `${JSON.stringify(assets, null, 2)}\n`);
console.log(`Synced ${assets.length} review assets to ${publicRoot}`);
