import { test, expect } from '../../fixtures/test';

const apiUrl = '**/auth/otp/send';

for (const status of [400, 401, 403, 500, 504]) {
  test(`shows a recoverable error for login API ${status} @api @p1`, async ({ page, loginPage }) => {
    await page.route(apiUrl, route => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({ message: 'Invalid Credentials' }) }));
    await loginPage.goto();
    await loginPage.fillForm({ tenant: 'TNT_64201', phone: '9877878990' });
    const response = await loginPage.submit();
    expect(response.status()).toBe(status);
    await expect(loginPage.invalidCredentials).toBeVisible();
    await expect(loginPage.signInButton).toBeEnabled();
    await expect(page).toHaveURL(/\/login$/);
  });
}

test('sends the observed login payload and content type @api @p0', async ({ page, loginPage }) => {
  let request;
  page.on('request', candidate => {
    if (candidate.url().includes('/auth/otp/send')) request = candidate;
  });
  await loginPage.goto();
  await loginPage.selectCountry('India', 'India +91');
  await loginPage.fillForm({ tenant: 'TNT_64201', phone: '9877878990' });
  const response = await loginPage.submit();
  expect(response.status()).toBe(201);
  await expect(page.getByRole('heading', { name: 'Verify using phone number' })).toBeVisible();
  expect(request.method()).toBe('POST');
  expect(request.headers()['content-type']).toContain('application/json');
  expect(request.postDataJSON()).toEqual({ tenantCode: 'TNT_64201', phone: '+919877878990', action: 'login' });
});

test('handles a timed out API without duplicating requests @api @p1', async ({ page, loginPage }) => {
  let calls = 0;
  await page.route(apiUrl, async route => { calls += 1; await new Promise(resolve => setTimeout(resolve, 1500)); await route.abort('timedout'); });
  await loginPage.goto();
  await loginPage.fillForm({ tenant: 'TNT_64201', phone: '9877878990' });
  await loginPage.signInButton.click();
  await expect(loginPage.signInButton).toBeEnabled({ timeout: 5000 });
  expect(calls).toBe(1);
});
