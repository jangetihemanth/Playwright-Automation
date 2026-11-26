
import { expect } from '@playwright/test';
import { test } from '../fixtures/api.fixture';

/**
 * Tenants API tests
 * Auto-generated from the Identity & Access Service OpenAPI spec.
 * Review generated request bodies / path params before relying on these in CI.
 */
test.describe('Tenants', () => {
  test('POST /tenants - Create a new tenant', async ({ authRequest }) => {
    const data = {
      name: 'Federal Bank',
      tenantType: 'BANK',
      email: 'contact@fedbank.co.in',
      phoneNumber: '+91XXXXXXXXXX',
      addressLine1: 'MG Road',
      addressLine2: 'Near Metro Station',
      state: 'Kerala',
      city: 'Kochi',
      country: 'India',
      pincode: '682001',
    };
    const response = await authRequest.post('/tenants', { data });

    expect(response.status()).toBe(201);
  });

  test('GET /tenants - List tenants with pagination and filters', async ({ authRequest }) => {
    const params = {
      dateField: 'createdAt',
      from: '2026-02-01T00:00:00.000Z',
      to: '2026-02-07T23:59:59.999Z',
      page: 1,
      limit: 10,
      tenantType: 'BANK',
      status: 'ACTIVE',
    };
    const response = await authRequest.get('/tenants', { params });

    expect(response.status()).toBe(200);
  });

  test('GET /tenants/search - Search tenants by name or tenant code', async ({ request }) => {
    const params = {
      searchTerm: 'Federal Bank',
      page: 1,
      limit: 10,
    };
    const response = await request.get('/tenants/search', { params });

    expect(response.status()).toBe(200);
  });

  test('GET /tenants/summary - Get tenant summary', async ({ authRequest }) => {
    const response = await authRequest.get('/tenants/summary');

    expect(response.status()).toBe(200);
  });

  test('PATCH /tenants/activate - Activate tenant (INACTIVE → ACTIVE)', async ({ authRequest }) => {
    const data = {
      tenantCode: 'fedbank',
    };
    const response = await authRequest.patch('/tenants/activate', { data });

    expect(response.status()).toBe(200);
  });

  test('PATCH /tenants/Inactivate - Inactivate tenant (ACTIVE → INACTIVE)', async ({
    authRequest,
  }) => {
    const data = {
      tenantCode: 'fedbank',
    };
    const response = await authRequest.patch('/tenants/Inactivate', { data });

    expect(response.status()).toBe(200);
  });

  test('GET /tenants/applications - Get tenant apps', async ({ authRequest }) => {
    const params = {
      tenantId: 'tenant-123',
      page: 1,
      limit: 10,
      domain: 'BFS',
      appType: 'MOBILE_APPLICATION',
      environment: 'UAT',
      isEnabled: true,
      searchTerm: 'Workforce',
    };
    const response = await authRequest.get('/tenants/applications', { params });

    expect(response.status()).toBe(200);
  });

  test('GET /tenants/users - List all users', async ({ authRequest }) => {
    const params = {
      page: 1,
      limit: 10,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      appId: '00000000-0000-0000-0000-000000000000',
      searchTerm: 'Workforce',
      appCode: 'AWF001',
    };
    const response = await authRequest.get('/tenants/users', { params });

    expect(response.status()).toBe(200);
  });

  test('GET /tenants/users/search - Search for users', async ({ authRequest }) => {
    const params = {
      page: 1,
      limit: 10,
      search: 'John',
    };
    const response = await authRequest.get('/tenants/users/search', { params });

    expect(response.status()).toBe(200);
  });

  test('GET /tenants/app-permissions - List all app permissions', async ({ authRequest }) => {
    const params = {
      appCode: 'TEST_CODE',
    };
    const response = await authRequest.get('/tenants/app-permissions', { params });

    expect(response.status()).toBe(200);
  });

  test('GET /tenants/role-types - List all role types', async ({ authRequest }) => {
    const response = await authRequest.get('/tenants/role-types');

    expect(response.status()).toBe(200);
  });

  test('GET /tenants/regions - List regions for a tenant', async ({ authRequest }) => {
    const params = {
      page: 1,
      limit: 10,
      tenantId: 'tenant-123',
    };
    const response = await authRequest.get('/tenants/regions', { params });

    expect(response.status()).toBe(200);
  });

  test('PATCH /tenants/applications/{appId} - Activate or deactivate tenant application', async ({
    authRequest,
  }) => {
    const appId = '123e4567-e89b-12d3-a456-426614174000'; // TODO: replace with a real appId
    const params = {
      tenantId: '123e4567-e89b-12d3-a456-426655440000',
    };
    const response = await authRequest.patch(`/tenants/applications/${appId}`, { params });

    expect(response.status()).toBe(200);
  });

  test('GET /tenants/{code} - Get tenant by code', async ({ authRequest }) => {
    const code = 'TEST_CODE'; // TODO: replace with a real code
    const response = await authRequest.get(`/tenants/${code}`);

    expect(response.status()).toBe(200);
  });

  test('PUT /tenants/{id} - Edit a tenant', async ({ authRequest }) => {
    const id = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real id
    const data = {
      tenantType: 'BANK',
      email: 'user@example.com',
      phoneNumber: '+911234567890',
      addressLine1: 'string',
      addressLine2: 'string',
      state: 'string',
      city: 'string',
      country: 'string',
      pincode: 'TEST_CODE',
    };
    const response = await authRequest.put(`/tenants/${id}`, { data });

    expect(response.status()).toBe(200);
  });
});
