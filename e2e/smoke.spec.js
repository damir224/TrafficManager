import { test, expect } from '@playwright/test';

test('smoke: preview serves page, canvas and hud appear, no console errors', async ({ page }) => {
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto('/');
  await expect(page.locator('#hud-root')).toBeVisible();
  await expect(page.locator('canvas')).toBeVisible();

  await page.waitForTimeout(3000);
  expect(errors, errors.join('\n')).toHaveLength(0);
});
