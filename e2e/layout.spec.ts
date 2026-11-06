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

// The web fonts arrive one at a time on a slow phone, so the page shows every mix of real and stand-in
// fonts on the way. Holding them back and letting them in one group at a time replays that, in both
// orders, and adds up the layout shift the way the CLS metric does.
for (const width of [360, 390, 412, 440]) {
  for (const interFirst of [true, false]) {
    test(`the home page shifts less than 0.1 at ${width} px as fonts load (${interFirst ? "Inter" : "the other fonts"} first)`, async ({ page, isMobile }) => {
      test.skip(!isMobile, "Phones only");
      await page.setViewportSize({ width, height: 823 });
      const held: { inter: boolean; done: boolean; release: () => Promise<void> }[] = [];
      const release = (pick: (h: (typeof held)[number]) => boolean) =>
        Promise.all(
          held.filter((h) => !h.done && pick(h)).map((h) => {
            h.done = true;
            return h.release();
          }),
        );
      await page.route(/\.woff2(\?|$)/, (route) => {
        held.push({ inter: route.request().url().includes("inter_subset"), done: false, release: () => route.continue() });
      });
      await page.addInitScript(() => {
        localStorage.setItem("neeram-notice-ok", "all");
        (window as unknown as { cls: number }).cls = 0;
        new PerformanceObserver((list) => {
          for (const e of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
            if (!e.hadRecentInput) (window as unknown as { cls: number }).cls += e.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
      });
      // A shift only counts once the layout before it has been painted, so wait for two frames.
      const painted = () => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      const slot = page.locator("#bottle-slot-hero");
      const boxes: string[] = [];
      const note = async () => {
        await painted();
        const b = (await slot.boundingBox())!;
        boxes.push(`top ${Math.round(b.y)}, height ${Math.round(b.height)}`);
      };

      await page.goto("/", { waitUntil: "domcontentloaded" });
      await expect(slot).toBeVisible();
      await page.waitForTimeout(300);
      await note();
      for (const group of [interFirst, !interFirst]) {
        await release((h) => h.inter === group);
        await page.waitForTimeout(500);
        await note();
      }
      // Fonts asked for after their group went (e.g. Malayalam, once its text renders).
      await page.unroute(/\.woff2(\?|$)/);
      await release(() => true);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForLoadState("load");
      await page.waitForTimeout(300);
      await note();

      const cls = await page.evaluate(() => (window as unknown as { cls: number }).cls);
      test.info().annotations.push({ type: "CLS", description: cls.toFixed(3) });
      expect(cls).toBeLessThan(0.1);
      // The bottle's space doesn't depend on the fonts: same place and size at every stage.
      expect(new Set(boxes), boxes.join(" → ")).toHaveProperty("size", 1);
    });
  }
}

// The headline is clipped while its font loads. If the font never comes, or is very slow, it must wrap
// instead, so no line is cut off.
for (const [how, width] of [["blocked", 360], ["blocked", 412], ["very slow", 360]] as const) {
  test(`the home headline stays readable at ${width} px when its font is ${how}`, async ({ page, isMobile }) => {
    test.skip(!isMobile, "Phones only");
    await page.setViewportSize({ width, height: 823 });
    await page.addInitScript(() => localStorage.setItem("neeram-notice-ok", "all"));
    // Every web font, so the headline's font is caught whatever its file is called.
    if (how === "blocked") await page.route(/\.woff2(\?|$)/, (route) => route.abort());
    else await page.route(/\.woff2(\?|$)/, async (route) => { await new Promise((r) => setTimeout(r, 6000)); await route.continue().catch(() => {}); });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3500);
    const cut = await page.locator("p.display").evaluate((p) => [...p.children].filter((line) => line.scrollWidth > p.clientWidth + 0.5).map((line) => line.textContent));
    expect(cut).toEqual([]);
    expect(await sidewaysScroll(page)).toBeLessThanOrEqual(0);
  });
}

test("the Coconut Oil page keeps its thumbnails and buy bar on a 320 px screen", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/products/coconut-oil");
  await page.waitForLoadState("networkidle");
  const thumbs = page.getByRole("list", { name: "Product images" }).getByRole("button");
  // Every pack on sale, then the label and cap close-ups.
  await expect(thumbs).toHaveCount(7);
  for (const thumb of await thumbs.all()) {
    const box = (await thumb.boundingBox())!;
    expect(box.x + box.width).toBeLessThanOrEqual(320);
    expect(box.width).toBeGreaterThanOrEqual(44);
  }
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
