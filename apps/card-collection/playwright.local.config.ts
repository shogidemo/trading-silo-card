import { defineConfig } from "@playwright/test";
import config from "./playwright.config";

// 他のMac作業や既存の3000番サーバーを使わず、専用サーバーで検証する。
export default defineConfig({
  ...config,
  workers: 2,
  reporter: "line",
  use: { ...config.use, baseURL: "http://127.0.0.1:3012" },
  webServer: {
    command: "corepack pnpm exec next dev --hostname 127.0.0.1 --port 3012",
    url: "http://127.0.0.1:3012",
    reuseExistingServer: false,
    timeout: 120000,
    env: { NEXT_PUBLIC_E2E: "1" },
  },
});
