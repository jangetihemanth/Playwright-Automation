import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

type CustomFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  diagnostics: void;
};

export const test = base.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  diagnostics: [
    async ({ page }, use, testInfo) => {
      const consoleErrors: string[] = [];
      const failedRequests: Array<{ url: string; error?: string }> = [];

      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });

      page.on('requestfailed', (request) => {
        failedRequests.push({
          url: request.url(),
          error: request.failure()?.errorText,
        });
      });

      await use(undefined);

      if (consoleErrors.length) {
        await testInfo.attach('console-errors', {
          body: consoleErrors.join('\n'),
          contentType: 'text/plain',
        });
      }

      if (failedRequests.length) {
        await testInfo.attach('failed-requests', {
          body: JSON.stringify(failedRequests, null, 2),
          contentType: 'application/json',
        });
      }
    },
    { auto: true },
  ] as any,
});

export { expect };
