import { defineConfig, devices } from "@playwright/test";

/**
 * Smoke tests for the main user journeys.
 *   npm run build && npm run test:e2e
 * (first time: npx playwright install chromium)
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    launchOptions: process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : undefined,
  },
  webServer: process.env.BASE_URL
    ? undefined
    : { command: "npm run start", url: "http://localhost:3000", reuseExistingServer: true },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
