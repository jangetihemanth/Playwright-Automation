import { expect } from '@playwright/test';
import { test } from '../fixtures/api.fixture';

/**
 * Applications API tests
 * Auto-generated from the Identity & Access Service OpenAPI spec.
 * Review generated request bodies / path params before relying on these in CI.
 */
test.describe('Applications', () => {
  test('POST /applications/create-app - Create a new app', async ({ authRequest }) => {
    const response = await authRequest.post('/applications/create-app');

    expect(response.status()).toBe(201);
  });

  test('GET /applications - List application with pagination and filters', async ({
    authRequest,
  }) => {
    const params = {
      page: 1,
      limit: 10,
      domain: 'BFS',
      appType: 'MOBILE_APPLICATION',
      environment: 'UAT',
      status: 'ACTIVE',
    };
    const response = await authRequest.get('/applications', { params });

    expect(response.status()).toBe(200);
  });

  test('GET /applications/search - Search app by app name or app code', async ({ authRequest }) => {
    const params = {
      searchTerm: 'AiXFieldGo',
      page: 1,
      limit: 10,
    };
    const response = await authRequest.get('/applications/search', { params });

    expect(response.status()).toBe(200);
  });

  test('GET /applications/summary - Get application summary', async ({ authRequest }) => {
    const response = await authRequest.get('/applications/summary');

    expect(response.status()).toBe(200);
  });

  test('PATCH /applications/activate - Activate application (INACTIVE → ACTIVE)', async ({
    authRequest,
  }) => {
    const data = {
      appCode: 'AiX_FGO',
    };
    const response = await authRequest.patch('/applications/activate', { data });

    expect(response.status()).toBe(200);
  });

  test('PATCH /applications/deactivate - Deactivate application (ACTIVE → INACTIVE)', async ({
    authRequest,
  }) => {
    const data = {
      appCode: 'AiX_FGO',
    };
    const response = await authRequest.patch('/applications/deactivate', { data });

    expect(response.status()).toBe(200);
  });

  test('PUT /applications/{appId} - Update an existing application', async ({ authRequest }) => {
    const appId = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real appId
    const response = await authRequest.put(`/applications/${appId}`);

    expect(response.status()).toBe(200);
  });

  test('POST /applications/tenant/{tenantId} - Assign apps to tenant', async ({ authRequest }) => {
    const tenantId = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real tenantId
    const data = {
      appIds: ['a1b2c3d4-1111-2222-3333-444455556666', 'e7f8g9h0-7777-8888-9999-000011112222'],
    };
    const response = await authRequest.post(`/applications/tenant/${tenantId}`, { data });

    expect(response.status()).toBe(201);
  });

  test('POST /applications/user/{userId} - Assign apps to user', async ({ authRequest }) => {
    const userId = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real userId
    const data = {
      appIds: ['a1b2c3d4-1111-2222-3333-444455556666'],
      tenantId: 'uuid-tenant-id',
      role: 'TENANT_ADMIN',
      roleId: 'a1b2c3d4-1111-2222-3333-444455556666',
    };
    const response = await authRequest.post(`/applications/user/${userId}`, { data });

    expect(response.status()).toBe(201);
  });

  test('DELETE /applications/{appCode} - Delete application (soft delete)', async ({
    authRequest,
  }) => {
    const appCode = 'TEST_CODE'; // TODO: replace with a real appCode
    const response = await authRequest.delete(`/applications/${appCode}`);

    expect(response.status()).toBe(200);
  });
});
