import { expect, test } from "@playwright/test";

test("picking a size shows that pack in the gallery", async ({ page, isMobile }) => {
  await page.goto("/products/coconut-oil");
  const photo = page.locator("[data-gallery-photo] img");
  const thumbs = page.getByRole("list", { name: "Product images" });
  await expect(photo).toHaveAttribute("alt", /500 ml clear bottle/);

  for (const [size, alt, file] of [
    ["1 L packet, ₹ 330", "Neeram Coconut Oil, 1 litre packet", "1l-packet"],
    ["200 ml bottle, ₹ 100", "Neeram Coconut Oil, 200 ml clear bottle", "200ml-bottle"],
    ["500 ml bottle, ₹ 200", /500 ml clear bottle/, "500ml-bottle"],
  ] as const) {
    await page.getByRole("button", { name: size }).click();
    await expect(photo).toHaveAttribute("alt", alt);
    // Phones get the phone copy of the photo.
    await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(new RegExp(`${file}${isMobile ? "-mobile" : ""}\\.webp$`));
    await expect(thumbs.getByRole("button", { pressed: true })).toHaveAccessibleName(typeof alt === "string" ? new RegExp(alt) : alt);
  }

  // A thumbnail still shows any photo, and leaves the chosen size alone.
  await thumbs.getByRole("button", { name: /Close-up of the Neeram Coconut Oil label/ }).click();
  await expect(photo).toHaveAttribute("alt", /Close-up of the Neeram Coconut Oil label/);
  await expect(page.getByRole("button", { name: "500 ml bottle, ₹ 200" })).toHaveAttribute("aria-pressed", "true");
});
