// CommonJS Playwright config for broader Node compatibility
/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  testDir: 'e2e',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4173',
    headless: true,
  },
  webServer: process.env.SKIP_WEBSERVER === '1'
    ? undefined
    : {
        command: 'npm run preview',
        port: 4173,
        timeout: 120000,
        reuseExistingServer: true,
      },
};
