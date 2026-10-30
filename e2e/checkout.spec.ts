import { expect, test } from "@playwright/test";

test("orders coconut oil in a chosen size through WhatsApp", async ({ page, context }) => {
  // Stand in for WhatsApp: record where the order tab goes, without leaving the test.
  await context.route("https://wa.me/**", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<p>WhatsApp</p>" }));

  await page.goto("/products/coconut-oil");

  // Pick the 1 L bottle and two of them.
  await page.getByRole("button", { name: "1 L bottle, ₹ 260" }).click();
  const qty = page.getByRole("group", { name: "Quantity for Coconut Oil" }).locator("visible=true");
  await qty.getByRole("button", { name: "Increase quantity" }).click();
  await expect(qty.locator("output")).toHaveText("2");
  // Desktop shows "Add to cart"; the mobile buy bar shows "Add 1 L · ₹ 520".
  await page.getByRole("button", { name: /^Add (to cart|1 L · ₹ 520)$/ }).locator("visible=true").click();

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

  const [whatsapp] = await Promise.all([
    context.waitForEvent("page"),
    page.getByRole("button", { name: "Send order on WhatsApp · ₹ 520" }).click(),
  ]);
  await whatsapp.waitForURL("https://wa.me/**");

  const link = new URL(whatsapp.url());
  expect(link.pathname).toBe("/918075915386");
  const message = link.searchParams.get("text")!;
  expect(message).toContain("• 2 × Coconut Oil (1 L bottle): ₹ 520");
  expect(message).toContain("Subtotal: ₹ 520");
  expect(message).toContain("Name: Anu Thomas");
  expect(message).toContain("Phone: +91 98765 43210");
  expect(message).toContain("Address: Kallarakkal House, MG Road, Near St. Mary's Church, Kochi, Kerala 682011");

  // The order is sent, so the cart is emptied and the customer goes back to the shop.
  await expect(page).toHaveURL(/\/shop$/);
});
