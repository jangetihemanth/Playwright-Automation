const { test, expect } = require('@playwright/test');
test.use ({viewport: { width: 1536, height: 960 }});   // Set the viewport size for the test

test("verify login", async ({ page }) => {

  // Open Login Page
  await page.goto("https://dev-lmsworkforce.aixhub.ai/login");

  // Enter Tenant Code
//   await page.getByPlaceholder("Enter tenant code")
//             .fill("TNT_64201");
await page.getByPlaceholder("Enter tenant code")
          .click();

await page.getByPlaceholder("Enter tenant code")
          .type("TNT_64201", { delay: 200 });

  // Enter Phone Number
//   await page.getByPlaceholder("Enter phone number")
//             .fill("9877878990");
await page.getByPlaceholder("Enter phone number").clear();

await page.getByPlaceholder("Enter phone number")
          .type("9877878990", { delay: 200 });

  // Click Sign In
  await page.getByRole('button', { name: 'Sign in' })
            .click();

  // Wait for OTP popup
  await page.waitForTimeout(3000);

  // Enter OTP
  await page.keyboard.type('560025', { delay: 200 }); // A human doesn't type OTP in 0.1 seconds.

  // Click Verify & Continue
  await page.getByRole('button', { name: /Verify & Continue/i })
            .click();

  // Wait for Dashboard
  await page.waitForLoadState('networkidle');

  // Verify Login Success
  await expect(page).not.toHaveURL(/login/);

  //await page.getByAltText("Profile").click

  console.log("Login Successful");

});