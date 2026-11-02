import { globSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Malayalam font subset", () => {
  it("has every Malayalam character the site uses", () => {
    const inFont = new Set(readFileSync("src/app/fonts/malayalam-chars.txt", "utf8"));
    const missing = new Set<string>();
    for (const file of globSync("src/**/*.{ts,tsx}")) {
      if (file.includes(".test.")) continue;
      for (const char of readFileSync(file, "utf8").match(/[\u0D00-\u0D7F]/g) ?? []) if (!inFont.has(char)) missing.add(char);
    }
    expect([...missing]).toEqual([]);
  });
});
