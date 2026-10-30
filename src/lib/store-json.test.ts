import path from "node:path";
import { describe, expect, it } from "vitest";
import { recordPath } from "./store-json";

const data = path.join(process.cwd(), "data");

describe("recordPath", () => {
  it("writes to data/<file>.jsonl normally", () => {
    expect(recordPath("orders", {})).toBe(path.join(data, "orders.jsonl"));
  });

  it("writes to a separate file when STORE_JSON_SUFFIX is set, keeping tests out of the real log", () => {
    expect(recordPath("orders", { STORE_JSON_SUFFIX: "test" })).toBe(path.join(data, "orders.test.jsonl"));
  });

  it("ignores an empty suffix", () => {
    expect(recordPath("subscribers", { STORE_JSON_SUFFIX: "" })).toBe(path.join(data, "subscribers.jsonl"));
  });
});
