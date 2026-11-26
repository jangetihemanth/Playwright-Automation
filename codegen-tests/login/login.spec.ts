import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Codegen Module - Standard Login Flow', () => {
  const tenant = process.env.LOGIN_TENANT || 'TNT_64201';
  const phone = process.env.LOGIN_PHONE || '9877878990';
  const otp = process.env.LOGIN_OTP || '560025';

  test('should login with tenant code and phone via OTP', async ({ page }) => {
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

    const otpModalHeading = page.getByRole('heading', { name: 'Verify using phone number' });
    await expect(otpModalHeading).toBeVisible();
    const firstOtpInput = otpModalHeading.locator('..').getByRole('textbox').first();
    await firstOtpInput.click();
    await page.keyboard.type(otp, { delay: 150 });

    await page.getByRole('button', { name: /Verify & Continue/i }).click();

    await expect(page).not.toHaveURL(/login/);
    await expect(page.locator('body')).toContainText(/dashboard|welcome|home/i);
  });
});
