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
 * Appends one JSON line to data/<file>.jsonl (see recordPath).
 * TODO: replace with an email service / database before launch — serverless hosts
 * such as Vercel have a read-only, ephemeral filesystem, so this only logs there.
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
