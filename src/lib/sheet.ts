import { createSign } from "node:crypto";
import { getPack, getProduct } from "@/data/products";
import { formatPhone, type CheckoutDetails, type PricedItem } from "./checkout";

/**
 * Row 1 of the orders tab (the sheet's first tab), in column order (A–P).
 * docs/ORDER_SHEET_SETUP.md has the client paste these; orderRow must keep the same order.
 */
export const ORDER_SHEET_HEADERS = [
  "Order no",
  "Date & time (IST)",
  "Name",
  "Phone",
  "Email",
  "Address",
  "Landmark",
  "City",
  "State",
  "PIN",
  "Items (product · size · qty)",
  "Subtotal",
  "Delivery",
  "Total",
  "Status",
  "Notes",
] as const;

/** Row 1 of the "Newsletter" tab (A–C). */
export const SIGNUP_SHEET_HEADERS = ["Date & time (IST)", "Email", "Page"] as const;

/** Orders go to the first tab, whatever it's called. */
export const ORDERS_RANGE = "A:P";
export const NEWSLETTER_RANGE = "Newsletter!A:C";

/** The narrowest scope that can add rows to a sheet shared with the service account. */
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

export type SheetOrder = { orderNumber: string; items: PricedItem[]; total: number | null; details: CheckoutDetails; at: Date };
export type SheetSignup = { email: string; topic: string; page: string; at: Date };
export type SheetConfig = { email: string; privateKey: string; sheetId: string };
type Cell = string | number;

/** "30 Oct 2026, 11:48" in India time. */
function istDateTime(at: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(at)
      .map((p) => [p.type, p.value]),
  );
  return `${parts.day} ${parts.month} ${parts.year}, ${parts.hour}:${parts.minute}`;
}

/** "Coconut Oil · 1 L bottle · 2", one line per item. */
function itemsCell(items: PricedItem[]) {
  return items
    .map((i) => {
      const product = getProduct(i.slug);
      const size = (product && (getPack(product, i.pack)?.label ?? product.sizeLabel)) ?? "";
      return [product?.name ?? i.name, size, i.qty].filter((v) => v !== "").join(" · ");
    })
    .join("\n");
}

/** One order as a sheet row. Delivery, Total and Status are left blank for the shop. */
export function orderRow(o: SheetOrder): Cell[] {
  const d = o.details;
  const text = (v?: string) => v?.trim() ?? "";
  return [
    o.orderNumber,
    istDateTime(o.at),
    `${text(d.firstName)} ${text(d.lastName)}`,
    formatPhone(d.phone),
    text(d.email),
    text(d.street),
    text(d.landmark),
    text(d.city),
    text(d.state),
    text(d.pin),
    itemsCell(o.items),
    o.total ?? "",
    "",
    "",
    "",
    text(d.note),
  ];
}

/**
 * One sign-up as a row. Product pages carry both "Notify me" and the footer newsletter,
 * so "Notify me" sign-ups name the product after the page.
 */
export function signupRow(s: SheetSignup): Cell[] {
  const product = s.topic === "newsletter" ? undefined : getProduct(s.topic);
  const page = [s.page, product && `(Notify me: ${product.name})`].filter(Boolean).join(" ");
  return [istDateTime(s.at), s.email, page];
}

/** The service account and sheet from env vars; null until all three are set. */
export function sheetConfig(env: Record<string, string | undefined>): SheetConfig | null {
  const email = env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const sheetId = env.GOOGLE_SHEET_ID?.trim();
  // Hosts often store the key's line breaks as the two characters "\n", sometimes in quotes.
  const privateKey = env.GOOGLE_PRIVATE_KEY?.trim().replace(/^"|"$/g, "").replace(/\\n/g, "\n");
  return email && sheetId && privateKey ? { email, privateKey, sheetId } : null;
}

const base64url = (v: string | object) => Buffer.from(typeof v === "string" ? v : JSON.stringify(v)).toString("base64url");

type RequestOptions = { fetch?: typeof fetch; signal?: AbortSignal };

/** Trades a signed service-account JWT for an access token. */
async function accessToken(config: SheetConfig, { fetch: fetchFn = fetch, signal }: RequestOptions) {
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${base64url({ alg: "RS256", typ: "JWT" })}.${base64url({ iss: config.email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 })}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(config.privateKey, "base64url");
  const res = await fetchFn(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
    signal,
  });
  if (!res.ok) throw new Error(`Google sign-in failed: ${res.status} ${await res.text()}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

/**
 * Adds one row below the last row of `range`'s tab. Only appends: never reads or changes
 * existing rows. RAW keeps customer text as text (no formulas).
 */
export async function appendRow(config: SheetConfig, range: string, row: Cell[], options: RequestOptions = {}) {
  const { fetch: fetchFn = fetch, signal } = options;
  const token = await accessToken(config, options);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(config.sheetId)}/values/${encodeURIComponent(range)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
  const res = await fetchFn(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ values: [row] }),
    signal,
  });
  if (!res.ok) throw new Error(`Sheets append failed: ${res.status} ${await res.text()}`);
}
