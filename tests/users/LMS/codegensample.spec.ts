import { test, expect } from '@playwright/test';

test('login and open the user form', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('https://dev-lmsworkforce.aixhub.ai/login');
  await page.getByRole('button', { name: /^\+\d+$/ }).click();
  await page.getByPlaceholder('Search country...').fill('india');
  await page.getByRole('option', { name: /India \+91/ }).click();
  await page.getByPlaceholder('Enter tenant code').fill('TNT_64201');
  await page.getByPlaceholder('Enter phone number').fill('9877878990');
  await page.getByRole('button', { name: 'Sign in' }).click();
  const otpInput = page.getByPlaceholder('Enter OTP');
  if (await otpInput.count()) {
    await otpInput.waitFor({ state: 'visible' });
    await otpInput.fill('560025');
  } else {
    const otpInputs = page
      .getByRole('heading', { name: 'Verify using phone number' })
      .locator('..')
      .getByRole('textbox');
    await expect(otpInputs).toHaveCount(6);
    for (const [index, digit] of '560025'.split('').entries()) {
      await otpInputs.nth(index).fill(digit);
    }
  }
  await page.getByRole('button', { name: /Verify & Continue/i }).click();
  await expect(page).toHaveURL(/dashboard/);
  await page.getByRole('link', { name: 'Users' }).click();
  await expect(page).toHaveURL(/dashboard\/users/);
  await page.getByRole('button', { name: 'Add User' }).click();
  await page.getByRole('menuitem', { name: 'Add User' }).click();
  await expect(page.getByRole('heading', { name: 'Basic Information' })).toBeVisible();
  await page.getByRole('textbox', { name: 'First Name *' }).fill('hemanth');
  await page.getByRole('textbox', { name: 'Last Name *' }).fill('nani');
  await page.getByRole('textbox', { name: 'Email *' }).fill(`hemanth.${Date.now()}@gmail.com`);
  await page.getByRole('textbox', { name: 'Phone Number' }).fill('9833435676');
  await page.getByRole('textbox', { name: 'Enter employee ID' }).fill(`emp-${Date.now()}`);
  await expect(page.getByLabel('Role *')).toBeVisible();
  await expect(page.getByLabel('Department')).toBeVisible();
});