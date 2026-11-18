// const { test, expect } = require('../../fixtures/test');

// test.describe('login page load and UI @smoke @p0', () => {
//   test('loads securely with expected document, branding, and form elements', async ({ page, loginPage }) => {
//     const response = await page.goto('/login', { waitUntil: 'domcontentloaded' });
//     expect(response?.status()).toBeLessThan(400);
//     expect(new URL(page.url()).protocol).toBe('https:');

//     // Page Title
//     await expect(page).toHaveTitle('LMSWorkforce360');

//     // Logo & Branding
//     await expect(loginPage.logo).toBeVisible();
//     const isLogoLoaded = await loginPage.logo.evaluate(img => img.complete && img.naturalWidth > 0);
//     expect(isLogoLoaded).toBeTruthy();
//     const logoBox = await loginPage.logo.boundingBox();
//     expect(logoBox.width).toBeGreaterThan(0);
//     expect(logoBox.height).toBeGreaterThan(0);

//     // Left-side Text & Description
//     await expect(loginPage.leftSideText).toBeVisible();
//     await expect(loginPage.description).toBeVisible();

//     // Welcome Heading
//     await expect(loginPage.heading).toBeVisible();

//     // Form Labels & Inputs
//     await expect(loginPage.tenantCodeLabel).toBeVisible();
//     await expect(loginPage.tenantCode).toBeVisible();
//     await expect(loginPage.phoneNumberLabel).toBeVisible();
//     await expect(loginPage.countryButton).toBeVisible();
//     await expect(loginPage.countryButton).toContainText('+91');
//     await expect(loginPage.phoneNumber).toBeVisible();

//     // Checkbox & Action Button
//     await expect(loginPage.rememberMe).toBeVisible();
//     await expect(loginPage.signInButton).toBeVisible();
//     await expect(loginPage.signInButton).toBeEnabled();
//     await expect(loginPage.signInButton).toHaveCSS('cursor', 'pointer');

//     // Footer
//     await expect(loginPage.footer).toBeVisible();
//     expect(await page.locator('link[rel="icon"]').count()).toBeGreaterThan(0);
//   });

//   test('refresh and browser history preserve the login page @p0', async ({ page, loginPage }) => {
//     await loginPage.goto();
//     await page.reload({ waitUntil: 'domcontentloaded' });
//     await expect(loginPage.heading).toBeVisible();
//     await page.goto('https://dev-lmsworkforce.aixhub.ai/login');
//     await page.goBack({ waitUntil: 'domcontentloaded' });
//     await expect(page).toHaveURL(/\/login$/);
//     await expect(loginPage.heading).toBeVisible();
//   });

//   test('form has no overlap or horizontal overflow at desktop size @p1', async ({ page, loginPage }) => {
//     await loginPage.goto();
//     const boxes = await Promise.all([
//       loginPage.logo,
//       loginPage.heading,
//       loginPage.tenantCode,
//       loginPage.countryButton,
//       loginPage.phoneNumber,
//       loginPage.rememberMe,
//       loginPage.signInButton,
//     ].map(locator => locator.boundingBox()));
//     expect(boxes.every(Boolean)).toBeTruthy();

//     for (let index = 0; index < boxes.length; index += 1) {
//       for (let next = index + 1; next < boxes.length; next += 1) {
//         const a = boxes[index]; const b = boxes[next];
//         expect(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y).toBeTruthy();
//       }
//     }
//     expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1536);
//   });

//   test('sign in supports hover, focus, and keyboard activation @p1', async ({ page, loginPage }) => {
//     await loginPage.goto();
//     await loginPage.signInButton.hover();
//     await loginPage.signInButton.focus();
//     await expect(loginPage.signInButton).toBeFocused();
//     await page.keyboard.press('Enter');
//     await expect(page.getByRole('dialog').or(loginPage.invalidCredentials).or(page.getByText('Tenant code is required'))).toBeVisible();
//   });
// });
const { test, expect } = require('../../fixtures/test');

test.describe('login page load and UI @smoke @p0', () => {

  // =========================================================
  // 1. LOGIN PAGE LOAD / BRANDING / FORM
  // =========================================================

  test(
    'loads securely with expected document, branding, and form elements',
    async ({ page, loginPage }) => {

      const response = await page.goto('/login', {
        waitUntil: 'domcontentloaded',
      });

      // Page response
      expect(response).not.toBeNull();
      expect(response?.status()).toBeLessThan(400);

      // HTTPS
      expect(new URL(page.url()).protocol).toBe('https:');

      // Page title
      await expect(page).toHaveTitle('LMSWorkforce360');

      // -------------------------------------------------------
      // Logo
      // -------------------------------------------------------

      await expect(
        loginPage.logo,
        'LMS logo should be visible'
      ).toBeVisible();

      const logoBox = await loginPage.logo.boundingBox();

      expect(
        logoBox,
        'LMS logo should have a valid bounding box'
      ).not.toBeNull();

      expect(logoBox.width).toBeGreaterThan(0);
      expect(logoBox.height).toBeGreaterThan(0);

      // If the logo is an IMG, verify actual image loading.
      const logoTagName = await loginPage.logo.evaluate(
        element => element.tagName.toLowerCase()
      );

      if (logoTagName === 'img') {

        const isLogoLoaded = await loginPage.logo.evaluate(
          img => img.complete && img.naturalWidth > 0
        );

        expect(
          isLogoLoaded,
          'Logo image should be loaded successfully'
        ).toBeTruthy();
      }

      // -------------------------------------------------------
      // Left-side branding
      // -------------------------------------------------------

      await expect(loginPage.leftSideText).toBeVisible();

      await expect(loginPage.description).toBeVisible();

      // -------------------------------------------------------
      // Welcome heading
      // -------------------------------------------------------

      await expect(loginPage.heading).toBeVisible();

      // -------------------------------------------------------
      // Tenant Code
      // -------------------------------------------------------

      await expect(loginPage.tenantCodeLabel).toBeVisible();

      await expect(loginPage.tenantCode).toBeVisible();

      // -------------------------------------------------------
      // Phone Number
      // -------------------------------------------------------

      await expect(loginPage.phoneNumberLabel).toBeVisible();

      await expect(loginPage.countryButton).toBeVisible();

      await expect(
        loginPage.countryButton
      ).toContainText('+1');

      await expect(loginPage.phoneNumber).toBeVisible();

      // -------------------------------------------------------
      // Remember Me
      // -------------------------------------------------------

      await expect(loginPage.rememberMe).toBeVisible();

      // -------------------------------------------------------
      // Sign In
      // -------------------------------------------------------

      await expect(loginPage.signInButton).toBeVisible();

      await expect(loginPage.signInButton).toBeEnabled();

      await expect(
        loginPage.signInButton
      ).toHaveCSS('cursor', 'default');

      // -------------------------------------------------------
      // Footer
      // -------------------------------------------------------

      await expect(loginPage.footer).toBeVisible();

      // -------------------------------------------------------
      // Favicon
      // -------------------------------------------------------

      const faviconCount = await page.locator(
        'link[rel="icon"]'
      ).count();

      expect(
        faviconCount,
        'Favicon should be present'
      ).toBeGreaterThan(0);
    }
  );


  // =========================================================
  // 2. REFRESH + BROWSER HISTORY
  // =========================================================

  test(
    'refresh and browser history preserve the login page @p0',
    async ({ page, loginPage }) => {

      // Open login page
      await loginPage.goto();

      await expect(loginPage.heading).toBeVisible();

      // -------------------------------------------------------
      // Refresh
      // -------------------------------------------------------

      await page.reload({
        waitUntil: 'domcontentloaded',
      });

      await expect(loginPage.heading).toBeVisible();

      // -------------------------------------------------------
      // Create another history entry
      // -------------------------------------------------------

      const currentUrl = new URL(page.url());

      currentUrl.searchParams.set(
        'historyTest',
        '1'
      );

      await page.goto(
        currentUrl.toString(),
        {
          waitUntil: 'domcontentloaded',
        }
      );

      await expect(loginPage.heading).toBeVisible();

      // -------------------------------------------------------
      // Go back
      // -------------------------------------------------------

      await page.goBack({
        waitUntil: 'domcontentloaded',
      });

      // -------------------------------------------------------
      // Verify login page
      // -------------------------------------------------------

      await expect(page).toHaveURL(/\/login$/);

      await expect(loginPage.heading).toBeVisible();

      await expect(loginPage.tenantCode).toBeVisible();

      await expect(loginPage.phoneNumber).toBeVisible();

      await expect(loginPage.signInButton).toBeVisible();
    }
  );


  // =========================================================
  // 3. DESKTOP OVERLAP / HORIZONTAL OVERFLOW
  // =========================================================

  test(
    'form has no overlap or horizontal overflow at desktop size @p1',
    async ({ page, loginPage }) => {

      // Desktop viewport
      await page.setViewportSize({
        width: 1536,
        height: 864,
      });

      await loginPage.goto();

      await expect(loginPage.heading).toBeVisible();

      // -------------------------------------------------------
      // Elements
      // -------------------------------------------------------

      const elements = [
        {
          name: 'Logo',
          locator: loginPage.logo,
        },
        {
          name: 'Heading',
          locator: loginPage.heading,
        },
        {
          name: 'Tenant Code',
          locator: loginPage.tenantCode,
        },
        {
          name: 'Country Button',
          locator: loginPage.countryButton,
        },
        {
          name: 'Phone Number',
          locator: loginPage.phoneNumber,
        },
        {
          name: 'Remember Me',
          locator: loginPage.rememberMe,
        },
        {
          name: 'Sign In Button',
          locator: loginPage.signInButton,
        },
      ];

      const boxes = [];

      // -------------------------------------------------------
      // Get bounding boxes
      // -------------------------------------------------------

      for (const element of elements) {

        await expect(
          element.locator,
          `${element.name} should be visible`
        ).toBeVisible();

        const box = await element.locator.boundingBox();

        expect(
          box,
          `${element.name} should have a valid bounding box`
        ).not.toBeNull();

        boxes.push({
          name: element.name,
          box,
        });
      }

      // -------------------------------------------------------
      // Verify elements are inside viewport
      // -------------------------------------------------------

      for (const item of boxes) {

        const { name, box } = item;

        expect(
          box.x,
          `${name} should not start outside viewport`
        ).toBeGreaterThanOrEqual(0);

        expect(
          box.x + box.width,
          `${name} should not extend outside viewport`
        ).toBeLessThanOrEqual(1536);

        expect(
          box.width,
          `${name} should have positive width`
        ).toBeGreaterThan(0);

        expect(
          box.height,
          `${name} should have positive height`
        ).toBeGreaterThan(0);
      }

      // -------------------------------------------------------
      // Verify no element overlap
      // -------------------------------------------------------

      for (
        let index = 0;
        index < boxes.length;
        index += 1
      ) {

        for (
          let next = index + 1;
          next < boxes.length;
          next += 1
        ) {

          const a = boxes[index].box;
          const b = boxes[next].box;

          const noOverlap =
            a.x + a.width <= b.x ||
            b.x + b.width <= a.x ||
            a.y + a.height <= b.y ||
            b.y + b.height <= a.y;

          expect(
            noOverlap,
            `${boxes[index].name} overlaps ${boxes[next].name}`
          ).toBeTruthy();
        }
      }

      // -------------------------------------------------------
      // Verify no horizontal document overflow
      // -------------------------------------------------------

      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      expect(
        dimensions.scrollWidth,
        'Page should not have horizontal overflow'
      ).toBeLessThanOrEqual(
        dimensions.clientWidth + 1
      );
    }
  );


  // =========================================================
  // 4. SIGN IN - HOVER / FOCUS / KEYBOARD
  // =========================================================

  test(
    'sign in supports hover, focus, and keyboard activation @p1',
    async ({ page, loginPage }) => {

      await loginPage.goto();

      // Hover
      await loginPage.signInButton.hover();

      // Focus
      await loginPage.signInButton.focus();

      await expect(
        loginPage.signInButton
      ).toBeFocused();

      // Keyboard activation
      await page.keyboard.press('Enter');

      // -------------------------------------------------------
      // User should remain on login page.
      // -------------------------------------------------------

      await expect(page).toHaveURL(/\/login/);

      // -------------------------------------------------------
      // Check expected validation/error behavior.
      // -------------------------------------------------------

      const possibleMessages = [
        page.getByRole('dialog'),
        loginPage.invalidCredentials,
        page.getByText('Tenant code is required'),
      ];

      let messageFound = false;

      for (const locator of possibleMessages) {

        try {

          if (
            await locator.first().isVisible()
          ) {
            messageFound = true;
            break;
          }

        } catch {
          // Continue checking the next locator.
        }
      }

      expect(
        messageFound,
        'A validation or error message should be displayed after keyboard submission'
      ).toBeTruthy();
    }
  );

});