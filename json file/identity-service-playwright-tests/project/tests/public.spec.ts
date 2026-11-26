import { expect } from '@playwright/test';
import { test } from '../fixtures/api.fixture';

/**
 * Public API tests
 * Auto-generated from the Identity & Access Service OpenAPI spec.
 * Review generated request bodies / path params before relying on these in CI.
 */
test.describe('Public', () => {
  test('GET /public/user-profile - Get user profile', async ({ request }) => {
    const params = {
      id: '00000000-0000-0000-0000-000000000000',
    };
    const response = await request.get('/public/user-profile', { params });

    expect(response.status()).toBe(200);
  });
});
