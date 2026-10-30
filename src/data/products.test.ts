import { describe, expect, it } from "vitest";
import { getPack, getProduct, hasSizes, isAvailable, lowestPrice, products } from "./products";

const oil = getProduct("coconut-oil")!;
const turmeric = getProduct("turmeric")!;

describe("product catalogue", () => {
  it("has unique slugs", () => {
    const slugs = products.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has unique pack ids within each product", () => {
    for (const p of products) {
      const ids = (p.packs ?? []).map((k) => k.id);
      expect(new Set(ids).size, p.slug).toBe(ids.length);
    }
  });

  it("gives every available product a price", () => {
    for (const p of products.filter(isAvailable)) {
      expect(lowestPrice(p), p.slug).not.toBeNull();
    }
  });
});

describe("getProduct", () => {
  it("returns undefined for an unknown slug", () => {
    expect(getProduct("ghee")).toBeUndefined();
  });
});

describe("getPack", () => {
  it("returns the pack with the given id", () => {
    expect(getPack(oil, "bottle-1l")?.price).toBe(260);
  });

  it("falls back to the first pack when no id is given", () => {
    expect(getPack(oil)?.id).toBe("bottle-500");
  });

  it("falls back to the first pack for an unknown id", () => {
    expect(getPack(oil, "barrel")?.id).toBe("bottle-500");
  });

  it("returns undefined for a single-size product", () => {
    expect(getPack(turmeric)).toBeUndefined();
  });
});

describe("hasSizes", () => {
  it("is true for coconut oil, which comes in several packs", () => {
    expect(hasSizes(oil)).toBe(true);
  });

  it("is false for a product without packs", () => {
    expect(hasSizes(turmeric)).toBe(false);
  });
});

describe("lowestPrice", () => {
  it("returns the cheapest pack price", () => {
    expect(lowestPrice(oil)).toBe(70);
  });

  it("returns the product price for a product without packs", () => {
    expect(lowestPrice(turmeric)).toBeNull();
  });
});
