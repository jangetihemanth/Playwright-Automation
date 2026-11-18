const { test, expect } = require('@playwright/test');

test("verify invalid credentials message", async ({ page }) => {

  await page.goto("https://dev-lmsworkforce.aixhub.ai/login");

  await expect(page.getByRole("heading", { name: "Welcome LMSWorkforce360" })).toBeVisible();

  // Fill the tenant code field.
  const tenantCode = page.getByPlaceholder("Enter tenant code");
  await tenantCode.click();
  await tenantCode.fill("TNT_64201");
  await expect(tenantCode).toHaveValue("TNT_64201");

  // Open the country selector, search for India, and choose it.
  await page.getByRole("button", { name: /\+\d+/ }).click();
  const countrySearch = page.getByRole("combobox");
  await countrySearch.fill("India");
  await page.getByRole("option", { name: /India \+91/ }).click();
  await expect(page.getByRole("button", { name: "+91" })).toBeVisible();

  // Enter a phone number that fails the phone-format validation.
  const phoneNumber = page.getByPlaceholder("Enter phone number");
  await phoneNumber.click();
  await phoneNumber.fill("852005");
  await expect(phoneNumber).toHaveValue("852005");

  // Toggle Remember Me and verify that the control changed state.
  const rememberMe = page.getByRole("checkbox", { name: "Remember Me" });
  await rememberMe.click();
  await expect(rememberMe).toBeChecked();

  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByText("phone must be a valid phone number")).toBeVisible();

  console.log("Invalid Credentials Message Displayed");
});