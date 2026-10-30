"""Match the rendered bottle frames' colour to the product photo.

Run by `npm run frames` (before WebP conversion), or directly:
    .venv/Scripts/python scripts/match_colour.py            # fit (if frame 1 PNG exists) + apply
    .venv/Scripts/python scripts/match_colour.py --report   # also print before/after colour diffs

1. Fit: render frame 1 (public/bottle/desktop/0001.png) and public/bottle/bottle-still.png
   are pixel-aligned. Pixels opaque in both (alpha > 0.95), below the cap, are paired, and a
   17x17x17 RGB lookup table mapping render -> photo colour is fitted by least squares with a
   smoothness term. Anchors pin white to the label stock, the logo's red to the photo's
   red, and the lower oil / body above the label to their photo colours. Saved to
   scripts/colour_lut.npy so later runs can reuse it.
2. Apply: every PNG in public/bottle/{desktop,mobile}/ is mapped through the LUT, then given
   a mild saturation boost (bottle pixels only, label white and logo red left alone). RGB
   only, alpha untouched; written to public/bottle/_matched/<set>/ for convert_frames.mjs
   to turn into WebP.

Requires numpy and Pillow (scripts/requirements.txt).
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
BOTTLE = ROOT / "public" / "bottle"
RENDER_REF = BOTTLE / "desktop" / "0001.png"
PHOTO = BOTTLE / "bottle-still.png"
LUT_PATH = ROOT / "scripts" / "colour_lut.npy"
OUT = BOTTLE / "_matched"

N = 17  # LUT nodes per axis
ALPHA_MIN = 0.95
# The cap's printed pattern sits at a different rotation in the photo, so it is left out
# of the fit (rows above the shoulder, as a fraction of image height).
CAP_BOTTOM = 280 / 1500
SMOOTHNESS = 0.5  # second-difference penalty, relative to the average samples per node
IDENTITY_PRIOR = 0.02  # pulls the correction toward zero where there is no data
CLIP = 0.995  # render pixels with every channel above this are clipped white, not fitted
LABEL_WHITE = (244, 244, 250)  # plain label stock in the photo (flat area right of the logo)
WHITE_ANCHOR_SHARE = 0.05  # weight of the white -> label-stock anchor, as a share of samples
ANCHOR_REGIONS = ("lower oil", "body above label")  # see SPOTS
REGION_ANCHOR_SHARE = 0.05
ROBUST_ITERATIONS = 4
TUKEY_C = 0.15  # residual (0-1 RGB distance) beyond which a pair is ignored
# The red "Neeram" logo banner (x, y, w, h), below the coconut shell. The label artwork
# sits a few pixels differently in the photo, so per-pixel pairs here mostly land on the
# white letters; instead each image's own red pixels are averaged and the render's red
# is mapped onto the photo's, both as an anchor and as fixed-weight pairs.
LOGO_BOX = (380, 760, 240, 200)
LOGO_ANCHOR_SHARE = 0.05
# Mild saturation boost after the LUT, on the bottle only; near-white, near-neutral
# pixels (label stock) are left alone so the label does not tint.
SATURATION = 1.1


def load_rgba(path):
    return np.asarray(Image.open(path).convert("RGBA"), dtype=np.float64) / 255.0


def corners(rgb):
    """Trilinear interpolation: the 8 LUT node indices and weights for each colour."""
    x = np.clip(rgb, 0.0, 1.0) * (N - 1)
    i0 = np.minimum(np.floor(x).astype(np.int64), N - 2)
    t = x - i0
    idx, w = [], []
    for dr in (0, 1):
        for dg in (0, 1):
            for db in (0, 1):
                ir, ig, ib = i0[:, 0] + dr, i0[:, 1] + dg, i0[:, 2] + db
                idx.append((ir * N + ig) * N + ib)
                w.append(
                    (t[:, 0] if dr else 1 - t[:, 0])
                    * (t[:, 1] if dg else 1 - t[:, 1])
                    * (t[:, 2] if db else 1 - t[:, 2])
                )
    return np.stack(idx, 1), np.stack(w, 1)


def identity_lut():
    g = np.linspace(0, 1, N)
    r, gg, b = np.meshgrid(g, g, g, indexing="ij")
    return np.stack([r, gg, b], -1).reshape(-1, 3)


def second_difference_matrix():
    """Rows (L[i-1] - 2 L[i] + L[i+1]) along each axis, as a dense matrix."""
    rows = []
    def node(r, g, b):
        return (r * N + g) * N + b
    for r in range(N):
        for g in range(N):
            for b in range(N):
                for axis in range(3):
                    p = [r, g, b]
                    if not 0 < p[axis] < N - 1:
                        continue
                    lo, hi = p.copy(), p.copy()
                    lo[axis] -= 1
                    hi[axis] += 1
                    rows.append((node(*lo), node(r, g, b), node(*hi)))
    D = np.zeros((len(rows), N**3))
    for k, (a, c, e) in enumerate(rows):
        D[k, a], D[k, c], D[k, e] = 1.0, -2.0, 1.0
    return D


def pair_mask(render, photo):
    """Pixels opaque in both images, below the cap."""
    mask = (render[..., 3] > ALPHA_MIN) & (photo[..., 3] > ALPHA_MIN)
    mask[: int(render.shape[0] * CAP_BOTTOM)] = False
    return mask


def logo_red(img):
    """Solid red of the logo banner: letters, edges and anti-aliasing excluded."""
    x, y, w, h = LOGO_BOX
    r, g, b, a = np.moveaxis(img, -1, 0)
    red = (a > ALPHA_MIN) & (r > 0.7) & (g < 0.45) & (b < 0.45) & (r - g > 0.45)
    box = np.zeros_like(red)
    box[y : y + h, x : x + w] = True
    red &= box
    # Erode by 2 px so letter edges, which blend toward white, are not counted.
    for _ in range(2):
        red[1:-1, 1:-1] &= red[:-2, 1:-1] & red[2:, 1:-1] & red[1:-1, :-2] & red[1:-1, 2:]
    return red


def sample_pairs(render, photo):
    """Pixel pairs to fit, plus a flag for the logo-red pairs (never down-weighted)."""
    # Render pixels clipped to white on all channels (label stock, grey panel and
    # highlights all at 255) carry no colour information: the photo behind them averages
    # to a pinkish grey. They are left out; pure white is anchored to the label stock.
    render_red = logo_red(render)
    mask = (pair_mask(render, photo) & (render[..., :3].min(-1) < CLIP)) | render_red
    src, dst = render[mask][:, :3], photo[mask][:, :3].copy()
    # Logo pairs: the photo partner of each red render pixel is often a letter, so the
    # target is the render pixel scaled by the ratio of the two images' mean reds.
    is_logo = render_red[mask]
    ratio = photo[logo_red(photo)][:, :3].mean(0) / render[render_red][:, :3].mean(0)
    dst[is_logo] = np.clip(src[is_logo] * ratio, 0.0, 1.0)
    return src, dst, is_logo


def solve(idx, w, src, dst, sample_weight, anchors):
    """Weighted least squares for the LUT, with smoothness and anchor colours.

    Solved as a correction on top of identity (LUT = identity + C), with C pulled toward
    zero: colours the photo gives no evidence about (the red logo, cap print, text that
    the robust fit rejects as misaligned) keep their rendered colour.
    """
    M = N**3
    n = sample_weight.sum()
    ws = w * sample_weight[:, None]
    target = dst - src
    # Normal equations A^T W A C = A^T W (dst - src), accumulated without building A.
    pair = (idx[:, :, None] * M + idx[:, None, :]).ravel()
    AtA = np.bincount(pair, (ws[:, :, None] * w[:, None, :]).ravel(), minlength=M * M).reshape(M, M)
    Aty = np.stack([np.bincount(idx.ravel(), (ws * target[:, [c]]).ravel(), minlength=M) for c in range(3)], 1)
    for src_c, dst_c, share in anchors:
        a_idx, a_w = corners(np.array([src_c]))
        k = share * n
        AtA[np.ix_(a_idx[0], a_idx[0])] += k * np.outer(a_w[0], a_w[0])
        Aty[a_idx[0]] += k * a_w[0][:, None] * (np.array(dst_c) - np.array(src_c))[None]
    D = second_difference_matrix()
    lhs = AtA + SMOOTHNESS * n / M * (D.T @ D) + IDENTITY_PRIOR * n / M * np.eye(M)
    return identity_lut() + np.linalg.solve(lhs, Aty)


def fit(render, photo):
    src, dst, is_logo = sample_pairs(render, photo)
    idx, w = corners(src)
    anchors = [
        ((1.0, 1.0, 1.0), tuple(c / 255 for c in LABEL_WHITE), WHITE_ANCHOR_SHARE),
        (tuple(render[logo_red(render)][:, :3].mean(0)), tuple(photo[logo_red(photo)][:, :3].mean(0)), LOGO_ANCHOR_SHARE),
    ]
    # Region anchors: the render's average colour in each key region maps to the photo's.
    # Per-pixel pairs there are dominated by misaligned highlights, so the region means
    # are the more reliable statement of how the colours should relate.
    m = pair_mask(render, photo)
    for name in ANCHOR_REGIONS:
        x, y, w_, h = SPOTS[name]
        sl = (slice(y, y + h), slice(x, x + w_))
        sel = m[sl]
        anchors.append((tuple(render[sl][sel][:, :3].mean(0)), tuple(photo[sl][sel][:, :3].mean(0)), REGION_ANCHOR_SHARE))
    # Robust fit (iteratively reweighted, Tukey biweight): pairs that disagree with the
    # mapping because the label artwork sits a few pixels differently lose their pull.
    weight = np.ones(len(src))
    for _ in range(ROBUST_ITERATIONS):
        lut = solve(idx, w, src, dst, weight, anchors)
        resid = np.linalg.norm((lut[idx] * w[..., None]).sum(1) - dst, axis=1)
        u = np.minimum(resid / TUKEY_C, 1.0)
        weight = (1 - u**2) ** 2
        weight[is_logo] = 1.0
    lut = solve(idx, w, src, dst, weight, anchors)
    kept = (weight > 0).mean()
    print(f"[match_colour] fitted {N}^3 LUT on {len(src):,} pixel pairs ({kept:.0%} kept as inliers)")
    return np.clip(lut, 0.0, 1.0)


def apply(lut, rgba):
    rgb = rgba[..., :3].reshape(-1, 3)
    idx, w = corners(rgb)
    mapped = (lut[idx] * w[..., None]).sum(1)
    out = rgba.copy()
    out[..., :3] = saturate(mapped.reshape(rgba.shape[:2] + (3,)), rgba[..., 3])
    return out


def saturate(rgb, alpha, amount=None):
    """Push colours away from their luma by `amount`, on bottle pixels only. The boost
    fades out for near-white, near-neutral colours so the label stock stays white, and
    for pure reds, which the logo anchor has already matched."""
    amount = SATURATION if amount is None else amount
    luma = rgb @ np.array([0.2126, 0.7152, 0.0722])
    chroma = rgb.max(-1) - rgb.min(-1)
    r, g, b = np.moveaxis(rgb, -1, 0)
    hue = np.where(r >= rgb.max(-1), 60 * np.abs(g - b) / np.maximum(chroma, 1e-6), 180.0)  # degrees from red
    protect = np.maximum(
        np.clip((luma - 0.85) / 0.1, 0, 1) * np.clip(1 - chroma / 0.1, 0, 1),
        np.clip((20 - hue) / 10, 0, 1) * np.clip(chroma / 0.2, 0, 1),
    )
    gain = 1 + (amount - 1) * (1 - protect) * (alpha > 0)
    return np.clip(luma[..., None] + gain[..., None] * (rgb - luma[..., None]), 0.0, 1.0)


def save_rgba(arr, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(np.round(np.clip(arr, 0, 1) * 255).astype(np.uint8), "RGBA").save(path)


# Spots for the before/after report, in 1000x1500 coordinates (x, y, w, h).
SPOTS = {
    "lower oil": (430, 1300, 140, 80),
    "label white": (570, 700, 50, 40),
    "body above label": (400, 360, 200, 50),
}


def report(render, matched, photo):
    print("[match_colour] average colour (opaque pixels)      photo            before           after       diff before -> after")
    for name, (x, y, w, h) in SPOTS.items():
        sl = (slice(y, y + h), slice(x, x + w))
        m = (photo[sl][..., 3] > ALPHA_MIN) & (render[sl][..., 3] > ALPHA_MIN)
        p, b, a = (np.round(img[sl][m][:, :3].mean(0) * 255).astype(int) for img in (photo, render, matched))
        d0, d1 = np.linalg.norm(p - b), np.linalg.norm(p - a)
        fmt = lambda c: ",".join(map(str, c)).ljust(14)
        print(f"  {name:<18} {fmt(p)}  {fmt(b)}  {fmt(a)}  {d0:6.1f} -> {d1:5.1f}")
    # Logo red: each image's own banner pixels (the artwork is not pixel-aligned).
    red = logo_red(render)
    p, b, a = (np.round(img[sel][:, :3].mean(0) * 255).astype(int) for img, sel in ((photo, logo_red(photo)), (render, red), (matched, red)))
    d0, d1 = np.linalg.norm(p - b), np.linalg.norm(p - a)
    print(f"  {'logo red':<18} {fmt(p)}  {fmt(b)}  {fmt(a)}  {d0:6.1f} -> {d1:5.1f}")
    m = pair_mask(render, photo)
    before = np.linalg.norm((render[m][:, :3] - photo[m][:, :3]) * 255, axis=1).mean()
    after = np.linalg.norm((matched[m][:, :3] - photo[m][:, :3]) * 255, axis=1).mean()
    print(f"  mean diff, all opaque pixels below the cap: {before:.1f} -> {after:.1f}")


def main():
    photo = load_rgba(PHOTO)
    if RENDER_REF.exists():
        render_ref = load_rgba(RENDER_REF)
        lut = fit(render_ref, photo)
        np.save(LUT_PATH, lut)
    elif LUT_PATH.exists():
        lut = np.load(LUT_PATH)
        render_ref = None
        print(f"[match_colour] no frame 1 PNG; using saved {LUT_PATH.name}")
    else:
        sys.exit("[match_colour] need public/bottle/desktop/0001.png or scripts/colour_lut.npy")

    if "--report" in sys.argv and render_ref is not None:
        report(render_ref, apply(lut, render_ref), photo)
    if "--no-apply" in sys.argv:
        return

    count = 0
    for frame_set in ("desktop", "mobile"):
        for png in sorted((BOTTLE / frame_set).glob("*.png")):
            save_rgba(apply(lut, load_rgba(png)), OUT / frame_set / png.name)
            count += 1
    print(f"[match_colour] wrote {count} colour-matched frames to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
