const base = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');

const test = base.test.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  diagnostics: [async ({ page }, use, testInfo) => {
    const consoleErrors = [];
    const failedRequests = [];
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('requestfailed', request => {
      failedRequests.push({ url: request.url(), error: request.failure()?.errorText });
    });
    await use();
    if (consoleErrors.length) await testInfo.attach('console-errors', { body: consoleErrors.join('\n'), contentType: 'text/plain' });
    if (failedRequests.length) await testInfo.attach('failed-requests', { body: JSON.stringify(failedRequests, null, 2), contentType: 'application/json' });
  }, { auto: true }],
});

module.exports = { test, expect: base.expect };
