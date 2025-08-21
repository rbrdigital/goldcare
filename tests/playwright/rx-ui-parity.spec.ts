import { test, expect } from "@playwright/test";

test("RX maintains visual parity with SOAP Note", async ({ page }) => {
  await page.goto("/");
  
  // Navigate to RX tab
  await page.click('[data-testid="sidebar-rx"]');
  
  // Assert RX page main container has white background
  const rxContainer = page.locator('[data-testid="rx-form-root"]').first();
  const rxContainerBg = await rxContainer.evaluate((el) => 
    getComputedStyle(el).backgroundColor
  );
  
  const bodyBg = await page.evaluate(() => 
    getComputedStyle(document.body).backgroundColor
  );
  
  // RX Order card should NOT match body (should be surface)
  expect(rxContainerBg).not.toBe(bodyBg);
  
  // Navigate to SOAP to compare
  await page.click('[data-testid="sidebar-soap"]');
  
  // Get SOAP suggestion card styling for comparison
  const soapSuggestion = page.locator('.rounded-lg.bg-surface').first();
  await expect(soapSuggestion).toBeVisible();
  
  const soapSuggestionRadius = await soapSuggestion.evaluate((el) => 
    getComputedStyle(el).borderRadius
  );
  
  // Back to RX to compare radius
  await page.click('[data-testid="sidebar-rx"]');
  
  const rxCardRadius = await rxContainer.evaluate((el) => 
    getComputedStyle(el).borderRadius
  );
  
  // Both should use rounded-md
  expect(rxCardRadius).toBe(soapSuggestionRadius);
  
  // Check for shadow consistency - RX should not have excessive shadows
  const rxBoxShadow = await rxContainer.evaluate((el) => 
    getComputedStyle(el).boxShadow
  );
  
  // Should be minimal or none, not heavy shadows
  expect(rxBoxShadow).not.toContain('rgba(0, 0, 0, 0.25)');
});