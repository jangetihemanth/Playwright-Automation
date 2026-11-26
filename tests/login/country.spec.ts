import { test, expect } from '../../fixtures/test';

test.describe('country code selector @p0', () => {
  test('opens, searches, selects India, and retains the selection', async ({ page, loginPage }) => {
    await loginPage.goto();
    await expect(loginPage.countryButton).toHaveText('+1');
    await loginPage.countryButton.click();
    await expect(loginPage.countrySearch).toBeVisible();
    await loginPage.countrySearch.fill('India');
    const indiaOption = page.getByRole('option').filter({ hasText: 'India' }).first();
    await expect(indiaOption).toBeVisible();
    await indiaOption.click();
    await expect(loginPage.countryButton).toHaveText('+91');
    await loginPage.countryButton.click();
    await expect(loginPage.countrySearch).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(loginPage.countryButton).toHaveText('+91');
  });

  test('does not expose duplicate option names for India search @negative', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.countryButton.click();
    await loginPage.countrySearch.fill('India');
    expect(await page.getByRole('option').filter({ hasText: /^India/ }).count()).toBe(1);
  });
});
