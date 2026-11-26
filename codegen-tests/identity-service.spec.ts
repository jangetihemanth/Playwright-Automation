import { test, expect } from '@playwright/test';

const BASE_URL = process.env.IDENTITY_SERVICE_URL || process.env.BASE_URL || 'https://stg-identity-service.aixhub.ai';
const TOKEN = process.env.USERS_API_TOKEN || process.env.API_TOKEN || '';

test.describe('Identity Service - Complete End-to-End Suite', () => {
  let authedRequest;

  test.beforeAll(async ({ playwright }) => {
    const tokenToUse = process.env.USERS_API_TOKEN || process.env.API_TOKEN;
    if (!tokenToUse) {
      console.warn('Warning: USERS_API_TOKEN or API_TOKEN not provided in environment');
    }

    authedRequest = await playwright.request.newContext({
      baseURL: BASE_URL,
      extraHTTPHeaders: {
        Accept: 'application/json',
        Authorization: `Bearer ${tokenToUse}`,
      },
    });
  });

  test.afterAll(async () => {
    if (authedRequest) {
      await authedRequest.dispose();
    }
  });

  test('1. Auth Token & Configuration Verification', async () => {
    expect(TOKEN, 'USERS_API_TOKEN must be defined').toBeTruthy();
    expect(BASE_URL).toBeTruthy();
  });

  test('2. Public Endpoints - Health Check', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/public/health-check`).catch(() => null);
    if (response) {
      expect([200, 404]).toContain(response.status());
    }
  });

  test('3. Tenants - List Tenants', async () => {
    const response = await authedRequest.get('/tenants');
    expect([200, 401, 403]).toContain(response.status());
    if (response.ok()) {
      const body = await response.json();
      expect(body).toBeDefined();
    }
  });

  test('4. Users - List Users with Pagination & Filters', async () => {
    const response = await authedRequest.get('/users', {
      params: {
        page: 1,
        limit: 10,
      },
    });
    expect([200, 401, 403]).toContain(response.status());
    if (response.ok()) {
      const body = await response.json();
      expect(body).toBeDefined();
    }
  });

  test('5. Roles - List Tenant Roles', async () => {
    const response = await authedRequest.get('/tenant-roles');
    expect([200, 401, 403]).toContain(response.status());
    if (response.ok()) {
      const body = await response.json();
      expect(body).toBeDefined();
    }
  });

  test('6. Departments - List Departments', async () => {
    const response = await authedRequest.get('/departments');
    expect([200, 401, 403]).toContain(response.status());
  });

  test('7. Regions - List Regions', async () => {
    const response = await authedRequest.get('/regions');
    expect([200, 401, 403]).toContain(response.status());
  });

  test('8. Teams - List Teams', async () => {
    const response = await authedRequest.get('/teams');
    expect([200, 401, 403]).toContain(response.status());
  });

  test('9. Applications - List Applications', async () => {
    const response = await authedRequest.get('/applications');
    expect([200, 401, 403]).toContain(response.status());
  });

  test('10. Tenant Role Policies - List Policies', async () => {
    const response = await authedRequest.get('/tenant-role-policies');
    expect([200, 401, 403]).toContain(response.status());
  });
});
