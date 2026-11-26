import { expect } from '@playwright/test';
import { test } from '../fixtures/api.fixture';

/**
 * Departments API tests
 * Auto-generated from the Identity & Access Service OpenAPI spec.
 * Review generated request bodies / path params before relying on these in CI.
 */
test.describe('Departments', () => {
  test('POST /departments - Create a new department', async ({ authRequest }) => {
    const params = {
      tenantId: '00000000-0000-0000-0000-000000000000',
    };
    const data = {
      name: 'Development',
      code: 'DEV',
      description: 'Development team',
      parentDepartmentId: 'uuid-parent-department-id',
      status: 'ACTIVE',
    };
    const response = await authRequest.post('/departments', { params, data });

    expect(response.status()).toBe(201);
  });

  test('GET /departments - Get all departments with filters, pagination and name search', async ({
    authRequest,
  }) => {
    const params = {
      page: 1,
      limit: 10,
      tenantId: 'uuid-tenant-id',
      status: 'ACTIVE',
      parentDepartmentId: 'uuid-parent-department-id',
      search: 'Engineering',
    };
    const response = await authRequest.get('/departments', { params });

    expect(response.status()).toBe(200);
  });

  test('PUT /departments/{id} - Update a department', async ({ authRequest }) => {
    const id = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real id
    const data = {
      code: 'DEV',
      name: 'Development',
      description: 'Development team',
      parentDepartmentId: 'uuid-parent-department-id',
      status: 'ACTIVE',
    };
    const response = await authRequest.put(`/departments/${id}`, { data });

    expect(response.status()).toBe(201);
  });
});
