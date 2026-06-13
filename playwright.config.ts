import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 2 : 0,
  workers: process.env["CI"] ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: "http://localhost:4444",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    // Mobile viewport projects — active from Story 06 onward.
    // Added here so story-06 tests can reference them without touching this file.
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] }, // 393px — covers the 375px AC with some margin
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone SE"] }, // 375px
    },
  ],
  webServer: {
    command: "pnpm dev --port 4444",
    url: "http://localhost:4444",
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
