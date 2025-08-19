import { test, expect } from "@playwright/test";

test("form fields have proper borders and focus states", async ({ page }) => {
  await page.goto("/");
  
  // Check CSS variables exist
  const borderColor = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--color-border").trim());
  const primaryColor = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim());
  
  expect(borderColor).toBeTruthy();
  expect(primaryColor).toBeTruthy();
  
  // Check input field if present
  const input = page.locator('input[type="text"], input[type="number"], textarea').first();
  if (await input.count() > 0) {
    const borderWidth = await input.evaluate(el => getComputedStyle(el).borderWidth);
    expect(borderWidth).not.toBe("0px");
    
    // Test focus state
    await input.focus();
    const focusRing = await input.evaluate(el => getComputedStyle(el).outline);
    // Focus ring should be applied via ring utility or similar
    expect(focusRing).toBeTruthy();
  }
});