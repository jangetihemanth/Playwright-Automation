import { test, expect } from '../../../../fixtures/test';

const dashboardStatsUrl = 'https://dev-lms360-backend.aixhub.ai/api/v1/dashboard/admin/stats';
const dashboardToken = (process.env.DASHBOARD_API_TOKEN || '').replace(/^Bearer\s+/i, '').trim();

test.describe('LMS Chromium dashboard flow @positive @p0', () => {
  test.skip(!dashboardToken, 'Set DASHBOARD_API_TOKEN to validate the dashboard stats endpoint');

  test('loads dashboard status after login', async ({ page, loginPage }) => {
    test.setTimeout(120000);

    await loginPage.loginWithOtp({
      tenant: process.env.LOGIN_TENANT || 'TNT_64201',
      phone: process.env.LOGIN_PHONE || '9877878990',
      otp: process.env.LOGIN_OTP || '560025',
    });

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    const statsResponse = await page.request.get(dashboardStatsUrl, {
      headers: { Authorization: `Bearer ${dashboardToken}` },
    });
    expect(statsResponse.ok(), `Dashboard stats returned ${statsResponse.status()}`).toBeTruthy();
    const stats = await statsResponse.json();
    expect(stats).toBeTruthy();
    expect(typeof stats).toBe('object');
  });
});