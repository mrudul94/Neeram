type Box = Pick<DOMRect, "left" | "top" | "right" | "bottom" | "width" | "height">;

/** Whether two boxes touch, or come within `margin` px. A box with no size never does. */
export function rectsOverlap(a: Box, b: Box, margin = 0): boolean {
  if (!a.width || !a.height || !b.width || !b.height) return false;
  return a.left < b.right + margin && b.left < a.right + margin && a.top < b.bottom + margin && b.top < a.bottom + margin;
}
