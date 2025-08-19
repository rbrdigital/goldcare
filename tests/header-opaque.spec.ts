import { test, expect } from "@playwright/test";

test("TopBar has opaque background and border", async ({ page }) => {
  await page.goto("/");
  
  // Check TopBar has non-transparent background
  const topBarBg = await page.evaluate(() => {
    const topBar = document.querySelector('[class*="sticky"][class*="top-0"]');
    if (!topBar) return null;
    return getComputedStyle(topBar as Element).backgroundColor;
  });
  
  expect(topBarBg).toBeTruthy();
  expect(topBarBg).not.toBe("rgba(0, 0, 0, 0)");
  expect(topBarBg).not.toBe("transparent");
  
  // Check TopBar has bottom border
  const topBarBorder = await page.evaluate(() => {
    const topBar = document.querySelector('[class*="sticky"][class*="top-0"]');
    if (!topBar) return null;
    return getComputedStyle(topBar as Element).borderBottomWidth;
  });
  
  expect(topBarBorder).toBeTruthy();
  expect(topBarBorder).not.toBe("0px");
});