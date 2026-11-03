import { describe, expect, it } from "vitest";
import { getProduct, products } from "@/data/products";
import { productFaqs } from "./faq";
import { breadcrumbSchema, faqSchema, organizationSchema, productSchema, websiteSchema } from "./schema";

const oil = getProduct("coconut-oil")!;
const all = () => [organizationSchema(), websiteSchema(), productSchema(oil), faqSchema(productFaqs(oil))!, ...products.map(breadcrumbSchema)];

describe("every schema", () => {
  it("is valid JSON with a schema.org context and a type", () => {
    for (const s of all()) {
      const parsed = JSON.parse(JSON.stringify(s));
      expect(parsed["@context"]).toBe("https://schema.org");
      expect(typeof parsed["@type"]).toBe("string");
    }
  });

  it("never contains a placeholder or an empty value", () => {
    for (const s of all()) {
      const text = JSON.stringify(s);
      expect(text).not.toMatch(/to be confirmed|client to confirm|\[[A-Za-z]/);
      expect(text).not.toMatch(/:null|:""|:\[\]|:\{\}/);
    }
  });

  it("makes no claims we can't back up", () => {
    expect(JSON.stringify(all())).not.toMatch(/organic|stockist|farmer society|aggregateRating|"review"/i);
  });
});

describe("organizationSchema", () => {
  it("names the company and links its logo", () => {
    const org = organizationSchema();
    expect(org["@type"]).toBe("Organization");
    expect(org.name).toBe("Neeram Coconut Industries Private Limited");
    expect(org.logo).toMatch(/^https?:\/\/.+\.webp$/);
  });

  it("only uses LocalBusiness when customers can visit a place", () => {
    const base = { hasPublicLocation: false, location: { streetAddress: null, locality: "Kasaragod", region: "Kerala", postalCode: null, country: "IN" }, geo: { latitude: null, longitude: null } };
    expect(organizationSchema(base)["@type"]).toBe("Organization");
    expect(organizationSchema({ ...base, hasPublicLocation: true })["@type"]).toBe("LocalBusiness");
  });

  it("leaves out address parts, phone, email, coordinates and social links until they are filled", () => {
    const org = organizationSchema({ support: { phone: null, email: null, hours: null } }) as Record<string, unknown>;
    expect(org.address).toEqual({ "@type": "PostalAddress", addressLocality: "Kasaragod", addressRegion: "Kerala", addressCountry: "IN" });
    for (const key of ["telephone", "email", "geo", "sameAs"]) expect(org).not.toHaveProperty(key);
  });

  it("adds them once they are filled", () => {
    const org = organizationSchema({
      geo: { latitude: 12.5, longitude: 75 },
      socials: { Instagram: "https://instagram.com/neeram", Facebook: null, YouTube: null, WhatsApp: null },
      support: { phone: "+91 90000 00000", email: "hello@example.com", hours: null },
    }) as Record<string, unknown>;
    expect(org.geo).toEqual({ "@type": "GeoCoordinates", latitude: 12.5, longitude: 75 });
    expect(org.sameAs).toEqual(["https://instagram.com/neeram"]);
    expect(org.telephone).toBe("+91 90000 00000");
    expect(org.email).toBe("hello@example.com");
  });
});

describe("productSchema", () => {
  const schema = productSchema(oil) as unknown as { name: string; offers: Record<string, number & string>[]; image: string[]; brand: { name: string } };

  it("has what Google requires: name, images and offers", () => {
    expect(schema.name).toBe("Neeram Coconut Oil");
    expect(schema.image.length).toBeGreaterThan(0);
    expect(schema.image.every((u: string) => /^https?:\/\//.test(u))).toBe(true);
    expect(schema.brand.name).toBe("Neeram");
  });

  it("has one offer per size, each with a price above zero in rupees", () => {
    expect(schema.offers).toHaveLength(oil.packs!.length);
    expect(schema.offers.map((o) => o.name)).toContain("1 L packet");
    for (const o of schema.offers) {
      expect(o["@type"]).toBe("Offer");
      expect(o.price).toBeGreaterThan(0);
      expect(o.priceCurrency).toBe("INR");
      expect(o.availability).toBe("https://schema.org/InStock");
      expect(o.url).toMatch(/\/products\/coconut-oil$/);
    }
  });

  it("shows the 1 L packet at its real price", () => {
    expect(schema.offers.find((o) => o.name === "1 L packet")?.price).toBe(250);
  });

  it("makes no offer for a product with no confirmed price", () => {
    expect(productSchema(getProduct("turmeric")!)).not.toHaveProperty("offers");
  });
});

describe("breadcrumbSchema", () => {
  it("runs Home, Shop, then the product, numbered from 1", () => {
    const crumbs = breadcrumbSchema(oil).itemListElement;
    expect(crumbs.map((c) => c.name)).toEqual(["Home", "Shop", "Coconut Oil"]);
    expect(crumbs.map((c) => c.position)).toEqual([1, 2, 3]);
    expect(crumbs[2].item).toMatch(/\/products\/coconut-oil$/);
  });
});

describe("FAQ", () => {
  const faqs = productFaqs(oil);

  it("has 5 or 6 questions, phrased as questions", () => {
    expect(faqs.length).toBeGreaterThanOrEqual(5);
    expect(faqs.length).toBeLessThanOrEqual(6);
    expect(faqs.every((f) => f.question.endsWith("?"))).toBe(true);
  });

  it("has no unconfirmed answers left on the page", () => {
    expect(faqs.some((f) => f.answer.includes("["))).toBe(false);
  });

  it("only puts confirmed answers in the schema", () => {
    const schema = faqSchema(faqs)!;
    const known = faqs.filter((f) => !f.answer.includes("["));
    expect(schema.mainEntity.map((q) => q.name)).toEqual(known.map((f) => f.question));
    expect(schema.mainEntity[0].acceptedAnswer["@type"]).toBe("Answer");
  });

  it("lists every size and price in the answer about sizes", () => {
    const sizes = faqs.find((f) => /sizes/i.test(f.question))!;
    for (const pack of oil.packs!) expect(sizes.answer).toContain(pack.label);
    expect(sizes.answer).toContain("₹ 250");
  });

  it("has no schema at all when nothing is confirmed", () => {
    expect(faqSchema([{ question: "Q?", answer: "[client to confirm]" }])).toBeNull();
  });

  it("is only written for the coconut oil page", () => {
    expect(productFaqs(getProduct("turmeric")!)).toEqual([]);
  });
});
