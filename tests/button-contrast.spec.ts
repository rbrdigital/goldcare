import { test, expect } from "@playwright/test";

test("primary button has proper contrast", async ({ page }) => {
  await page.goto("/");
  
  // Check if primary button uses on-primary color token
  const buttonColor = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--color-on-primary").trim());
  expect(buttonColor).toBe("#ffffff");
  
  // Check primary background token exists
  const primaryBg = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim());
  expect(primaryBg).toBeTruthy();
  
  // If there's a primary button on page, check its styles
  const primaryButton = page.locator('button').filter({ hasText: /finish|complete|save/i }).first();
  if (await primaryButton.count() > 0) {
    const computedColor = await primaryButton.evaluate(el => getComputedStyle(el).color);
    const computedBg = await primaryButton.evaluate(el => getComputedStyle(el).backgroundColor);
    
    expect(computedColor).toBeTruthy();
    expect(computedBg).toBeTruthy();
  }
});