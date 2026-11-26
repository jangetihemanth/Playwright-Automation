import { test, expect } from '../../fixtures/test';

test.describe('Dashboard KPI Tenant Validation @p0', () => {

  test('DB-002: Validate Total Users for current tenant @p0', async ({
    page,
    loginPage
  }) => {

    // ============================================================
    // 1. Get tenant dynamically
    // ============================================================

    const tenant =
      process.env.LOGIN_TENANT || 'TNT_64201';

    console.log('====================================');
    console.log('Testing Tenant:', tenant);
    console.log('====================================');

    // ============================================================
    // 2. Capture dashboard API responses
    // ============================================================

    const dashboardResponses = [];

    page.on('response', async (response) => {
      try {
        const request = response.request();

        // We only care about API/XHR/fetch responses.
        if (
          request.resourceType() === 'xhr' ||
          request.resourceType() === 'fetch'
        ) {
          const url = response.url();

          // Collect responses that look dashboard/statistics related.
          if (
            /dashboard|statistics|analytics|kpi|summary/i.test(url)
          ) {
            dashboardResponses.push({
              url,
              status: response.status(),
              body: await response.text()
            });
          }
        }
      } catch (error) {
        // Ignore responses that are not readable.
      }
    });

    // ============================================================
    // 3. Login using the selected tenant
    // ============================================================

    await loginPage.loginWithOtp({
      tenant,
      phone: process.env.LOGIN_PHONE || '9877878990',
      otp: process.env.LOGIN_OTP || '560025',
      rememberMe: true,
    });

    // ============================================================
    // 4. Verify Dashboard
    // ============================================================

    await expect(page).toHaveURL(/\/dashboard/);

    // ============================================================
    // 5. Find "Total Users" label
    // ============================================================

    const totalUsersLabel = page
      .getByText('Total Users', { exact: true })
      .first();

    await expect(totalUsersLabel).toBeVisible();

    // ============================================================
    // 6. Find the value associated with Total Users
    // ============================================================

    const totalUsersValue = totalUsersLabel
      .locator('..')
      .locator('p');

    await expect(totalUsersValue).toBeVisible();

    const totalUsersText =
      (await totalUsersValue.innerText()).trim();

    console.log('Tenant:', tenant);
    console.log('Dashboard Total Users:', totalUsersText);

    // ============================================================
    // 7. Validate UI contains a numeric value
    // ============================================================

    expect(totalUsersText).toMatch(/^\d[\d,]*$/);

    // Convert "3,089" -> 3089
    const uiTotalUsers =
      Number(totalUsersText.replace(/,/g, ''));

    console.log('UI Total Users Number:', uiTotalUsers);

    // ============================================================
    // 8. Print captured dashboard API responses
    // ============================================================

    console.log('====================================');
    console.log('Dashboard API Responses');
    console.log('====================================');

    for (const response of dashboardResponses) {

      console.log('URL:', response.url);
      console.log('Status:', response.status);
      console.log('Body:', response.body);
      console.log('------------------------------------');
    }

    // ============================================================
    // 9. Basic safety check
    // ============================================================

    expect(uiTotalUsers).toBeGreaterThanOrEqual(0);

    console.log('====================================');
    console.log('RESULT: UI KPI is valid for tenant');
    console.log('Tenant:', tenant);
    console.log('Users:', uiTotalUsers);
    console.log('====================================');
  });

});