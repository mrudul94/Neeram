"""Render the Neeram bottle 360° turn as transparent PNG frames.

Usage (from the project root):
    blender -b blender/Neeram_Bottle.blend -P scripts/render_bottle.py
    blender -b blender/Neeram_Bottle.blend -P scripts/render_bottle.py -- --frames 1-1

The look (oil, label, lights, world, exposure, cap) lives in the .blend, tuned to match
public/bottle/bottle-still.png. This script changes only what the frame sequence needs:
rotation, the floor shadow, transparency, sampling and output size.

The turn does not rely on the .blend's keyframes (which may not load in an older
Blender): for frame f the bottle's Z rotation is set to 2π × (f − 1) / 120 directly.

Options (after `--`):
    --frames A-B     Frame range (default 1-120).
    --out DIR        Output root (default public/bottle); frames go to DIR/desktop.

Renders the 1000x1500 desktop set only; `npm run frames` downscales it for mobile.
Existing frames are skipped, so an interrupted render resumes when re-run.
Then run `npm run frames` to colour-match and convert the PNGs to WebP.
"""
import math
import os
import sys

import bpy

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
FRAME_COUNT = 120
WIDTH, HEIGHT = 1000, 1500
SAMPLES = 48

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []


def opt(name, default):
    return argv[argv.index(name) + 1] if name in argv else default


frame_start, frame_end = (int(x) for x in opt("--frames", f"1-{FRAME_COUNT}").split("-"))
out_dir = os.path.join(os.path.abspath(os.path.join(ROOT, opt("--out", "public/bottle"))), "desktop")

scene = bpy.context.scene
bottle = bpy.data.objects["Neeram_Bottle"]
# Drive the rotation ourselves; keyframes would override it on frame change.
bottle.animation_data_clear()

# The bottle floats and travels on the page, so the baked floor shadow is dropped;
# the site draws a CSS shadow instead.
shadow = bpy.data.objects.get("Shadow_Catcher")
if shadow:
    shadow.hide_render = True

scene.render.engine = "CYCLES"
# Transparent background around the bottle, but glass is rendered against the scene so
# the oil keeps its colour (transparent glass washes it out to a pale, blown yellow).
scene.render.film_transparent = True
scene.cycles.film_transparent_glass = False
scene.render.resolution_x = WIDTH
scene.render.resolution_y = HEIGHT
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.image_settings.color_depth = "8"

cycles = scene.cycles
cycles.samples = SAMPLES
cycles.use_denoising = True
# Keep the scene in memory between frames; only the bottle's rotation changes.
scene.render.use_persistent_data = True

# Prefer a GPU backend; fall back to CPU.
prefs = bpy.context.preferences.addons["cycles"].preferences
device = "CPU"
for backend in ("OPTIX", "CUDA", "HIP", "ONEAPI", "METAL"):
    try:
        prefs.compute_device_type = backend
        prefs.get_devices()
    except Exception:
        continue
    gpus = [d for d in prefs.devices if d.type == backend]
    if gpus:
        for d in prefs.devices:
            d.use = d.type == backend
        device = "GPU"
        print(f"[render_bottle] using {backend}: {[d.name for d in gpus]}")
        break
cycles.device = device
if device == "CPU":
    print("[render_bottle] no supported GPU found, rendering on CPU")

os.makedirs(out_dir, exist_ok=True)
for f in range(frame_start, frame_end + 1):
    path = os.path.join(out_dir, f"{f:04d}.png")
    if os.path.exists(path):
        continue
    bottle.rotation_euler.z = 2 * math.pi * (f - 1) / FRAME_COUNT
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
    print(f"[render_bottle] frame {f}/{frame_end} done", flush=True)
