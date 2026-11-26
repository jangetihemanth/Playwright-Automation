import { expect } from '@playwright/test';
import { test } from '../fixtures/api.fixture';

/**
 * Users API tests
 * Auto-generated from the Identity & Access Service OpenAPI spec.
 * Review generated request bodies / path params before relying on these in CI.
 */
test.describe('Users', () => {
  test('POST /users - Create a new user', async ({ authRequest }) => {
    const data = {
      tenantId: 'uuid-tenant-id',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@abc.com',
      phone: '+91XXXXXXXXXX',
      username: 'john.doe',
      employeeId: 'Employee_123456',
      dateOfJoining: '2022-01-01T00:00:00.000Z',
      regionId: 'uuid-region-id',
      departmentId: 'uuid-department-id',
      teamId: 'uuid-team-id',
      profileUrl: 'https://example.com/profile.jpg',
    };
    const response = await authRequest.post('/users', { data });

    expect(response.status()).toBe(201);
  });

  test('GET /users - List all users', async ({ authRequest }) => {
    const params = {
      page: 1,
      limit: 10,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      appId: '00000000-0000-0000-0000-000000000000',
      searchTerm: 'Workforce',
      appCode: 'AWF001',
      tenantId: '00000000-0000-0000-0000-000000000000',
      roleName: 'Executive HR Manager',
    };
    const response = await authRequest.get('/users', { params });

    expect(response.status()).toBe(200);
  });

  test('POST /users/app-user - Create a new user and assign an app-specific role', async ({
    authRequest,
  }) => {
    const data = {
      tenantId: 'uuid-tenant-id',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@abc.com',
      phone: '+91XXXXXXXXXX',
      username: 'john.doe',
      employeeId: 'Employee_123456',
      dateOfJoining: '2022-01-01T00:00:00.000Z',
      regionId: 'uuid-region-id',
      departmentId: 'uuid-department-id',
      teamId: 'uuid-team-id',
      profileUrl: 'https://example.com/profile.jpg',
      targetRoleId: 'uuid-role-id',
      managerUserId: 'uuid-reporting-manager-id',
    };
    const response = await authRequest.post('/users/app-user', { data });

    expect(response.status()).toBe(201);
  });

  test('GET /users/me - Get own profile', async ({ authRequest }) => {
    const response = await authRequest.get('/users/me');

    expect(response.status()).toBe(200);
  });

  test('GET /users/search - Search for users (Platform Admin Only)', async ({ authRequest }) => {
    const params = {
      page: 1,
      limit: 10,
      search: 'John',
    };
    const response = await authRequest.get('/users/search', { params });

    expect(response.status()).toBe(200);
  });

  test('GET /users/summary - Get user summary', async ({ authRequest }) => {
    const params = {
      tenantId: '00000000-0000-0000-0000-000000000000',
      appId: '00000000-0000-0000-0000-000000000000',
    };
    const response = await authRequest.get('/users/summary', { params });

    expect(response.status()).toBe(200);
  });

  test('POST /users/import - Import users in bulk from a excel file', async ({ authRequest }) => {
    const response = await authRequest.post('/users/import');

    expect(response.status()).toBe(201);
  });

  test('GET /users/templates/bulk-import - Download bulk user import Excel template', async ({
    authRequest,
  }) => {
    const params = {
      'tenant-uuid': '00000000-0000-0000-0000-000000000000',
    };
    const response = await authRequest.get('/users/templates/bulk-import', { params });

    expect(response.status()).toBe(200);
  });

  test('GET /users/by-role - Get user IDs linked with a role, tenant, and app', async ({
    authRequest,
  }) => {
    const params = {
      roleId: '00000000-0000-0000-0000-000000000000',
      tenantId: '00000000-0000-0000-0000-000000000000',
      appId: '00000000-0000-0000-0000-000000000000',
    };
    const response = await authRequest.get('/users/by-role', { params });

    expect(response.status()).toBe(200);
  });

  test('GET /users/{id} - Get user by ID', async ({ authRequest }) => {
    const id = 'uuid-user-id'; // TODO: replace with a real id
    const response = await authRequest.get(`/users/${id}`);

    expect(response.status()).toBe(200);
  });

  test('PUT /users/{id} - Update a user', async ({ authRequest }) => {
    const id = 'uuid-user-id'; // TODO: replace with a real id
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@abc.com',
      phone: '+91XXXXXXXXXX',
      username: 'john.doe',
      status: 'ACTIVE',
      dateOfJoining: '2022-01-01T00:00:00.000Z',
      departmentId: 'uuid-department-id',
      regionId: 'uuid-region-id',
      teamId: 'uuid-team-id',
    };
    const response = await authRequest.put(`/users/${id}`, { data });

    expect(response.status()).toBe(200);
  });

  test('PATCH /users/{id} - Patch a user', async ({ authRequest }) => {
    const id = 'uuid-user-id'; // TODO: replace with a real id
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@abc.com',
      phone: '+91XXXXXXXXXX',
      username: 'john.doe',
      status: 'ACTIVE',
      dateOfJoining: '2022-01-01T00:00:00.000Z',
      departmentId: 'uuid-department-id',
      regionId: 'uuid-region-id',
      teamId: 'uuid-team-id',
    };
    const response = await authRequest.patch(`/users/${id}`, { data });

    expect(response.status()).toBe(200);
  });

  test('POST /users/{id}/role - Assign or update a role to a user', async ({ authRequest }) => {
    const id = 'uuid-user-id'; // TODO: replace with a real id
    const data = {
      tenantId: 'uuid-tenant-id',
      managerUserId: 'uuid-reporting-manager-id',
      roleId: 'uuid-role-id',
    };
    const response = await authRequest.post(`/users/${id}/role`, { data });

    expect(response.status()).toBe(200);
  });

  test('POST /users/{id}/department - Assign a department to a user', async ({ authRequest }) => {
    const id = 'uuid-user-id'; // TODO: replace with a real id
    const data = {
      tenantId: 'uuid-tenant-id',
      departmentId: 'uuid-department-id',
    };
    const response = await authRequest.post(`/users/${id}/department`, { data });

    expect(response.status()).toBe(200);
  });

  test('POST /users/{id}/region - Assign a region to a user', async ({ authRequest }) => {
    const id = 'uuid-user-id'; // TODO: replace with a real id
    const data = {
      tenantId: 'uuid-tenant-id',
      regionId: 'uuid-region-id',
    };
    const response = await authRequest.post(`/users/${id}/region`, { data });

    expect(response.status()).toBe(200);
  });

  test('PATCH /users/{id}/profile-image - Upload user profile image', async ({ authRequest }) => {
    const id = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real id
    const response = await authRequest.patch(`/users/${id}/profile-image`);

    expect(response.status()).toBe(200);
  });

  test('GET /users/{userId} - Get user apps list', async ({ authRequest }) => {
    const userId = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real userId
    const tenantId = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real tenantId
    const response = await authRequest.get(`/users/${userId}`);

    expect(response.status()).toBe(200);
  });

  test('GET /users/{userId}/roles - Get user roles by user ID', async ({ authRequest }) => {
    const userId = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real userId
    const params = {
      tenantId: '00000000-0000-0000-0000-000000000000',
    };
    const response = await authRequest.get(`/users/${userId}/roles`, { params });

    expect(response.status()).toBe(200);
  });
});
