import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  webServer: [
    {
      command: "npm run dev:backend",
      url: "http://localhost:3000/health",
      cwd: "..",
      name: "backend",
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "npm run dev:frontend",
      url: "http://localhost:5173",
      cwd: "..",
      name: "frontend",
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
    },
  ],
  use: {
    baseURL: "http://localhost:5173",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
