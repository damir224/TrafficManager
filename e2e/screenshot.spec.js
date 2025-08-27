import { test } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const outPath = 'docs/screenshot.png';

try { mkdirSync('docs', { recursive: true }); } catch {}

test('capture screenshot', async ({ page }) => {
  await page.goto('/');
  const buf = await page.screenshot({ fullPage: true });
  writeFileSync(outPath, buf);
});
