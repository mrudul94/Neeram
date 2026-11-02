import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const notice = (page: import("@playwright/test").Page) => page.getByRole("complementary", { name: "Cookie notice" });

test("the cookie notice stays gone after OK, across a reload", async ({ page }) => {
  await page.goto("/shop");
  await expect(notice(page)).toBeVisible();

  await notice(page).getByRole("button", { name: "Got it" }).click();
  await expect(notice(page)).toBeHidden();

  await page.reload();
  await page.getByRole("heading", { name: "The shelf" }).waitFor();
  await page.waitForTimeout(1800); // Longer than its entrance delay.
  await expect(notice(page)).toBeHidden();
});

const overlap = (a: { x: number; y: number; width: number; height: number }, b: typeof a) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

test("on phones the notice stays off the bottle's first screen, then appears further down", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Phones only");
  await page.goto("/");
  await page.waitForTimeout(1800);
  await expect(notice(page)).toBeHidden();

  await page.getByRole("heading", { name: /A short shelf/ }).scrollIntoViewIfNeeded();
  await expect(notice(page)).toBeVisible();
});

test("on desktop the notice appears beside the hero bottle, not over it", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop only");
  await page.goto("/");
  await expect(notice(page)).toBeVisible();
  expect(overlap((await notice(page).boundingBox())!, (await page.locator(".bottle-mover").boundingBox())!)).toBe(false);
});

test("the notice never covers the checkout button", async ({ page }) => {
  await page.goto("/products/coconut-oil");
  await page.getByRole("button", { name: /^Add/ }).locator("visible=true").first().click();
  await page.getByRole("link", { name: "Checkout" }).click();
  const submit = page.getByRole("button", { name: /Send order on WhatsApp/ });
  await submit.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  if (await notice(page).isVisible()) expect(overlap((await notice(page).boundingBox())!, (await submit.boundingBox())!)).toBe(false);
  await expect(submit).toBeEnabled();
  await submit.click({ trial: true });
});

test("the notice sits above the mobile buy bar, which stays usable", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Phones only");
  await page.goto("/products/coconut-oil");
  await expect(notice(page)).toBeVisible();

  const bar = await page.locator(".mobile-buy-bar").boundingBox();
  const box = await notice(page).boundingBox();
  expect(box!.y + box!.height).toBeLessThanOrEqual(bar!.y + 1);

  await page.locator(".mobile-buy-bar").getByRole("button", { name: /^Add/ }).click();
  await expect(page.getByRole("dialog", { name: /Your cart/ })).toBeVisible();
});

test("the footer reaches the privacy policy and terms", async ({ page }) => {
  await page.goto("/shop");
  await page.locator("footer").getByRole("link", { name: "Privacy policy", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Privacy policy" })).toBeVisible();

  await page.locator("footer").getByRole("link", { name: "Terms of service" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Terms of service" })).toBeVisible();
  await expect(page.getByText("Draft, pending legal review").locator("visible=true")).toBeVisible();
});

test("checkout links to the terms in a new tab, keeping what's typed", async ({ page, context }) => {
  await page.addInitScript(() => localStorage.setItem("neeram-notice-ok", "1"));
  await page.goto("/products/coconut-oil");
  await page.getByRole("button", { name: /^Add/ }).locator("visible=true").first().click();
  await page.getByRole("link", { name: "Checkout" }).click();
  await page.getByLabel("First name").fill("Anu");

  const [terms] = await Promise.all([context.waitForEvent("page"), page.getByRole("link", { name: "Terms", exact: true }).click()]);
  await expect(terms.getByRole("heading", { level: 1, name: "Terms of service" })).toBeVisible();
  await expect(page.getByLabel("First name")).toHaveValue("Anu");
});

test("images are cached in the browser for a week", () => {
  // The production server doesn't read public/_headers (Cloudflare does), so check the file's rules.
  const headers = readFileSync("public/_headers", "utf8").replace(/\r/g, "");
  for (const path of ["/images/*", "/bottle/*"]) {
    expect(headers).toContain(`${path}\n  Cache-Control: public,max-age=604800,stale-while-revalidate=2592000`);
  }
});
