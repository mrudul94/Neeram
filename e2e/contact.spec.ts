import { expect, test } from "@playwright/test";

// Test mode (playwright.config.ts) logs the email instead of sending it through Resend.

test("the contact form sends a message without opening an email app", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Your name").fill("Test Customer");
  await page.getByLabel("Your email").fill("test@example.com");
  await page.getByLabel("Message").fill("TEST: do you deliver to Bengaluru?");
  const sent = page.waitForResponse((r) => r.url().endsWith("/api/contact"));
  await page.getByRole("button", { name: "Send message" }).click();
  expect((await sent).status()).toBe(200);
  await expect(page.getByRole("status")).toContainText("Message sent");
  expect(new URL(page.url()).pathname).toBe("/contact");
});

test("the contact form points out missing fields", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Please enter your name.")).toBeVisible();
  await expect(page.getByText("Please enter your email, so we can reply.")).toBeVisible();
  await expect(page.getByText("Please write your message.")).toBeVisible();
  await expect(page.getByLabel("Your name")).toBeFocused();
});

test("the contact API refuses an incomplete message", async ({ request }) => {
  const res = await request.post("/api/contact", { data: { fields: { name: "A", email: "nope", message: "" } } });
  expect(res.status()).toBe(400);
  expect((await res.json()).errors).toMatchObject({ email: expect.any(String), message: expect.any(String) });
});

test("both forms turn away posts made from another website", async ({ request }) => {
  const headers = { "Sec-Fetch-Site": "cross-site", Origin: "https://other.example" };
  const contact = await request.post("/api/contact", { headers, data: { fields: { name: "A", email: "a@b.co", message: "hi" } } });
  expect(contact.status()).toBe(403);
  const checkout = await request.post("/api/checkout", { headers, data: { lines: [{ slug: "coconut-oil", pack: "bottle-500", qty: 1 }], details: {} } });
  expect(checkout.status()).toBe(403);
});

test("pages don't announce the framework", async ({ request }) => {
  expect((await request.get("/contact")).headers()["x-powered-by"]).toBeUndefined();
});
