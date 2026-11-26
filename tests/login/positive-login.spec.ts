import { test, expect } from '../../fixtures/test';

const canRunPositiveLogin = Boolean(process.env.LOGIN_OTP);

test.describe('positive login @positive @p0', () => {
  test.skip(!canRunPositiveLogin, 'BLOCKED: set LOGIN_OTP after obtaining a valid DEV OTP for the configured credentials');

  test('logs in with valid India credentials and reaches the actual dashboard', async ({ page, loginPage, context }) => {
    await loginPage.goto();
    await expect(loginPage.heading).toBeVisible();
    await loginPage.selectCountry('India', 'India +91');
    await expect(loginPage.countryButton).toHaveText('+91');
    await loginPage.fillForm({
      tenant: process.env.LOGIN_TENANT || 'TNT_64201',
      phone: process.env.LOGIN_PHONE || '9877878990',
      rememberMe: true,
    });
    await expect(loginPage.tenantCode).toHaveValue(process.env.LOGIN_TENANT || 'TNT_64201');
    await expect(loginPage.phoneNumber).toHaveValue(process.env.LOGIN_PHONE || '9877878990');

    const response = await loginPage.submit();
    expect(response.status()).toBe(201);
    await expect(page.getByRole('heading', { name: 'Verify using phone number' })).toBeVisible();
    await page.keyboard.type(process.env.LOGIN_OTP);
    await page.getByRole('button', { name: /Verify & Continue/i }).click();

    await expect(page).toHaveURL('https://dev-lmsworkforce.aixhub.ai/dashboard');
    await expect(page.locator('body')).toContainText(/dashboard|welcome|home/i);
    const storage = await context.storageState();
    const browserStorage = await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }));
    expect(storage.cookies.length + Object.keys(browserStorage.local).length + Object.keys(browserStorage.session).length).toBeGreaterThan(0);
  });
});
