import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  forbidOnly: Boolean(process.env.CI),
  workers: 1,
  retries: 0,
  globalTimeout: 180_000,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4317',
    browserName: 'chromium',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  },
  webServer: [
    {
      command: 'node tests/e2e/fixtures/api.mjs',
      url: 'http://127.0.0.1:4318/jogos',
      reuseExistingServer: false,
      gracefulShutdown: { signal: 'SIGTERM', timeout: 5_000 },
      timeout: 10_000
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 4317',
      url: 'http://127.0.0.1:4317',
      env: {
        NUXT_BACKEND_BASE: 'http://127.0.0.1:4318',
        NUXT_PUBLIC_AVATAR_BASE: 'http://127.0.0.1:4318/avatars/svg',
        NUXT_TELEMETRY_DISABLED: '1'
      },
      reuseExistingServer: false,
      gracefulShutdown: { signal: 'SIGTERM', timeout: 5_000 },
      timeout: 120_000
    }
  ]
})
