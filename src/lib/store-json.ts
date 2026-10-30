import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");

/**
 * data/<file>.jsonl, or data/<file>.<suffix>.jsonl when STORE_JSON_SUFFIX is set
 * (the Playwright config sets it to "test", so test orders stay out of the real log).
 */
export function recordPath(file: string, env: Record<string, string | undefined> = process.env) {
  const suffix = env.STORE_JSON_SUFFIX;
  return path.join(DATA_DIR, suffix ? `${file}.${suffix}.jsonl` : `${file}.jsonl`);
}

/**
 * Appends one JSON line to data/<file>.jsonl (see recordPath). Local development and test
 * runs only: in production, records go to the Google Sheet (see records.ts).
 */
export async function appendRecord(file: string, record: Record<string, unknown>) {
  const line = JSON.stringify({ ...record, at: new Date().toISOString() });
  try {
    await mkdir(DATA_DIR, { recursive: true });
    await appendFile(recordPath(file), line + "\n", "utf8");
  } catch {
    console.log(`[${file}]`, line);
  }
}
