import sharp from 'sharp';

// Renders the app icon: a dark rounded-square plate (matching the brand's
// #050708 dark accent) as a "box", with public/logo-dark-mode.png (the
// real brand mark, not a redrawn approximation) composited on top at a
// reduced scale so it has breathing room and stays legible down to 16px.
const SIZE = 1024;
const LOGO_SCALE = 0.7; // logo occupies ~70% of the plate width
const logoSize = Math.round(SIZE * LOGO_SCALE);
const offset = Math.round((SIZE - logoSize) / 2);

const plate = Buffer.from(
  `<svg width="${SIZE}" height="${SIZE}">
    <defs>
      <linearGradient id="plate" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a0d10"/>
        <stop offset="50%" stop-color="#050708"/>
        <stop offset="100%" stop-color="#0a0d10"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="${SIZE}" height="${SIZE}" rx="${Math.round(SIZE * 0.219)}" fill="url(#plate)"/>
  </svg>`,
);

const logo = await sharp('public/logo-dark-mode.png')
  .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toBuffer();

await sharp(plate)
  .composite([{ input: logo, left: offset, top: offset }])
  .png()
  .toFile('src-tauri/icons/icon-master.png');

console.log('src-tauri/icons/icon-master.png written');
