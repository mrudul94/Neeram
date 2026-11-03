import type { CheckoutDetails, PricedItem } from "./checkout";
import { appendRow, GoogleError, ORDERS_RANGE, orderRow, sheetConfig } from "./sheet";
import { appendRecord } from "./store-json";

export type NewOrder = { orderNumber: string; items: PricedItem[]; total: number | null; details: CheckoutDetails };

/** If a sheet is set up, search Workers Logs for "NOT SAVED TO SHEET" to find records to add by hand. */
const ORDER_TAG = "ORDER NOT SAVED TO SHEET";

const ATTEMPTS = 2;
const TIMEOUT_MS = 5000;

/** Timeouts, network errors and 5xx can pass on a retry; 4xx means the setup is wrong. */
const worthRetrying = (err: unknown) => !(err instanceof GoogleError) || err.status >= 500;

type Deps = {
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
  appendLocal?: typeof appendRecord;
  logError?: (...args: unknown[]) => void;
  /** Per attempt. */
  timeoutMs?: number;
};

/**
 * Where a record goes. Never throws: callers run this after the response is sent.
 * - Test runs (ORDERS_TEST_MODE=1): the local file only (data/<file>.jsonl, or
 *   data/<file>.<STORE_JSON_SUFFIX>.jsonl), never the sheet.
 * - Development: data/<file>.jsonl, and the sheet too if it's set up.
 * - Production with no sheet set up: nothing is saved or logged. Orders are handled by hand on WhatsApp.
 * - Production with a sheet: one attempt, plus one retry if worth it; on failure, the full record goes
 *   to the server log under `tag`.
 */
async function save(target: { file: string; range: string; tag: string }, record: Record<string, unknown>, row: (string | number)[], deps: Deps) {
  const { env = process.env, fetch: fetchFn = fetch, appendLocal = appendRecord, logError = console.error, timeoutMs = TIMEOUT_MS } = deps;
  const testRun = env.ORDERS_TEST_MODE === "1";
  const dev = env.NODE_ENV === "development";

  if (testRun || dev) await appendLocal(target.file, record);
  if (testRun) return;

  const config = sheetConfig(env);
  if (!config) return;
  let lastError: unknown;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      await appendRow(config, target.range, row, { fetch: fetchFn, signal: AbortSignal.timeout(timeoutMs) });
      return;
    } catch (err) {
      lastError = err;
      if (!worthRetrying(err)) break;
    }
  }
  logError(`[${target.tag}] ${lastError instanceof Error ? lastError.message : String(lastError)}`, JSON.stringify(record));
}

export async function saveOrder(order: NewOrder, deps: Deps = {}) {
  const at = new Date();
  await save({ file: "orders", range: ORDERS_RANGE, tag: ORDER_TAG }, { ...order, status: "awaiting-message", at }, orderRow({ ...order, at }), deps);
}
