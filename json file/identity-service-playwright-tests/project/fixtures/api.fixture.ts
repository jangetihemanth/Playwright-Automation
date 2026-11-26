import { test as base, APIRequestContext } from '@playwright/test';

/**
 * Credentials used to obtain a bearer token from POST /auth/login.
 * Override via environment variables (see .env.example) rather than editing this file.
 */
const AUTH_CREDENTIALS = {
  tenantCode: process.env.TEST_TENANT_CODE ?? 'fedbank',
  appId: process.env.TEST_APP_ID ?? 'bfsi-field-go',
  authType: process.env.TEST_AUTH_TYPE ?? 'PASSWORD',
  identifier: process.env.TEST_IDENTIFIER ?? 'abhay.singh',
  password: process.env.TEST_PASSWORD ?? 'StrongPassword@123',
  action: 'login',
};

type ApiFixtures = {
  /** An APIRequestContext that already carries a valid Authorization: Bearer <token> header. */
  authRequest: APIRequestContext;
};

export const test = base.extend<ApiFixtures>({
  authRequest: async ({ playwright, baseURL }, use) => {
    const loginContext = await playwright.request.newContext({ baseURL });

    const loginResponse = await loginContext.post('/auth/login', {
      data: AUTH_CREDENTIALS,
    });

    if (!loginResponse.ok()) {
      await loginContext.dispose();
      throw new Error(
        `[api.fixture] Login failed with status ${loginResponse.status()}: ${await loginResponse.text()}\n` +
          `Check the credentials in .env / fixtures/api.fixture.ts against a real test account.`,
      );
    }

    const body = await loginResponse.json().catch(() => ({}) as Record<string, unknown>);

    // The OpenAPI spec doesn't document the exact shape of the login response body,
    // so we try the common locations. Update this if your API nests the token elsewhere.
    const token =
      (body as any)?.accessToken ??
      (body as any)?.token ??
      (body as any)?.data?.accessToken ??
      (body as any)?.data?.token;

    if (!token) {
      await loginContext.dispose();
      throw new Error(
        '[api.fixture] Login succeeded but no access token was found in the response body.\n' +
          `Response body was: ${JSON.stringify(body)}\n` +
          'Update the token lookup in fixtures/api.fixture.ts to match your API response shape.',
      );
    }

    const authedContext = await playwright.request.newContext({
      baseURL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    await use(authedContext);

    await authedContext.dispose();
    await loginContext.dispose();
  },
});

export { expect } from '@playwright/test';
