const { test, expect } = require('../../../fixtures/test');

test.describe('LMS Chromium positive UI flow @positive @p0', () => {
  test('login, dashboard, users, and skills', async ({ page, loginPage }) => {
    test.setTimeout(120000);

    await loginPage.loginWithOtp({
      tenant: process.env.LOGIN_TENANT || 'TNT_64201',
      phone: process.env.LOGIN_PHONE || '9877878990',
      otp: process.env.LOGIN_OTP || '560025',
    });

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Total Users' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Active Courses' })).toBeVisible();

    await page.getByRole('link', { name: 'Users' }).click();
    await expect(page).toHaveURL(/\/dashboard\/users$/);
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
    await page.getByRole('button', { name: 'Add User' }).click();
    await page.getByRole('menuitem', { name: 'Add User' }).click();
    await expect(page.getByRole('heading', { name: 'Basic Information' })).toBeVisible();

    await page.getByRole('link', { name: 'Skills' }).click();
    await expect(page).toHaveURL(/\/dashboard\/skills$/);
    await expect(page.getByRole('heading', { name: 'Skills Dashboard' })).toBeVisible();
    await page.getByRole('button', { name: 'Add Skill' }).click();
    const skillDialog = page.getByRole('dialog', { name: 'Add Skill' });
    await expect(skillDialog).toBeVisible();
    await expect(skillDialog.getByRole('textbox', { name: 'Skill Name *' })).toBeVisible();
    await expect(skillDialog.getByRole('combobox', { name: 'Skill Category *' })).toBeVisible();
    await expect(skillDialog.getByRole('combobox', { name: 'Level *' })).toBeVisible();
    await skillDialog.getByRole('button', { name: 'Cancel' }).click();

    const modules = [
      ['Courses', '/dashboard/courses'],
      ['Learning Paths', '/dashboard/learning-paths'],
      ['Branches', '/dashboard/branches'],
      ['Participants', '/dashboard/students'],
      ['Notifications', '/dashboard/notifications'],
      ['Category', '/dashboard/category'],
      ['Settings', '/dashboard/settings'],
    ];

    for (const [name, route] of modules) {
      await page.getByRole('link', { name }).click();
      await expect(page).toHaveURL(new RegExp(`${route}$`));
    }
  });
});