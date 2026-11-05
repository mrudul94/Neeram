import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { legalLinks } from "@/data/content";
import { getProduct } from "@/data/products";
import { packagedDetails } from "./legal";

const value = (label: string) => packagedDetails(getProduct("coconut-oil")!).find((s) => s.label === label)?.value;

describe("legalLinks", () => {
  it.each(legalLinks.map((l) => [l.label, l.href]))("%s points to a page that exists (%s)", (_, href) => {
    expect(existsSync(path.join(process.cwd(), "src/app/(site)", href, "page.tsx"))).toBe(true);
  });
});

describe("packagedDetails", () => {
  it("lists the net quantity of every size on sale", () => {
    expect(value("Net quantity")).toBe("500 ml, 1 L, 200 ml, 500 ml packet, 1 L packet");
  });

  it("uses the size label for a product with one size", () => {
    const single = packagedDetails(getProduct("turmeric")!).find((s) => s.label === "Net quantity");
    expect(single?.value).toBe("200 ml");
  });

  it("shows the shelf life as the best-before detail", () => {
    expect(value("Best before")).toBe("6 months. See the date on the pack.");
  });

  it("lists the MRP of every size on sale", () => {
    expect(value("MRP")).toBe("500 ml bottle ₹ 200, 1 L bottle ₹ 340, 200 ml bottle ₹ 100, 500 ml packet ₹ 190, 1 L packet ₹ 330");
  });

  it("shows the MRP of a product with no confirmed price as a visible gap", () => {
    const single = packagedDetails(getProduct("turmeric")!).find((s) => s.label === "MRP");
    expect(single?.value).toBe("[to be confirmed]");
  });

  it("shows the FSSAI licence", () => {
    expect(value("FSSAI licence")).toBe("11321014000289");
  });

  it("names the mill as the manufacturer, with its address", () => {
    expect(value("Manufacturer")).toBe("Govindan Oil Mill, Anakallu, Shankarampady Post, Kasaragod 671541");
  });
});
