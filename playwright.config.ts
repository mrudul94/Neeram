import { defineConfig, devices } from "@playwright/test";

// A production build, as customers get it (dev mode adds an overlay over the mobile buy bar).
const PORT = 3100;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    // Test mode keeps orders off the Google Sheet and in data/orders.test.jsonl. The Turnstile
    // keys are Cloudflare's test keys (always pass), so the real widget and server check run
    // without a human challenge. Always start our own server so these are set.
    env: {
      ORDERS_TEST_MODE: "1",
      STORE_JSON_SUFFIX: "test",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
      TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
    },
    reuseExistingServer: false,
    timeout: 300_000,
  },
});
