import { test, expect } from '../../fixtures/test';

const viewports = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'tablet', width: 1024, height: 768 },
  { name: 'mobile', width: 390, height: 844 },
];

for (const viewport of viewports) {
  test(`login is usable at ${viewport.name} size @responsive @p1`, async ({ page, loginPage }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await loginPage.goto();

    const rememberLabel = page.getByText('Remember Me');

    if (viewport.name === 'mobile') {
      await page.waitForLoadState('domcontentloaded');
      await expect(loginPage.rememberMe).toBeVisible();
      await expect(loginPage.rememberMe).not.toBeChecked();
      await expect(rememberLabel).toHaveText('Remember Me');
      await expect(rememberLabel).toHaveCSS('color', 'rgb(107, 114, 128)');
      await expect(rememberLabel).toHaveCSS('font-size', '14px');
    }

    await expect(loginPage.heading).toBeVisible();
    await expect(loginPage.tenantCode).toBeVisible();
    await expect(loginPage.phoneNumber).toBeVisible();
    await expect(loginPage.signInButton).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
  });
}

test('records page timing and first contentful paint @performance @p1', async ({ page, loginPage }) => {
  await loginPage.goto();
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByName('first-contentful-paint')[0];
    const nav = navigation as PerformanceNavigationTiming | undefined;
    return { domContentLoaded: nav?.domContentLoadedEventEnd, load: nav?.loadEventEnd, fcp: paint?.startTime ?? null };
  });
  expect(metrics.domContentLoaded).toBeGreaterThan(0);
  expect(metrics.load).toBeGreaterThan(0);
});
