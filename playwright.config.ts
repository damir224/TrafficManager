import { defineConfig } from '@playwright/test';

const shouldStartServer = process.env.SKIP_WEBSERVER !== '1';

export default defineConfig({
  testDir: 'e2e',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4173',
    headless: true,
  },
  webServer: shouldStartServer
    ? {
        command: 'npm run preview',
        port: 4173,
        timeout: 120_000,
        reuseExistingServer: true,
      }
    : undefined,
});
