import { expect } from '@playwright/test';
import { test } from '../fixtures/api.fixture';

/**
 * Regions API tests
 * Auto-generated from the Identity & Access Service OpenAPI spec.
 * Review generated request bodies / path params before relying on these in CI.
 */
test.describe('Regions', () => {
  test('POST /regions - Create a new region', async ({ authRequest }) => {
    const params = {
      tenantId: '00000000-0000-0000-0000-000000000000',
    };
    const data = {
      name: 'North America',
      code: 'NA',
      countryCode: 'USA',
      parentRegionId: 'uuid-parent-region-id',
      status: 'ACTIVE',
    };
    const response = await authRequest.post('/regions', { params, data });

    expect(response.status()).toBe(201);
  });

  test('GET /regions - Get all regions with filters, pagination and name search', async ({
    authRequest,
  }) => {
    const params = {
      page: 1,
      limit: 10,
      tenantId: 'uuid-tenant-id',
      status: 'ACTIVE',
      parentRegionId: 'uuid-parent-region-id',
      countryCode: 'USA',
      search: 'North America',
    };
    const response = await authRequest.get('/regions', { params });

    expect(response.status()).toBe(200);
  });

  test('PATCH /regions/{id} - Update a region', async ({ authRequest }) => {
    const id = '00000000-0000-0000-0000-000000000000'; // TODO: replace with a real id
    const params = {
      tenantId: '00000000-0000-0000-0000-000000000000',
    };
    const data = {
      code: 'NA',
      name: 'North America',
      countryCode: 'USA',
      parentRegionId: 'uuid-parent-region-id',
      status: 'ACTIVE',
    };
    const response = await authRequest.patch(`/regions/${id}`, { params, data });

    expect(response.status()).toBe(201);
  });
});
