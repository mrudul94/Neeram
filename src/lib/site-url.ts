const DEV_URL = "http://localhost:3000";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "[::1]"]);

/** What is wrong with a production site URL; null if it is fine. */
function problemWith(url: string | undefined): string | null {
  if (!url?.trim()) return "it is missing";
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return `"${url}" is not a full URL`;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return `"${url}" is not a web address`;
  if (LOCAL_HOSTS.has(parsed.hostname)) return `"${url}" points to this computer`;
  return null;
}

/**
 * The site's public URL. Pages are prerendered with it, so a bad value in production stops
 * the build instead of shipping canonical links that point to localhost.
 */
export function resolveSiteUrl(url: string | undefined, nodeEnv: string | undefined): string {
  if (nodeEnv !== "production") return url?.trim() || DEV_URL;
  const problem = problemWith(url);
  if (problem) throw new Error(`NEXT_PUBLIC_SITE_URL: ${problem}. Set it in .env.production (see README).`);
  return url!;
}
