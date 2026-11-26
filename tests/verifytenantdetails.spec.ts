import { test, expect } from '@playwright/test';

test("verify invalid tenant code", async ({ page }) => {

  await page.goto("https://dev-lmsworkforce.aixhub.ai/login");

  // Wrong Tenant Code
  await page.getByPlaceholder("Enter tenant code")
            .type("TNT_99999", { delay: 200 });

  // Valid Phone Number
  await page.getByPlaceholder("Enter phone number")
            .type("9877878990", { delay: 200 });

  await page.getByRole('button', { name: 'Sign in' })
            .click();

  await expect(
    page.getByText('Invalid Credentials')
  ).toBeVisible();

  console.log("Invalid Credentials Message Displayed");
});