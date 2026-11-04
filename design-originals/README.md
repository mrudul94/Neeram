# Design originals

Files kept for reference. Nothing here is deployed with the website.

- `product-photos/`: source PNGs of the bottle and packet photos.
- `logo/`: the full-size logo. The site uses the smaller copy in `public/images/logo/`.
- `bottle/`: the 360° bottle frames, 27 per set. `USE_FRAMES` in `src/lib/bottle.ts` is off, so the site doesn't load them. To use them, copy them back to `public/bottle/` and supply the missing frames.
