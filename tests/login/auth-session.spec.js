const { test, expect } = require('../../fixtures/test');

test.describe('authenticated login and session @session @p0 @positive', () => {
  test.skip(!process.env.LOGIN_OTP, 'BLOCKED: set LOGIN_OTP after obtaining a valid DEV OTP to test dashboard and session behavior');

  test('logs in, verifies OTP, and persists the authenticated session', async ({ page, loginPage, context }) => {
    await loginPage.goto();
    await loginPage.fillForm({ tenant: process.env.LOGIN_TENANT || 'TNT_64201', phone: process.env.LOGIN_PHONE || '9877878990', rememberMe: true });
    const response = await loginPage.submit();
    expect(response.status()).toBeLessThan(300);
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.type(process.env.LOGIN_OTP);
    await page.getByRole('button', { name: /Verify & Continue/i }).click();
    await expect(page).toHaveURL('https://dev-lmsworkforce.aixhub.ai/dashboard');
    const state = await context.storageState();
    expect(state.cookies.length + Object.keys(await page.evaluate(() => ({ ...localStorage, ...sessionStorage }))).length).toBeGreaterThan(0);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL('https://dev-lmsworkforce.aixhub.ai/dashboard');
  });
});
