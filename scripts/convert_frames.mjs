// Colour-match the rendered bottle PNGs to the product photo, convert to WebP, delete the PNGs.
//
//   npm run frames
//
// 1. scripts/match_colour.py fits a 3D LUT (render -> photo) on frame 1 and writes
//    colour-matched copies to public/bottle/_matched/{desktop,mobile}/.
// 2. public/bottle/_matched/desktop/####.png -> public/bottle/desktop/####.webp (1000x1500)
//    public/bottle/_matched/mobile/####.png  -> public/bottle/mobile/####.webp  (600x900)
//    If no mobile PNG exists for a frame, it is downscaled from the matched desktop PNG.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readdir, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = path.resolve(import.meta.dirname, "..");
const root = path.join(projectRoot, "public", "bottle");
const desktopDir = path.join(root, "desktop");
const mobileDir = path.join(root, "mobile");
const matchedDir = path.join(root, "_matched");
// Alpha quality dominates file size; 60 keeps both sets inside budget (6 MB / 2.5 MB).
const QUALITY = 75;
const ALPHA_QUALITY = 60;

const venvPython = path.join(projectRoot, ".venv", process.platform === "win32" ? "Scripts/python.exe" : "bin/python");
const python = existsSync(venvPython) ? venvPython : "python";
const match = spawnSync(python, ["-I", path.join(projectRoot, "scripts", "match_colour.py"), "--report"], { stdio: "inherit" });
if (match.status !== 0) {
  console.error("Colour match failed — see above. Install requirements with: python -m venv .venv && .venv/Scripts/pip install -r scripts/requirements.txt");
  process.exit(1);
}

await mkdir(mobileDir, { recursive: true });

const exists = (p) => stat(p).then(() => true, () => false);
const pngs = (await readdir(path.join(matchedDir, "desktop"))).filter((f) => f.endsWith(".png")).sort();

for (const file of pngs) {
  const src = path.join(matchedDir, "desktop", file);
  const name = file.replace(/\.png$/, ".webp");
  const mobileSrc = path.join(matchedDir, "mobile", file);

  await sharp(src).webp({ quality: QUALITY, alphaQuality: ALPHA_QUALITY, effort: 6 }).toFile(path.join(desktopDir, name));

  const mobileInput = (await exists(mobileSrc)) ? mobileSrc : src;
  await sharp(mobileInput)
    .resize(600, 900, { kernel: "lanczos3" })
    .webp({ quality: QUALITY, alphaQuality: ALPHA_QUALITY, effort: 6 })
    .toFile(path.join(mobileDir, name));

  // The rendered PNGs are no longer needed; the fitted LUT is kept in scripts/colour_lut.npy.
  await rm(path.join(desktopDir, file), { force: true });
  await rm(path.join(mobileDir, file), { force: true });
  process.stdout.write(".");
}
await rm(matchedDir, { recursive: true, force: true });

async function total(dir) {
  const files = (await readdir(dir)).filter((f) => f.endsWith(".webp"));
  let bytes = 0;
  for (const f of files) bytes += (await stat(path.join(dir, f))).size;
  return `${files.length} frames, ${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

console.log(`\ndesktop: ${await total(desktopDir)}  (target <= 6 MB)`);
console.log(`mobile:  ${await total(mobileDir)}  (target <= 2.5 MB)`);
