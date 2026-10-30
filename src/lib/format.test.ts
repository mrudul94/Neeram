import { describe, expect, it } from "vitest";
import { formatPrice } from "./format";

describe("formatPrice", () => {
  it("formats rupees with a spaced symbol", () => {
    expect(formatPrice(240)).toBe("₹ 240");
  });

  it("groups thousands the Indian way", () => {
    expect(formatPrice(100000)).toBe("₹ 1,00,000");
  });

  it("drops paise", () => {
    expect(formatPrice(129.6)).toBe("₹ 130");
  });

  it("shows a dash while the price is unknown", () => {
    expect(formatPrice(null)).toBe("₹ —");
  });

  it("shows zero as a price, not as unknown", () => {
    expect(formatPrice(0)).toBe("₹ 0");
  });
});
