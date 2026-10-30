import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Appends one JSON line to data/<file>.jsonl.
 * TODO: replace with an email service / database before launch — serverless hosts
 * such as Vercel have a read-only, ephemeral filesystem, so this only logs there.
 */
export async function appendRecord(file: string, record: Record<string, unknown>) {
  const line = JSON.stringify({ ...record, at: new Date().toISOString() });
  try {
    await mkdir(DATA_DIR, { recursive: true });
    await appendFile(path.join(DATA_DIR, `${file}.jsonl`), line + "\n", "utf8");
  } catch {
    console.log(`[${file}]`, line);
  }
}
