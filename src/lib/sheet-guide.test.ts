import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ORDER_SHEET_HEADERS, SIGNUP_SHEET_HEADERS } from "./sheet";

// The client sets up the sheet's header rows from the guide; the website writes columns in code order.
const guide = readFileSync(path.join(process.cwd(), "docs/ORDER_SHEET_SETUP.md"), "utf8").split("\n").map((l) => l.trim());

/** The tab-separated line the reader pastes into A1. */
const pasteLine = (first: string) => guide.find((l) => l.startsWith(`${first}\t`))?.split("\t");

/** The "type them one per cell" fallback: "**A** Order no · **B** …", with columns in order. */
function perCellList(first: string) {
  const line = guide.find((l) => l.includes(`**A** ${first}`))!;
  const cells = line.slice(line.indexOf("**A**")).split(/\*\*[A-Z]\*\* /).slice(1);
  return cells.map((c) => c.replace(/ · $/, "").replace(/\.$/, "").trim());
}

describe("docs/ORDER_SHEET_SETUP.md", () => {
  it("has the orders header row in the order the website writes it", () => {
    expect(pasteLine("Order no")).toEqual([...ORDER_SHEET_HEADERS]);
  });

  it("lists the orders headings one per cell in the same order", () => {
    expect(perCellList("Order no")).toEqual([...ORDER_SHEET_HEADERS]);
  });

  it("has the Newsletter header row in the order the website writes it", () => {
    expect(pasteLine("Date & time (IST)")).toEqual([...SIGNUP_SHEET_HEADERS]);
  });

  it("lists the Newsletter headings one per cell in the same order", () => {
    expect(perCellList("Date & time (IST)")).toEqual([...SIGNUP_SHEET_HEADERS]);
  });
});
