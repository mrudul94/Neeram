import { describe, expect, it } from "vitest";
import { newOrderNumber, orderLinks, orderMessage, priceLines, validateDetails, type CheckoutDetails } from "./checkout";

const valid: CheckoutDetails = {
  phone: "9876543210",
  firstName: "Anu",
  lastName: "Thomas",
  street: "Kallarakkal House, MG Road",
  city: "Kochi",
  pin: "682011",
  state: "Kerala",
};

describe("validateDetails", () => {
  it("accepts a complete address", () => {
    expect(validateDetails(valid)).toEqual({});
  });

  it("flags every required field on an empty form", () => {
    expect(Object.keys(validateDetails({})).sort()).toEqual(
      ["city", "firstName", "lastName", "phone", "pin", "state", "street"].sort(),
    );
  });

  it("treats whitespace-only names as missing", () => {
    expect(validateDetails({ ...valid, firstName: "   " })).toHaveProperty("firstName");
  });

  it.each(["9876543210", "+919876543210", "+91 98765 43210", "+91 9876543210", "91-9876543210", "98765 43210", " 98765 43210 "])(
    "accepts the mobile number %s",
    (phone) => {
      expect(validateDetails({ ...valid, phone })).not.toHaveProperty("phone");
    },
  );

  it.each(["98765-43210", "09876543210"])("accepts the commonly typed mobile number %s", (phone) => {
    expect(validateDetails({ ...valid, phone })).not.toHaveProperty("phone");
  });

  it.each(["5876543210", "987654321", "98765432100", "abcdefghij"])("rejects the phone %s", (phone) => {
    expect(validateDetails({ ...valid, phone })).toHaveProperty("phone");
  });

  it("allows the email to be left out", () => {
    expect(validateDetails({ ...valid, email: "" })).not.toHaveProperty("email");
  });

  it("treats an email of only spaces as left out", () => {
    expect(validateDetails({ ...valid, email: "  " })).not.toHaveProperty("email");
  });

  it("rejects a malformed email", () => {
    expect(validateDetails({ ...valid, email: "anu@example" })).toHaveProperty("email");
  });

  it.each(["68201", "6820111", "082011"])("rejects the PIN %s", (pin) => {
    expect(validateDetails({ ...valid, pin })).toHaveProperty("pin");
  });

  it("rejects a state that isn't in the list", () => {
    expect(validateDetails({ ...valid, state: "Kerela" })).toHaveProperty("state");
  });

  it("rejects a note over 500 characters", () => {
    expect(validateDetails({ ...valid, note: "a".repeat(501) })).toHaveProperty("note");
  });
});

describe("priceLines", () => {
  it("prices a pack from the catalogue, ignoring anything the client sends", () => {
    const { items, total } = priceLines([{ slug: "coconut-oil", qty: 2, pack: "bottle-1l" }]);
    expect(items).toEqual([
      { slug: "coconut-oil", pack: "bottle-1l", name: "Coconut Oil (1 L bottle)", qty: 2, unitPrice: 260 },
    ]);
    expect(total).toBe(520);
  });

  it("uses the default pack for a line saved without one", () => {
    const { items } = priceLines([{ slug: "coconut-oil", qty: 1 }]);
    expect(items[0]).toMatchObject({ pack: "bottle-500", unitPrice: 130 });
  });

  it("totals several lines", () => {
    const { total } = priceLines([
      { slug: "coconut-oil", qty: 1, pack: "bottle-200" },
      { slug: "coconut-oil", qty: 3, pack: "pouch-500" },
    ]);
    expect(total).toBe(70 + 3 * 125);
  });

  it("drops a line with an unknown pack instead of charging for a different one", () => {
    expect(priceLines([{ slug: "coconut-oil", qty: 1, pack: "barrel" }]).items).toEqual([]);
  });

  it("drops unknown and coming-soon products", () => {
    expect(priceLines([{ slug: "ghee", qty: 1 }, { slug: "turmeric", qty: 1 }]).items).toEqual([]);
  });

  it.each([0, -1, 21, Number.NaN])("drops a line with quantity %s", (qty) => {
    expect(priceLines([{ slug: "coconut-oil", qty }]).items).toEqual([]);
  });

  it("rounds a fractional quantity down", () => {
    expect(priceLines([{ slug: "coconut-oil", qty: 2.7 }]).items[0].qty).toBe(2);
  });

  it("totals an empty cart as zero", () => {
    expect(priceLines([])).toEqual({ items: [], total: 0 });
  });
});

describe("newOrderNumber", () => {
  it("looks like NRM- followed by six uppercase characters", () => {
    expect(newOrderNumber()).toMatch(/^NRM-[0-9A-Z]{6}$/);
  });
});

describe("orderMessage", () => {
  const items = [{ slug: "coconut-oil", pack: "bottle-1l", name: "Coconut Oil (1 L bottle)", qty: 2, unitPrice: 260 }];

  it("lists the order, total, name, phone and address", () => {
    const msg = orderMessage({ orderNumber: "NRM-ABC123", items, total: 520, details: valid });
    expect(msg).toBe(
      [
        "Hello Neeram, I'd like to place an order.",
        "",
        "Order: NRM-ABC123",
        "• 2 × Coconut Oil (1 L bottle): ₹ 520",
        "Subtotal: ₹ 520 (delivery charge to be confirmed)",
        "Payment: before delivery, after you confirm",
        "",
        "Name: Anu Thomas",
        "Phone: +91 98765 43210",
        "Address: Kallarakkal House, MG Road, Kochi, Kerala 682011",
      ].join("\n"),
    );
  });

  it("adds the email, landmark and note when given", () => {
    const msg = orderMessage({
      orderNumber: "NRM-ABC123",
      items,
      total: 520,
      details: { ...valid, email: "anu@example.com", landmark: "St. Mary's Church", note: " Ring twice " },
    });
    expect(msg).toContain("Email: anu@example.com");
    expect(msg).toContain("Address: Kallarakkal House, MG Road, Near St. Mary's Church, Kochi, Kerala 682011");
    expect(msg.endsWith("\n\nNote: Ring twice")).toBe(true);
  });

  it("leaves out an email that is only spaces", () => {
    const msg = orderMessage({ orderNumber: "NRM-ABC123", items, total: 520, details: { ...valid, email: "  " } });
    expect(msg).not.toContain("Email:");
  });

  it("leaves out a landmark that is only spaces", () => {
    const msg = orderMessage({ orderNumber: "NRM-ABC123", items, total: 520, details: { ...valid, landmark: "  " } });
    expect(msg).not.toContain("Near");
  });

  it.each(["9876543210", "+919876543210", "+91 98765 43210", "91-9876543210", "98765-43210", "09876543210", " 98765 43210 "])(
    "writes the phone %s in one standard format",
    (phone) => {
      const msg = orderMessage({ orderNumber: "NRM-ABC123", items, total: 520, details: { ...valid, phone } });
      expect(msg).toContain("\nPhone: +91 98765 43210\n");
    },
  );

  it("shows a dash for unknown prices", () => {
    const msg = orderMessage({ orderNumber: "NRM-ABC123", items: [{ ...items[0], unitPrice: null }], total: null, details: valid });
    expect(msg).toContain("• 2 × Coconut Oil (1 L bottle): ₹ —");
    expect(msg).toContain("Subtotal: ₹ — ");
  });
});

describe("orderLinks", () => {
  it("opens a WhatsApp chat with the encoded message", () => {
    const { whatsapp } = orderLinks("Order: NRM-1 & 2 × oil", "NRM-1");
    expect(whatsapp).toBe("https://wa.me/918075915386?text=Order%3A%20NRM-1%20%26%202%20%C3%97%20oil");
  });
});
