import { expect } from '@playwright/test';
import { test } from '../fixtures/api.fixture';

/**
 * Teams API tests
 * Auto-generated from the Identity & Access Service OpenAPI spec.
 * Review generated request bodies / path params before relying on these in CI.
 */
test.describe('Teams', () => {
  test('POST /teams - Create a new team', async ({ authRequest }) => {
    const params = {
      tenantId: '00000000-0000-0000-0000-000000000000',
    };
    const data = {
      name: 'Engineering',
      description: 'Software engineering team',
      departmentId: 'uuid-department-id',
      regionId: 'uuid-region-id',
      status: 'ACTIVE',
    };
    const response = await authRequest.post('/teams', { params, data });

    expect(response.status()).toBe(201);
  });

  test('GET /teams - Get all teams with filters, pagination and name search', async ({
    authRequest,
  }) => {
    const params = {
      page: 1,
      limit: 10,
      tenantId: 'uuid-tenant-id',
      regionId: 'uuid-region-id',
      departmentId: 'uuid-department-id',
      status: 'ACTIVE',
      search: 'QA Team',
    };
    const response = await authRequest.get('/teams', { params });

    expect(response.status()).toBe(200);
  });

  test('POST /teams/{teamId}/users - Add a user to a team', async ({ authRequest }) => {
    const teamId = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real teamId
    const data = {
      userId: 'uuid-user-id',
      status: 'ACTIVE',
    };
    const response = await authRequest.post(`/teams/${teamId}/users`, { data });

    expect(response.status()).toBe(201);
  });

  test('GET /teams/{teamId}/users - Get users under a team', async ({ authRequest }) => {
    const teamId = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real teamId
    const params = {
      page: 1,
      limit: 10,
      roleId: 'uuid-region-id',
      status: 'ACTIVE',
      search: 'John',
    };
    const response = await authRequest.get(`/teams/${teamId}/users`, { params });

    expect(response.status()).toBe(200);
  });

  test('PATCH /teams/{id} - Update a team', async ({ authRequest }) => {
    const id = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real id
    const params = {
      tenantId: '00000000-0000-0000-0000-000000000000',
    };
    const data = {
      name: 'Engineering',
      description: 'Software engineering team',
      departmentId: 'uuid-department-id',
      regionId: 'uuid-region-id',
      status: 'ACTIVE',
    };
    const response = await authRequest.patch(`/teams/${id}`, { params, data });

    expect(response.status()).toBe(200);
  });

  test('DELETE /teams/users - Remove a user from a team', async ({ authRequest }) => {
    const data = {
      teamId: 'uuid-team-id',
      userId: 'uuid-user-id',
    };
    const response = await authRequest.delete('/teams/users', { data });

    expect(response.status()).toBe(200);
  });
});
