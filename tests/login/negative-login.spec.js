const { test, expect } = require('../../fixtures/test');

const invalidCombinations = [
  { name: 'valid tenant and invalid phone', tenant: 'TNT_64201', phone: '852005' },
  { name: 'invalid tenant and valid phone', tenant: 'TNT_99999', phone: '9877878990' },
  { name: 'invalid tenant and invalid phone', tenant: 'TNT_99999', phone: '852005' },
];

test.describe('negative login @negative @p0', () => {
  for (const combination of invalidCombinations) {
    test(`${combination.name} is rejected`, async ({ page, loginPage }) => {
      await loginPage.goto();
      await loginPage.fillForm(combination);
      const response = await loginPage.submit();
      expect(response.status()).toBe(400);
      await expect(loginPage.invalidCredentials.or(loginPage.invalidPhone)).toBeVisible();
      await expect(page).toHaveURL(/\/login$/);
      expect(await page.evaluate(() => localStorage.getItem('lms_is_authenticated'))).toBe('false');
    });
  }
});
