// One-off: pull product jars and photos out of the Figma export until the client
// supplies original photography (see TODO_CONTENT.md).
//
//   node scripts/extract_design_assets.mjs
//
// Jars sit on a flat sand panel in the product-page frames; the panel colour is
// "un-blended" into alpha (GIMP colour-to-alpha) so the jars work on any background.
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "design", "NEERAM___E-commerce_Website.png");
const OUT = path.join(ROOT, "public", "images");

const src = () => sharp(SRC, { limitInputPixels: false });

// Product-page frames: gallery panel region holding the jar.
const jars = {
  "malabar-tamarind": { left: 6570, top: 1480, width: 470, height: 630 },
  turmeric: { left: 4930, top: 6879, width: 470, height: 690 },
  "black-pepper": { left: 6568, top: 6879, width: 470, height: 690 },
  tamarind: { left: 8206, top: 6879, width: 470, height: 690 },
  shankupushpam: { left: 9850, top: 6879, width: 470, height: 690 },
};

const photos = {
  // Clean right-hand side of the "THE TEMPERING THAT STARTS IT." band.
  "tempering-pan": { left: 3141 + 720, top: 7755, width: 720, height: 680 },
  // Sambar on banana leaf, from "WHAT GOES INTO WHAT."
  sambar: { left: 4080, top: 4401, width: 380, height: 469 },
};

function colorToAlpha(data, bg, minAlpha) {
  for (let i = 0; i < data.length; i += 4) {
    let a = 0;
    for (let c = 0; c < 3; c++) {
      const v = data[i + c];
      const b = bg[c];
      const ca = v > b ? (v - b) / (255 - b) : (b - v) / b;
      if (ca > a) a = ca;
    }
    if (a < minAlpha) {
      data[i] = data[i + 1] = data[i + 2] = data[i + 3] = 0;
      continue;
    }
    for (let c = 0; c < 3; c++) {
      data[i + c] = Math.max(0, Math.min(255, Math.round((data[i + c] - bg[c]) / a + bg[c])));
    }
    data[i + 3] = Math.round(a * 255);
  }
}

await mkdir(path.join(OUT, "jars"), { recursive: true });
await mkdir(path.join(OUT, "photos"), { recursive: true });

for (const [slug, rect] of Object.entries(jars)) {
  const { data, info } = await src().extract(rect).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  // Panel colour sampled from the top-left corner of the crop.
  const bg = [data[0], data[1], data[2]];
  colorToAlpha(data, bg, 0.12);
  await sharp(data, { raw: info })
    .trim({ threshold: 1 })
    .webp({ quality: 88, alphaQuality: 90 })
    .toFile(path.join(OUT, "jars", `${slug}.webp`));
  console.log("jar", slug, bg);
}

for (const [name, rect] of Object.entries(photos)) {
  await src().extract(rect).webp({ quality: 85 }).toFile(path.join(OUT, "photos", `${name}.webp`));
  console.log("photo", name);
}

// Coconut oil cutout (supplied) -> web size.
const cutout = path.join(ROOT, "design", "Neeram_Coconut_Oil_Bottle_Cutout.png");
await sharp(cutout).trim({ threshold: 1 }).resize({ height: 1200, withoutEnlargement: true })
  .webp({ quality: 88, alphaQuality: 90 }).toFile(path.join(OUT, "jars", "coconut-oil.webp"));
// Gallery close-ups on the sand panel colour: label (logo + "Double filtered") and cap.
await mkdir(path.join(OUT, "gallery"), { recursive: true });
const trimmed = await sharp(cutout).trim({ threshold: 1 }).toBuffer();
const { width: cw, height: ch } = await sharp(trimmed).metadata();
const closeUps = { label: 0.5, cap: 0.0 };
for (const [name, topFrac] of Object.entries(closeUps)) {
  const size = Math.round(cw * 0.86);
  const crop = await sharp(trimmed)
    .extract({ left: Math.round((cw - size) / 2), top: Math.round(ch * topFrac), width: size, height: size })
    .resize(900, 900)
    .toBuffer();
  await sharp({ create: { width: 900, height: 900, channels: 3, background: "#E3DAC7" } })
    .composite([{ input: crop }])
    .webp({ quality: 85 })
    .toFile(path.join(OUT, "gallery", `coconut-oil-${name}.webp`));
}

// Open Graph image: bottle on cream, 1200x630.
const bottle = await sharp(cutout).trim({ threshold: 1 }).resize({ height: 560 }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#EEE8DC" } })
  .composite([{ input: bottle, gravity: "center" }])
  .jpeg({ quality: 85 })
  .toFile(path.join(ROOT, "public", "og-coconut-oil.jpg"));
console.log("coconut oil + og image");
