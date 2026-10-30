// Dev helper: colour-matched WebP previews of the PNG frames rendered so far, keeping the
// PNGs so an in-progress Blender render can keep resuming. `npm run frames` does the real
// conversion (and deletes the PNGs).
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { readdir, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = path.resolve(import.meta.dirname, "..");
const root = path.join(projectRoot, "public", "bottle");
const matched = path.join(root, "_matched", "desktop");

const venvPython = path.join(projectRoot, ".venv", process.platform === "win32" ? "Scripts/python.exe" : "bin/python");
const python = existsSync(venvPython) ? venvPython : "python";
const run = spawnSync(python, ["-I", path.join(projectRoot, "scripts", "match_colour.py")], { stdio: "inherit" });
if (run.status !== 0) process.exit(1);

mkdirSync(path.join(root, "mobile"), { recursive: true });
const pngs = (await readdir(matched)).filter((f) => f.endsWith(".png"));
for (const f of pngs) {
  const src = path.join(matched, f);
  const name = f.replace(".png", ".webp");
  await sharp(src).webp({ quality: 75, alphaQuality: 60 }).toFile(path.join(root, "desktop", name));
  await sharp(src).resize(600, 900).webp({ quality: 75, alphaQuality: 60 }).toFile(path.join(root, "mobile", name));
}
await rm(path.join(root, "_matched"), { recursive: true, force: true });
console.log(`previewed ${pngs.length} colour-matched frames`);
