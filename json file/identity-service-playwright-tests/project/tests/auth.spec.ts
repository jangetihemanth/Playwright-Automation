import { expect } from '@playwright/test';
import { test } from '../fixtures/api.fixture';

/**
 * Auth API tests
 * Auto-generated from the Identity & Access Service OpenAPI spec.
 * Review generated request bodies / path params before relying on these in CI.
 */
test.describe('Auth', () => {
  test('POST /auth/login - Authenticate user using password / OTP / AAD', async ({ request }) => {
    const data = {
      tenantCode: 'fedbank',
      appId: 'bfsi-field-go',
      authType: 'PASSWORD',
      identifier: 'abhay.singh',
      password: 'StrongPassword@123',
      aadToken: 'sample-token',
      action: 'login',
    };
    const response = await request.post('/auth/login', { data });

    expect(response.status()).toBe(200);
  });

  test('POST /auth/otp/send - Send OTP to phone number', async ({ request }) => {
    const data = {
      tenantCode: 'fedbank',
      phone: '+91XXXXXXXXXX',
      action: 'login',
    };
    const response = await request.post('/auth/otp/send', { data });

    expect(response.status()).toBe(200);
  });

  test('POST /auth/otp/verify - Verify OTP and login user', async ({ request }) => {
    const data = {
      tenantCode: 'fedbank',
      phone: '+91XXXXXXXXXX',
      otp: '123456',
      action: 'login',
    };
    const response = await request.post('/auth/otp/verify', { data });

    expect(response.status()).toBe(200);
  });

  test('POST /auth/otp/resend - Resend OTP to phone number', async ({ request }) => {
    const data = {
      tenantCode: 'fedbank',
      phone: '+91XXXXXXXXXX',
      action: 'login',
    };
    const response = await request.post('/auth/otp/resend', { data });

    expect(response.status()).toBe(200);
  });

  test('GET /auth/me - Get logged-in user details', async ({ authRequest }) => {
    const response = await authRequest.get('/auth/me');

    expect(response.status()).toBe(200);
  });

  test('POST /auth/admin-login - Authenticate user using email & password', async ({ request }) => {
    const data = {
      email: 'admin@aixhub.ai',
      password: 'admin@itcart.ai',
    };
    const response = await request.post('/auth/admin-login', { data });

    expect(response.status()).toBe(200);
  });

  test('POST /auth/refresh - Refresh access token using refresh token', async ({ request }) => {
    const data = {
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    };
    const response = await request.post('/auth/refresh', { data });

    expect(response.status()).toBe(200);
  });

  test('POST /auth/system/token - Generate system token for cross-system communication', async ({
    request,
  }) => {
    const data = {
      appCode: 'AWF001',
      tenantId: 'tenant-uuid',
    };
    const response = await request.post('/auth/system/token', { data });

    expect(response.status()).toBe(200);
  });
});
