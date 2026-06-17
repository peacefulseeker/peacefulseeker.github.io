import { defineConfig, devices } from "@playwright/test";

const PORT = 4444;
const BASE_URL = `http://localhost:${PORT}`;

// Chromium is the sole test browser. The resume is static HTML/CSS with no
// browser-specific JS; cross-browser divergence risk is negligible. Mobile
// viewports are covered via test.use({ viewport }) in mobile-responsive.spec.ts
// and don't require separate device projects.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 2 : 0,
  workers: process.env["CI"] ? 1 : undefined,
  reporter: process.env["CI"] ? [["github"], ["list"]] : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `pnpm dev --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env["CI"],
    timeout: 10_000,
  },
});
