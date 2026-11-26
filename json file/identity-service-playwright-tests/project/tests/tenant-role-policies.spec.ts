import { expect } from '@playwright/test';
import { test } from '../fixtures/api.fixture';

/**
 * Tenant Role Policies API tests
 * Auto-generated from the Identity & Access Service OpenAPI spec.
 * Review generated request bodies / path params before relying on these in CI.
 */
test.describe('Tenant Role Policies', () => {
  test('POST /tenant-role-policies - Create tenant role with policies', async ({ authRequest }) => {
    const data = {
      tenantId: '696fb500-a50a-40af-8dfb-3585f679ca04',
      appId: '696fb500-a50a-40af-8dfb-3585f679ca04',
      roleId: '696fb500-a50a-40af-8dfb-3585f679ca04',
      canManageRoles: [
        '696fb500-a50a-40af-8dfb-3585f679ca04',
        '696fb500-a50a-40af-8dfb-3585f679ca04',
      ],
      canAssignRoles: ['696fb500-a50a-40af-8dfb-3585f679ca04'],
      permissions: ['ROLE_CREATE'],
    };
    const response = await authRequest.post('/tenant-role-policies', { data });

    expect(response.status()).toBe(201);
  });

  test('PUT /tenant-role-policies/{id} - Update tenant role policy', async ({ authRequest }) => {
    const id = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real id
    const data = {
      tenantId: '696fb500-a50a-40af-8dfb-3585f679ca04',
      appId: '696fb500-a50a-40af-8dfb-3585f679ca04',
      roleId: '696fb500-a50a-40af-8dfb-3585f679ca04',
      canManageRoles: [
        '696fb500-a50a-40af-8dfb-3585f679ca04',
        '696fb500-a50a-40af-8dfb-3585f679ca04',
      ],
      canAssignRoles: ['696fb500-a50a-40af-8dfb-3585f679ca04'],
      permissions: ['ROLE_CREATE'],
    };
    const response = await authRequest.put(`/tenant-role-policies/${id}`, { data });

    expect(response.status()).toBe(200);
  });

  test('DELETE /tenant-role-policies/{id} - Delete tenant role policy', async ({ authRequest }) => {
    const id = 'c1d8b9e4-12ab-4f8c-b4e3-8b0f9c3d8e21'; // TODO: replace with a real id
    const response = await authRequest.delete(`/tenant-role-policies/${id}`);

    expect(response.status()).toBe(200);
  });

  test('GET /tenant-role-policies/{tenantId} - List tenant role policies', async ({
    authRequest,
  }) => {
    const tenantId = '696fb500-a50a-40af-8dfb-3585f679ca04'; // TODO: replace with a real tenantId
    const response = await authRequest.get(`/tenant-role-policies/${tenantId}`);

    expect(response.status()).toBe(200);
  });
});
