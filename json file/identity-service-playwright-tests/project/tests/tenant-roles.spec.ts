import { expect } from '@playwright/test';
import { test } from '../fixtures/api.fixture';

/**
 * Tenant Roles API tests
 * Auto-generated from the Identity & Access Service OpenAPI spec.
 * Review generated request bodies / path params before relying on these in CI.
 */
test.describe('Tenant Roles', () => {
  test('POST /tenants/{tenantId}/roles - Create a role for a tenant', async ({ authRequest }) => {
    const tenantId = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real tenantId
    const data = {
      code: 'TENANT_ADMIN',
      name: 'Tenant Administrator',
      description: 'Full access role for tenant administrators',
    };
    const response = await authRequest.post(`/tenants/${tenantId}/roles`, { data });

    expect(response.status()).toBe(201);
  });

  test('GET /tenants/{tenantId}/roles - List all roles of a tenant with filter', async ({
    authRequest,
  }) => {
    const tenantId = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real tenantId
    const params = {
      dateField: 'createdAt',
      from: '2026-02-01T00:00:00.000Z',
      to: '2026-02-07T23:59:59.999Z',
      page: 1,
      limit: 10,
      status: 'ACTIVE',
      code: 'GLOBAL_ADMIN',
      appId: 'uuid-app-id',
      appCode: 'LMS001',
    };
    const response = await authRequest.get(`/tenants/${tenantId}/roles`, { params });

    expect(response.status()).toBe(200);
  });

  test('GET /tenants/{tenantId}/roles/search - Search for tenant roles', async ({
    authRequest,
  }) => {
    const tenantId = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real tenantId
    const params = {
      page: 1,
      limit: 10,
      search: 'John',
    };
    const response = await authRequest.get(`/tenants/${tenantId}/roles/search`, { params });

    expect(response.status()).toBe(200);
  });

  test('GET /tenants/{tenantId}/roles/{id} - Get tenant role by ID', async ({ authRequest }) => {
    const id = 'd2b9c29a-55d6-4f92-a8b6-8cba7c6fbd1a'; // TODO: replace with a real id
    const tenantId = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real tenantId
    const response = await authRequest.get(`/tenants/${tenantId}/roles/${id}`);

    expect(response.status()).toBe(200);
  });

  test('PUT /tenants/{tenantId}/roles/{id} - Update tenant role', async ({ authRequest }) => {
    const id = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real id
    const tenantId = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real tenantId
    const data = {
      name: 'Tenant Admin',
      description: 'Updated description for the role',
      status: 'ACTIVE',
    };
    const response = await authRequest.put(`/tenants/${tenantId}/roles/${id}`, { data });

    expect(response.status()).toBe(200);
  });

  test('DELETE /tenants/{tenantId}/roles/{id} - Delete tenant role', async ({ authRequest }) => {
    const id = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real id
    const tenantId = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real tenantId
    const response = await authRequest.delete(`/tenants/${tenantId}/roles/${id}`);

    expect(response.status()).toBe(204);
  });

  test('PATCH /tenants/{tenantId}/roles/updateStatus/{id} - Activate or inactivate tenant role', async ({
    authRequest,
  }) => {
    const id = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real id
    const tenantId = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real tenantId
    const response = await authRequest.patch(`/tenants/${tenantId}/roles/updateStatus/${id}`);

    expect(response.status()).toBe(200);
  });
});
