import { defineConfig, devices } from "@playwright/test";

const BASE_URL = "http://localhost:53200";
const MOCK_API = "http://127.0.0.1:53250/api";

export default defineConfig({
  testDir: "./e2e",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  use: { baseURL: BASE_URL, trace: "on-first-retry" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "node e2e/mock-api.mjs",
      port: 53250,
      reuseExistingServer: !process.env.CI,
    },
    {
      // point the Next server-side fetches at the fixture API
      command: "pnpm dev",
      url: BASE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: { API_URL: MOCK_API },
    },
  ],
});
