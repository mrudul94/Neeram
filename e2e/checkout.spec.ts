import { expect, test } from "@playwright/test";

// The cookie notice has its own tests (legal.spec.ts); keep it from covering these flows.
test.beforeEach(({ page }) => page.addInitScript(() => localStorage.setItem("neeram-notice-ok", "1")));

test("orders coconut oil in a chosen size through WhatsApp", async ({ page, context }) => {
  // Stand in for WhatsApp: record where the order tab goes, without leaving the test.
  await context.route("https://wa.me/**", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<p>WhatsApp</p>" }));

  await page.goto("/products/coconut-oil");

  // Pick the 1 L bottle and two of them.
  await page.getByRole("button", { name: "1 L bottle, ₹ 270" }).click();
  const qty = page.getByRole("group", { name: "Quantity for Coconut Oil" }).locator("visible=true");
  await qty.getByRole("button", { name: "Increase quantity" }).click();
  await expect(qty.locator("output")).toHaveText("2");
  // Desktop shows "Add to cart"; the mobile buy bar shows "Add 1 L · ₹ 540".
  await page.getByRole("button", { name: /^Add (to cart|1 L · ₹ 540)$/ }).locator("visible=true").click();

  // Adding opens the cart drawer.
  const cart = page.getByRole("dialog", { name: /Your cart/ });
  await expect(cart).toBeVisible();
  await expect(cart.getByText("വെളിച്ചെണ്ണ · 1 L bottle")).toBeVisible();
  await expect(cart.getByText("2 items")).toBeVisible();
  await cart.getByRole("link", { name: "Checkout" }).click();

  await expect(page).toHaveURL(/\/checkout$/);
  await page.getByLabel("Mobile number (WhatsApp)").fill("98765-43210");
  await page.getByLabel("First name").fill("Anu");
  await page.getByLabel("Last name").fill("Thomas");
  await page.getByLabel("House name, street").fill("Kallarakkal House, MG Road");
  await page.getByLabel("Town / city").fill("Kochi");
  await page.getByLabel("PIN code").fill("682011");
  await page.getByLabel("State").selectOption("Kerala");
  await page.getByLabel("Landmark (optional)").fill("St. Mary's Church");

  // Turnstile (test key, always passes) hands the form its token.
  await expect(page.locator('input[name="cf-turnstile-response"]')).toHaveValue(/.+/, { timeout: 15_000 });

  const [whatsapp] = await Promise.all([
    context.waitForEvent("page"),
    page.getByRole("button", { name: "Send order on WhatsApp · ₹ 540" }).click(),
  ]);
  await whatsapp.waitForURL("https://wa.me/**");

  const link = new URL(whatsapp.url());
  expect(link.pathname).toBe("/919747844455");
  const message = link.searchParams.get("text")!;
  expect(message).toContain("• 2 × Coconut Oil (1 L bottle): ₹ 540");
  expect(message).toContain("Subtotal: ₹ 540");
  expect(message).toContain("Name: Anu Thomas");
  expect(message).toContain("Phone: +91 98765 43210");
  expect(message).toContain("Address: Kallarakkal House, MG Road, Near St. Mary's Church, Kochi, Kerala 682011");

  // The order is sent, so the cart is emptied and the customer goes back to the shop.
  await expect(page).toHaveURL(/\/shop$/);
});

test("new-stock requests open WhatsApp with the message ready to send", async ({ page }) => {
  await page.goto("/shop");
  await expect(page.locator("footer").getByRole("link", { name: /Message us on WhatsApp/ })).toHaveAttribute("href", /wa\.me.*new%20stock/);

  await page.goto("/products/turmeric");
  await expect(page.getByRole("link", { name: /Notify me on WhatsApp/ })).toHaveAttribute("href", /wa\.me.*Turmeric/);
});

test("checkout's order summary changes quantities and removes lines", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "neeram-cart",
      JSON.stringify({ state: { lines: [{ slug: "coconut-oil", pack: "bottle-1l", qty: 1 }, { slug: "coconut-oil", pack: "bottle-200", qty: 1 }] }, version: 0 }),
    ),
  );
  await page.goto("/checkout");
  const summary = page.getByRole("complementary", { name: "Your order" });
  const total = summary.getByText(/^₹ \d+$/).last();
  await expect(total).toHaveText("₹ 328");

  const litre = summary.getByRole("group", { name: "Quantity for Coconut Oil, 1 L bottle" });
  await litre.getByRole("button", { name: "Increase quantity" }).click();
  await expect(litre.locator("output")).toHaveText("2");
  await expect(total).toHaveText("₹ 598");
  await expect(page.getByRole("button", { name: "Send order on WhatsApp · ₹ 598" })).toBeVisible();

  await litre.getByRole("button", { name: "Decrease quantity" }).click();
  await expect(total).toHaveText("₹ 328");

  // Removing a line takes it off the order; removing the last one empties the cart.
  await summary.getByRole("button", { name: "Remove" }).first().click();
  await expect(total).toHaveText("₹ 58");
  await summary.getByRole("button", { name: "Remove" }).click();
  await expect(page.getByText("Your cart is empty.")).toBeVisible();
});

test("the order button works while the bot check is still running", async ({ page, context }) => {
  await context.route("https://wa.me/**", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<p>WhatsApp</p>" }));
  // Hold Cloudflare's script back, so the check is still running when the button is pressed.
  await page.route("https://challenges.cloudflare.com/turnstile/v0/api.js*", async (route) => {
    await new Promise((r) => setTimeout(r, 4000));
    await route.continue();
  });
  await page.addInitScript(() =>
    localStorage.setItem("neeram-cart", JSON.stringify({ state: { lines: [{ slug: "coconut-oil", pack: "bottle-500", qty: 1 }] }, version: 0 })),
  );
  await page.goto("/checkout");
  await page.getByLabel("Mobile number (WhatsApp)").fill("98765 43210");
  await page.getByLabel("First name").fill("Anu");
  await page.getByLabel("Last name").fill("Thomas");
  await page.getByLabel("House name, street").fill("MG Road");
  await page.getByLabel("Town / city").fill("Kochi");
  await page.getByLabel("PIN code").fill("682011");
  await page.getByLabel("State").selectOption("Kerala");

  // No token yet, and the button is ready anyway.
  await expect(page.locator('input[name="cf-turnstile-response"]')).toHaveCount(0);
  const send = page.getByRole("button", { name: "Send order on WhatsApp · ₹ 135" });
  await expect(send).toBeEnabled();

  const [whatsapp] = await Promise.all([context.waitForEvent("page"), send.click()]);
  await expect(page.getByRole("button", { name: "Verifying…" })).toBeVisible();
  // Once the check finishes, the order goes through on its own.
  await whatsapp.waitForURL("https://wa.me/**", { timeout: 20_000 });
  expect(new URL(whatsapp.url()).searchParams.get("text")).toContain("1 × Coconut Oil (500 ml bottle): ₹ 135");
  await expect(page).toHaveURL(/\/shop$/);
});
