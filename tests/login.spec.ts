import { test, expect } from '@playwright/test';
test.use({ viewport: { width: 1536, height: 960 } });

test('verify login', async ({ page }) => {
  // Open Login Page
  await page.goto('https://dev-lmsworkforce.aixhub.ai/login');

  // Select Country code +91
  await page.getByRole('button', { name: /^\+\d+$/ }).click();
  await page.getByRole('combobox').fill('India');
  await page.getByRole('option', { name: /India \+91/ }).click();

  // Enter Tenant Code
  await page.getByPlaceholder('Enter tenant code').fill('TNT_64201');

  // Enter Phone Number
  await page.getByPlaceholder('Enter phone number').fill('9877878990');

  // Click Sign In
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Enter OTP
  const otpModalHeading = page.getByRole('heading', { name: 'Verify using phone number' });
  await expect(otpModalHeading).toBeVisible();
  const firstOtpInput = otpModalHeading.locator('..').getByRole('textbox').first();
  await firstOtpInput.click();
  await page.keyboard.type('560025', { delay: 150 });

  // Click Verify & Continue
  await page.getByRole('button', { name: /Verify & Continue/i }).click();

  // Verify Login Success
  await expect(page).not.toHaveURL(/login/);
  console.log('Login Successful');
});
