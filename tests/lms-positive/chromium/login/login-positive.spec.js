const { test, expect } = require('../../../../fixtures/test');

test.describe('LMS Chromium login flow @positive @p0', () => {
  test('logs in and reaches the dashboard', async ({ page, loginPage }) => {
    test.setTimeout(120000);

    await page.goto('https://dev-lmsworkforce.aixhub.ai/login');
    await loginPage.selectCountry('India', 'India +91');
    await loginPage.fillForm({
      tenant: process.env.LOGIN_TENANT || 'TNT_64201',
      phone: process.env.LOGIN_PHONE || '9877878990',
      rememberMe: true,
    });
    await loginPage.submit();

    const otpInput = page.getByPlaceholder('Enter OTP');
    if (await otpInput.count()) {
      await otpInput.waitFor({ state: 'visible' });
      await otpInput.fill(process.env.LOGIN_OTP || '560025');
    } else {
      const otpInputs = page
        .getByRole('heading', { name: 'Verify using phone number' })
        .locator('..')
        .getByRole('textbox');
      await otpInputs.first().waitFor({ state: 'visible' });
      for (const [index, digit] of (process.env.LOGIN_OTP || '560025').split('').entries()) {
        await otpInputs.nth(index).fill(digit);
      }
    }

    await page.getByRole('button', { name: /Verify & Continue/i }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });
});