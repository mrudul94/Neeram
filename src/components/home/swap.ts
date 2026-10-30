// Timings and helpers for the coconut-oil size switch (BottleMover, SwapText).

import type { Pack } from "@/data/products";

export const PACK_SLUG = "coconut-oil";

export const EXIT = { duration: 250, easing: "cubic-bezier(0.4, 0, 0.2, 1)" };
export const ENTER = { duration: 450, easing: "cubic-bezier(0.22, 1, 0.36, 1)" };
export const FADE = { duration: 150, easing: "ease" }; // reduced motion

/** Floor line for every pack, as a share of the bottle box from the bottom: where the
 * bottle in bottle-still.png stands (y 1343 of 1500). */
export const BASELINE = 10.4;

export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Plays `keyframes` on `el`, starting from wherever a running animation has left it:
 * that one is frozen in place (commitStyles) and cancelled first, so animations never stack.
 */
export function play(el: HTMLElement, keyframes: Keyframe[], timing: KeyframeAnimationOptions) {
  for (const a of el.getAnimations()) {
    a.commitStyles();
    a.cancel();
  }
  return el.animate(keyframes, { ...timing, fill: "forwards" });
}

/** Shadow width under a pack, as a share of the box width (46%: the 500 ml bottle's). */
export function shadowWidth(p: Pack, isDefault: boolean) {
  if (isDefault) return 46;
  // Image width on stage = height share × aspect × (box height / box width = 3/2).
  return Math.min(95, p.stageHeight * (p.image.width / p.image.height) * 150 * 0.95);
}
