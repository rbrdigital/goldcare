import { test, expect } from "@playwright/test";

test("root uses white background for panels in light mode", async ({ page }) => {
  await page.goto("/");
  
  // Open RX Form
  await page.click('[data-testid="sidebar-rx"]');
  
  // Navigate to GoldCare AI panel
  await page.click('[data-testid="goldcare-ai-trigger"]');
  
  const panelSelectors = ['[data-testid="panel-goldcare-ai"]', '[data-testid="rx-form-root"]'];
  
  for (const sel of panelSelectors) {
    const bg = await page.evaluate((s) => {
      const el = document.querySelector(s);
      return el ? getComputedStyle(el).backgroundColor : null;
    }, sel);
    
    // computed color must equal body background
    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe(bodyBg);
  }
});