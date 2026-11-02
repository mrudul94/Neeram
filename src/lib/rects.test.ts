import { describe, expect, it } from "vitest";
import { rectsOverlap } from "./rects";

const box = (left: number, top: number, width = 100, height = 100) => ({ left, top, right: left + width, bottom: top + height, width, height });

describe("rectsOverlap", () => {
  it("is true when two boxes share any area", () => {
    expect(rectsOverlap(box(0, 0), box(50, 50))).toBe(true);
  });

  it("is false when they are apart", () => {
    expect(rectsOverlap(box(0, 0), box(300, 0))).toBe(false);
  });

  it("counts boxes closer than the margin as overlapping", () => {
    expect(rectsOverlap(box(0, 0), box(110, 0), 16)).toBe(true);
    expect(rectsOverlap(box(0, 0), box(120, 0), 16)).toBe(false);
  });

  it("ignores an element with no size, such as one that is hidden", () => {
    expect(rectsOverlap(box(0, 0), box(50, 50, 0, 0), 16)).toBe(false);
  });
});
