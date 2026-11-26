import fs from 'fs';
import path from 'path';
import { defineConfig, devices } from '@playwright/test';

const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    }
  }
}

export default defineConfig({
  testDir: '.',
  testMatch: ['tests/**/*.spec.ts', 'codegen-tests/**/*.spec.ts', 'single-apis-integration/**/*.spec.ts'],

  fullyParallel: false,

  workers: 1,

  timeout: 30000,

  expect: {
    timeout: 10000,
  },

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['./reporters/users-summary-reporter.ts'],
    ['./reporters/skill-categories-summary-reporter.ts'],
    ['./reporters/employee-step1-summary-reporter.ts'],
  ],

  use: {
    headless: false,

    baseURL: 'https://dev-lmsworkforce.aixhub.ai',

    launchOptions: {
      slowMo: process.env.HUMAN_MODE === 'true' ? 3000 : 0,
    },

    screenshot: 'on',

    video: 'on',

    trace: 'on',

    actionTimeout: 10000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1536, height: 960 },
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1536, height: 960 },
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1536, height: 960 },
      },
    },
  ],
});
