import { test, expect } from "@playwright/test";

test("uses CSS variables for colors", async ({ page }) => {
  await page.goto("/");
  const color = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--color-bg").trim());
  expect(color).not.toBe("");
  const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bodyBg).toBeTruthy();
});

test("theme switching works", async ({ page }) => {
  await page.goto("/");
  
  // Check light theme
  const lightBg = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--color-bg").trim());
  expect(lightBg).toBe("#ffffff");
  
  // Switch to dark theme (assuming there's a theme toggle)
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  
  // Check dark theme - ChatGPT style colors
  const darkBg = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--color-bg").trim());
  expect(darkBg).toBe("hsl(225, 7%, 13%)"); // #202123
});