// const { defineConfig, devices } = require('@playwright/test');

// module.exports = defineConfig({
//   testDir: './tests',

//   fullyParallel: false,

//   workers: 1,

//   reporter: 'html',

//   use: {
//     headless: false,
//     trace: 'on-first-retry',
//   },

//   projects: [
//     {
//       name: 'chromium',
//       use: { ...devices['Desktop Chrome'] },
//       viewport: { width: 1536, height: 960 },
//       video: 'on',
//       screenshot: 'on',
//       trace: 'on',
//     },

//     // {
//     //   name: 'firefox',
//     //   use: { ...devices['Desktop Firefox'] },
//     //   viewport: { width: 1536, height: 960 },
//     // },

//     // {
//     //   name: 'webkit',
//     //   use: { ...devices['Desktop Safari'] },
//     //   viewport: { width: 1536, height: 960 },
//     // },
//   ],
// });   this is previous code which is commented out and below is the new code which is added to the playwright.config.js file
const fs = require('fs');
const path = require('path');
const { defineConfig, devices } = require('@playwright/test');

const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}

module.exports = defineConfig({
  testDir: './tests',

  fullyParallel: false,

  workers: 1,

  timeout: 30000,

  expect: {
    timeout: 10000,
  },

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['./reporters/users-summary-reporter.js'],
    ['./reporters/skill-categories-summary-reporter.js'],
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