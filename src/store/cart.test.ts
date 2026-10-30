import { beforeEach, describe, expect, it } from "vitest";
import { lineKey, MAX_QTY, resolveLines, subtotal, useCart } from "./cart";

const cart = () => useCart.getState();

beforeEach(() => {
  useCart.setState({ lines: [], drawerOpen: false });
});

describe("lineKey", () => {
  it("is the slug for a line without a pack", () => {
    expect(lineKey({ slug: "turmeric" })).toBe("turmeric");
  });

  it("joins slug and pack", () => {
    expect(lineKey({ slug: "coconut-oil", pack: "bottle-1l" })).toBe("coconut-oil:bottle-1l");
  });
});

describe("useCart.add", () => {
  it("adds the default pack when none is chosen", () => {
    cart().add("coconut-oil");
    expect(cart().lines).toEqual([{ slug: "coconut-oil", pack: "bottle-500", qty: 1 }]);
  });

  it("keeps different packs of one product on separate lines", () => {
    cart().add("coconut-oil", 1, "bottle-500");
    cart().add("coconut-oil", 1, "bottle-1l");
    expect(cart().lines.map(lineKey)).toEqual(["coconut-oil:bottle-500", "coconut-oil:bottle-1l"]);
  });

  it("adds to the quantity of a line already in the cart", () => {
    cart().add("coconut-oil", 2, "bottle-1l");
    cart().add("coconut-oil", 3, "bottle-1l");
    expect(cart().lines).toEqual([{ slug: "coconut-oil", pack: "bottle-1l", qty: 5 }]);
  });

  it("merges into a line saved before the product had packs", () => {
    useCart.setState({ lines: [{ slug: "coconut-oil", qty: 2 }] });
    cart().add("coconut-oil", 1, "bottle-500");
    expect(cart().lines).toEqual([{ slug: "coconut-oil", pack: "bottle-500", qty: 3 }]);
  });

  it(`caps the quantity at ${MAX_QTY}`, () => {
    cart().add("coconut-oil", 15);
    cart().add("coconut-oil", 15);
    expect(cart().lines[0].qty).toBe(MAX_QTY);
  });

  it("ignores coming-soon and unknown products", () => {
    cart().add("turmeric");
    cart().add("ghee");
    expect(cart().lines).toEqual([]);
  });

  it.each([0, -2])("ignores a quantity of %s", (qty) => {
    cart().add("coconut-oil", qty);
    expect(cart().lines).toEqual([]);
  });
});

describe("useCart.setQty", () => {
  it("changes a line's quantity, capped at the maximum", () => {
    cart().add("coconut-oil", 1, "bottle-1l");
    cart().setQty("coconut-oil:bottle-1l", 99);
    expect(cart().lines[0].qty).toBe(MAX_QTY);
  });

  it("removes the line when set to zero", () => {
    cart().add("coconut-oil", 1, "bottle-1l");
    cart().setQty("coconut-oil:bottle-1l", 0);
    expect(cart().lines).toEqual([]);
  });

  it("finds a legacy line by its default-pack key", () => {
    useCart.setState({ lines: [{ slug: "coconut-oil", qty: 2 }] });
    cart().setQty("coconut-oil:bottle-500", 4);
    expect(cart().lines).toEqual([{ slug: "coconut-oil", pack: "bottle-500", qty: 4 }]);
  });
});

describe("useCart.remove and clear", () => {
  it("removes only the matching line", () => {
    cart().add("coconut-oil", 1, "bottle-500");
    cart().add("coconut-oil", 1, "bottle-1l");
    cart().remove("coconut-oil:bottle-500");
    expect(cart().lines.map(lineKey)).toEqual(["coconut-oil:bottle-1l"]);
  });

  it("empties the cart", () => {
    cart().add("coconut-oil");
    cart().clear();
    expect(cart().lines).toEqual([]);
  });
});

describe("resolveLines", () => {
  it("joins a line with its pack's price, label and image", () => {
    const [line] = resolveLines([{ slug: "coconut-oil", pack: "pouch-500", qty: 2 }]);
    expect(line).toMatchObject({
      key: "coconut-oil:pouch-500",
      sizeLabel: "500 ml packet",
      lineTotal: 250,
      image: { src: "/images/packs/pouch-500.webp" },
    });
  });

  it("drops lines for unknown or coming-soon products", () => {
    expect(resolveLines([{ slug: "ghee", qty: 1 }, { slug: "turmeric", qty: 1 }])).toEqual([]);
  });
});

describe("subtotal", () => {
  it("adds up line totals", () => {
    const lines = resolveLines([
      { slug: "coconut-oil", pack: "bottle-200", qty: 2 },
      { slug: "coconut-oil", pack: "bottle-1l", qty: 1 },
    ]);
    expect(subtotal(lines)).toBe(2 * 70 + 260);
  });

  it("is unknown when any line's price is unknown", () => {
    const [line] = resolveLines([{ slug: "coconut-oil", qty: 1 }]);
    expect(subtotal([line, { ...line, lineTotal: null }])).toBeNull();
  });

  it("is zero for an empty cart", () => {
    expect(subtotal([])).toBe(0);
  });
});
