import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: './src/utils/allure-environment.ts',

  testDir: './src/tests',

  timeout: 30000,

  retries: 0,

  forbidOnly: !!process.env.CI,

  use: {
    baseURL: 'https://serverest.dev',

    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  },

  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: 'reports/playwright-report',
        open: 'never',
      },
    ],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
      },
    ],
    [
      'junit',
      {
        outputFile: 'reports/junit/results.xml',
      },
    ],
  ],
});