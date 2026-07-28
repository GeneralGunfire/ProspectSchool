import sharp from 'sharp';

// Generates Android adaptive-icon source assets in resources/ for
// @capacitor/assets to build every density bucket from:
//   - resources/icon-foreground.png: the logo mark alone, transparent bg,
//     padded to Android's adaptive-icon safe zone (mark should occupy
//     roughly the center 66% to avoid being clipped by circle/squircle/
//     rounded-square OS masks across different launchers)
//   - resources/icon-background.png: solid dark plate, matches the
//     desktop app icon's #050708 brand-dark background
//   - resources/icon.png: flat combined icon, used for legacy (pre-Android
//     8) devices that don't support adaptive icons
const SIZE = 1024;
const FOREGROUND_SCALE = 0.5; // logo occupies ~50% of canvas (safe zone)
const logoSize = Math.round(SIZE * FOREGROUND_SCALE);
const offset = Math.round((SIZE - logoSize) / 2);

const background = Buffer.from(
  `<svg width="${SIZE}" height="${SIZE}">
    <defs>
      <linearGradient id="plate" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a0d10"/>
        <stop offset="50%" stop-color="#050708"/>
        <stop offset="100%" stop-color="#0a0d10"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="${SIZE}" height="${SIZE}" fill="url(#plate)"/>
  </svg>`,
);

await sharp(background).png().toFile('resources/icon-background.png');

const logo = await sharp('public/logo-dark-mode.png')
  .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toBuffer();

await sharp({
  create: { width: SIZE, height: SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite([{ input: logo, left: offset, top: offset }])
  .png()
  .toFile('resources/icon-foreground.png');

// Flat combined icon for legacy devices — reuse the same dark-plate +
// logo composite as the desktop app icon (src-tauri/icons/icon-master.png
// generation, larger scale since there's no adaptive-icon safe zone here).
const flatLogo = await sharp('public/logo-dark-mode.png')
  .resize(Math.round(SIZE * 0.7), Math.round(SIZE * 0.7), { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toBuffer();
const flatOffset = Math.round((SIZE - SIZE * 0.7) / 2);

await sharp(background)
  .composite([{ input: flatLogo, left: flatOffset, top: flatOffset }])
  .png()
  .toFile('resources/icon.png');

console.log('resources/icon-foreground.png, icon-background.png, icon.png written');
