import { defineConfig, devices } from '@playwright/test';
import { DEFAULT_APP_URL, loadEnvFile } from './src/infrastructure/config/env';

// Local runs read ./.env (never committed). CI injects the same variables from GitHub secrets.
loadEnvFile();

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // A stray test.only would silently shrink a "green" run; refuse it in CI.
  forbidOnly: isCI,
  // Stability evidence policy: zero retries everywhere. A test must pass on its first attempt.
  retries: 0,
  workers: isCI ? 2 : undefined,
  // Live SaaS over the public internet: generous per-test budget, strict per-assertion budget.
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ...(isCI ? ([['github'], ['json', { outputFile: 'test-results/results.json' }]] as const) : []),
  ],
  use: {
    baseURL: process.env.STONEWAKE_APP_URL ?? DEFAULT_APP_URL,
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'api',
      testDir: './tests/backend',
    },
    {
      name: 'chromium',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
