import { test, expect } from "@playwright/test";

test("right sheet changes grid layout without affecting scroll", async ({ page }) => {
  await page.goto("/");
  
  // Get initial grid columns
  const initialGrid = await page.evaluate(() => {
    const container = document.querySelector('[class*="grid-cols"]');
    return container ? getComputedStyle(container).gridTemplateColumns : null;
  });
  
  // Check if main scrollable area exists
  const mainContent = page.locator('main').first();
  const initialScrollTop = await mainContent.evaluate(el => el.scrollTop);
  
  // Try to open a side sheet (if labs button exists)
  const labsButton = page.locator('text=Previous Labs').first();
  if (await labsButton.count() > 0) {
    await labsButton.click();
    
    // Check grid changed
    await page.waitForTimeout(100); // Allow transition
    const newGrid = await page.evaluate(() => {
      const container = document.querySelector('[class*="grid-cols"]');
      return container ? getComputedStyle(container).gridTemplateColumns : null;
    });
    
    expect(newGrid).not.toBe(initialGrid);
    
    // Check scroll position maintained
    const newScrollTop = await mainContent.evaluate(el => el.scrollTop);
    expect(newScrollTop).toBe(initialScrollTop);
  }
});