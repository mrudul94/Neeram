// Bottle frame sequence rendered from blender/Neeram_Bottle.blend (see README).
/**
 * true: the bottle turns 360° on scroll using the frame sequence below (swap in real
 * turntable photos as the frames). false: the product photo travels with a light 3D
 * tilt and sweep instead, and no frames are loaded.
 */
export const USE_FRAMES = false;
export const FRAME_COUNT = 120;

export type FrameSet = "desktop" | "mobile";

export const frameSrc = (set: FrameSet, index: number) => `/bottle/${set}/${String(index + 1).padStart(4, "0")}.webp`;

/** Product photo shown at rest; same canvas size and alignment as frame 1. */
export const STILL_SRC: Record<FrameSet, string> = {
  desktop: "/bottle/bottle-still.webp",
  mobile: "/bottle/bottle-still-mobile.webp",
};
