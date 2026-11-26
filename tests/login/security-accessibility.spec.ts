import { test, expect } from '../../fixtures/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('login security and accessibility @security @accessibility @p1', () => {
  test('has no serious or critical accessibility violations', async ({ page, loginPage }) => {
    await loginPage.goto();
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(item => ['serious', 'critical'].includes(item.impact));
    expect(serious).toEqual([]);
  });

  test('supports tab order and Space for Remember Me', async ({ page, loginPage }) => {
    await loginPage.goto();
    await page.keyboard.press('Tab');
    await expect(loginPage.tenantCode).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(loginPage.countryButton).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(loginPage.phoneNumber).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(loginPage.rememberMe).toBeFocused();
    await page.keyboard.press('Space');
    await expect(loginPage.rememberMe).toBeChecked();
  });

  test('treats injection values as text and never navigates or executes script @security', async ({ page, loginPage }) => {
    let dialogShown = false;
    page.on('dialog', () => { dialogShown = true; });
    await loginPage.goto();
    await loginPage.fillForm({ tenant: '<script>alert(1)</script>', phone: '$(whoami)' });
    await loginPage.submit();
    await expect(loginPage.invalidCredentials).toBeVisible();
    expect(dialogShown).toBeFalsy();
    expect(page.url()).toMatch(/^https:\/\/dev-lmsworkforce\.aixhub\.ai\/login$/);
  });
});
