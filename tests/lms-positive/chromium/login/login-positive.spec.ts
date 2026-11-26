import { test, expect } from '../../../../fixtures/test';

test.describe('LMS Chromium login flow @positive @p0', () => {
  test('logs in and reaches the dashboard', async ({ page, loginPage }) => {
    test.setTimeout(120000);

    await page.goto('https://dev-lmsworkforce.aixhub.ai/login');
    await loginPage.selectCountry('India', /India \+91/);
    await loginPage.fillForm({
      tenant: process.env.LOGIN_TENANT || 'TNT_64201',
      phone: process.env.LOGIN_PHONE || '9877878990',
      rememberMe: true,
    });
    await loginPage.submit();

    const otpModalHeading = page.getByRole('heading', { name: 'Verify using phone number' });
    await expect(otpModalHeading).toBeVisible();
    const firstOtpInput = otpModalHeading.locator('..').getByRole('textbox').first();
    await expect(firstOtpInput).toBeVisible();
    await page.waitForTimeout(500);
    await firstOtpInput.click();
    await page.keyboard.type(process.env.LOGIN_OTP || '560025', { delay: 150 });

    const verifyBtn = page.getByRole('button', { name: /Verify & Continue/i });
    await expect(verifyBtn).toBeEnabled();
    await verifyBtn.click();
    await expect(page).not.toHaveURL(/login/);
    await expect(page.locator('body')).toContainText(/Home|Users|Dashboard|LMS/i);
  });
});
