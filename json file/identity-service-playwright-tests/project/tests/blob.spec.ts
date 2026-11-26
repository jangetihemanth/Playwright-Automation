import { expect } from '@playwright/test';
import { test } from '../fixtures/api.fixture';

/**
 * Blob API tests
 * Auto-generated from the Identity & Access Service OpenAPI spec.
 * Review generated request bodies / path params before relying on these in CI.
 */
test.describe('Blob', () => {
  test('POST /blob/upload-asset - Upload an asset file', async ({ authRequest }) => {
    const response = await authRequest.post('/blob/upload-asset');

    expect(response.status()).toBe(201);
  });
});
