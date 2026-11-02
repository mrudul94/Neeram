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
    expect(value("Net quantity")).toBe("500 ml, 1 L, 200 ml, 500 ml packet");
  });

  it("uses the size label for a product with one size", () => {
    const single = packagedDetails(getProduct("turmeric")!).find((s) => s.label === "Net quantity");
    expect(single?.value).toBe("200 ml");
  });

  it.each(["Manufacturer", "MRP", "Best before", "FSSAI licence"])("shows %s as a visible gap until it is supplied", (label) => {
    expect(value(label)).toBe("[to be confirmed]");
  });
});
