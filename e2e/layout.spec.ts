import { expect, test, type Page } from "@playwright/test";

const pages = ["/", "/shop", "/about", "/help", "/privacy", "/terms", "/products/coconut-oil", "/products/turmeric", "/checkout"];

const sidewaysScroll = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

for (const path of pages) {
  test(`${path} doesn't scroll sideways on a 320 px phone`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(path);
    // Measured once the page has finished loading: a poll could pass on a half-loaded page.
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1").first()).toBeVisible();
    expect(await sidewaysScroll(page)).toBeLessThanOrEqual(0);
  });
}

test("the Coconut Oil page keeps its thumbnails and buy bar on a 320 px screen", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/products/coconut-oil");
  await page.waitForLoadState("networkidle");
  const thumbs = page.getByRole("list", { name: "Product images" }).getByRole("button");
  await expect(thumbs).toHaveCount(4);
  const lastThumb = (await thumbs.last().boundingBox())!;
  expect(lastThumb.x + lastThumb.width).toBeLessThanOrEqual(320);
  const add = (await page.locator(".mobile-buy-bar").getByRole("button", { name: /^Add/ }).boundingBox())!;
  expect(add.x + add.width).toBeLessThanOrEqual(320);
  expect(await sidewaysScroll(page)).toBeLessThanOrEqual(0);
});

for (const width of [1920, 2560]) {
  test(`the product page keeps its buy column at ${width} px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1200 });
    await page.goto("/products/coconut-oil");
    const box = await page.locator("h1").boundingBox();
    expect(box!.width).toBeGreaterThan(450);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Coconut Oil");
  });
}

for (const width of [1920, 2560]) {
  test(`checkout keeps its form and order summary at ${width} px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1200 });
    await page.goto("/products/coconut-oil");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Add to cart", exact: true }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.goto("/checkout");
    await expect(page.getByLabel("First name")).toBeVisible();
    expect((await page.getByLabel("First name").boundingBox())!.width).toBeGreaterThan(300);
    expect((await page.getByRole("heading", { name: "Your order" }).boundingBox())!.width).toBeGreaterThan(300);
  });
}

test("the home page bottle keeps its shape on a 320 px phone", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  const bottle = page.getByAltText("Neeram Coconut Oil in its clear 500 ml bottle");
  await bottle.scrollIntoViewIfNeeded();
  await expect.poll(() => bottle.evaluate((e: HTMLImageElement) => e.naturalWidth)).toBeGreaterThan(0);
  const ratio = await bottle.evaluate((e: HTMLImageElement) => e.offsetWidth / e.offsetHeight / (e.naturalWidth / e.naturalHeight));
  expect(ratio).toBeCloseTo(1, 1);
});

test("Escape closes the phone menu and returns focus to its button", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/shop");
  const open = page.getByRole("button", { name: "Open menu" });
  await open.click();
  await expect(page.locator("#mobile-menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-menu")).toHaveCount(0);
  await expect(open).toBeFocused();
});
