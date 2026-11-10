import { describe, expect, it } from "vitest";
import { discountPercent, getPack, getProduct, hasSizes, isAvailable, lowestPrice, packMrp, packPrice, packSize, products } from "./products";

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

  it("has one gallery photo, with a phone copy, for every pack on sale", () => {
    for (const p of products) {
      for (const pack of p.packs ?? []) {
        const photos = p.images.filter((im) => im.pack === pack.id);
        expect(photos, `${p.slug} ${pack.id}`).toHaveLength(1);
        expect(photos[0].mobileSrc, `${p.slug} ${pack.id}`).toBeTruthy();
      }
      for (const im of p.images) if (im.pack) expect(p.packs?.map((k) => k.id), im.src).toContain(im.pack);
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
    expect(getPack(oil, "bottle-1l")?.price).toBe(270);
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
    expect(lowestPrice(oil)).toBe(58);
  });

  it("returns the product price for a product without packs", () => {
    expect(lowestPrice(turmeric)).toBeNull();
  });
});

describe("coconut oil 1 L packet", () => {
  it("is on sale at ₹ 260, against an MRP of ₹ 330", () => {
    const pack = getPack(getProduct("coconut-oil")!, "pouch-1l");
    expect(pack?.label).toBe("1 L packet");
    expect(pack?.price).toBe(260);
    expect(pack?.mrp).toBe(330);
  });
});

describe("packPrice", () => {
  const oil = getProduct("coconut-oil")!;

  it("uses the pack's own price", () => {
    expect(packPrice(oil, getPack(oil, "bottle-1l"))).toBe(270);
  });

  it("falls back to the product's price without a pack", () => {
    expect(packPrice(oil)).toBe(oil.price);
  });
});

describe("packSize", () => {
  const packs = getProduct("coconut-oil")!.packs!;

  it("names a packet as a packet", () => {
    expect(packs.filter((p) => p.form === "Packet").map(packSize)).toEqual(["500 ml packet", "1 L packet"]);
  });

  it("leaves a bottle as just its size", () => {
    expect(packs.filter((p) => p.form !== "Packet").map(packSize)).toEqual(["500 ml", "1 L", "200 ml"]);
  });
});

describe("MRP and discount", () => {
  it("matches the client's price list for every coconut oil pack", () => {
    const rows = oil.packs!.map((p) => [p.id, packPrice(oil, p), packMrp(oil, p), discountPercent(packPrice(oil, p), packMrp(oil, p))]);
    expect(rows).toEqual([
      ["bottle-500", 135, 200, 33],
      ["bottle-1l", 270, 340, 21],
      ["bottle-200", 58, 100, 42],
      ["pouch-500", 130, 190, 32],
      ["pouch-1l", 260, 330, 21],
    ]);
  });

  it("shows no discount at MRP or while a price is unknown", () => {
    expect(discountPercent(200, 200)).toBe(0);
    expect(discountPercent(null, 200)).toBe(0);
    expect(packMrp(turmeric)).toBeNull();
  });
});
