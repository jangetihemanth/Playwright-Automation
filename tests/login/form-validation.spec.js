const { test, expect } = require('../../fixtures/test');

const tenantCases = [
  { name: 'invalid tenant', value: 'TNT_99999' },
  { name: 'SQL injection', value: "' OR 1=1 --" },
  { name: 'XSS', value: '<script>alert(1)</script>' },
  { name: 'HTML injection', value: '<img src=x onerror=alert(1)>' },
  { name: 'Unicode', value: '租户编码' },
  { name: 'long input', value: 'T'.repeat(501) },
];

test.describe('login form validation @p0', () => {
  test('empty form is handled without leaving login', async ({ page, loginPage }) => {
    await loginPage.goto();
    const apiRequests = [];
    page.on('request', request => {
      if (request.url().includes('/auth/otp/send')) apiRequests.push(request);
    });
    await loginPage.signInButton.click();
    await expect(page.getByText('Tenant code is required')).toBeVisible();
    await expect(page.getByText('Phone number is required')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
    expect(apiRequests).toHaveLength(0);
  });

  test('handles tenant spaces only safely @negative @security', async ({ page, loginPage }) => {
    await loginPage.goto();
    const apiRequests = [];
    page.on('request', request => {
      if (request.url().includes('/auth/otp/send')) apiRequests.push(request);
    });
    await loginPage.fillForm({ tenant: '   ', phone: '9877878990' });
    await loginPage.signInButton.click();
    await expect(page.getByText('Tenant code is required')).toBeVisible();
    expect(apiRequests).toHaveLength(0);
  });

  for (const testCase of tenantCases) {
    test(`handles tenant ${testCase.name} safely @negative @security`, async ({ page, loginPage }) => {
      await loginPage.goto();
      await loginPage.fillForm({ tenant: testCase.value, phone: '9877878990' });
      const response = await loginPage.submit();
      expect([201, 400]).toContain(response.status());
      await expect(page.getByRole('dialog').or(loginPage.invalidCredentials)).toBeVisible();
      expect(page.url()).not.toContain('javascript:');
      expect(await page.locator('body').innerText()).not.toContain('<script>');
    });
  }

  test('phone input accepts numbers and rejects letters @p0', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.phoneNumber.fill('9877878990');
    expect(await loginPage.phoneNumber.getAttribute('type')).toBe('tel');
    expect(await loginPage.phoneNumber.inputValue()).toBe('9877878990');

    await loginPage.phoneNumber.fill('abcd');
    expect(await loginPage.phoneNumber.inputValue()).toBe('');
    const apiRequests = [];
    page.on('request', request => {
      if (request.url().includes('/auth/otp/send')) apiRequests.push(request);
    });
    await loginPage.signInButton.click();
    await expect(page.getByText('Tenant code is required')).toBeVisible();
    await expect(page.getByText('Phone number is required')).toBeVisible();
    expect(apiRequests).toHaveLength(0);
  });

  const phoneBoundaryCases = [
    { name: '9 digits', phone: '123456789', message: 'phone must be a valid phone number' },
    { name: '10 incorrect digits', phone: '9866767898', message: 'Invalid Credentials' },
    { name: '11 digits', phone: '12345678901', message: 'Invalid Credentials' },
  ];

  for (const testCase of phoneBoundaryCases) {
    test(`phone boundary ${testCase.name} is validated correctly @p0`, async ({ page, loginPage }) => {
      await loginPage.goto();
      await loginPage.fillForm({ tenant: 'TNT_64201', phone: testCase.phone });
      const response = await loginPage.submit();
      expect(response.status()).toBe(400);
      await expect(page.getByText(testCase.message)).toBeVisible();
      await expect(page).toHaveURL(/\/login$/);
    });
  }
});
