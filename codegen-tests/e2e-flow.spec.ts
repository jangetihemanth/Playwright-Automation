import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Authentication - Login Flow', () => {
  const tenant = process.env.LOGIN_TENANT || 'TNT_64201';
  const phone = process.env.LOGIN_PHONE || '9877878990';
  const otp = process.env.LOGIN_OTP || '560025';

  test('should login successfully with tenant code, phone and OTP', async ({ page }) => {
    test.setTimeout(60000);

    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.heading).toBeVisible();
    await loginPage.selectCountry('India', /India \+91/);
    await expect(loginPage.countryButton).toHaveText('+91');

    await loginPage.fillForm({
      tenant,
      phone,
      rememberMe: true,
    });

    await expect(loginPage.tenantCode).toHaveValue(tenant);
    await expect(loginPage.phoneNumber).toHaveValue(phone);

    await loginPage.submit();

    const otpInput = page.getByPlaceholder('Enter OTP');
    if (await otpInput.count()) {
      await otpInput.waitFor({ state: 'visible' });
      await otpInput.fill(otp);
    } else {
      const otpInputs = page
        .getByRole('heading', { name: 'Verify using phone number' })
        .locator('..')
        .getByRole('textbox');

      await otpInputs.first().waitFor({ state: 'visible' });
      for (const [index, digit] of otp.split('').entries()) {
        await otpInputs.nth(index).fill(digit);
      }
    }

    await page.getByRole('button', { name: /Verify & Continue/i }).click();

    // Verify dashboard navigation
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('body')).toContainText(/dashboard|welcome|home/i);
  });
});
