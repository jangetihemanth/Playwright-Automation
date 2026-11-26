import { test, expect } from '@playwright/test';

const userId = '95f3f0fb-d233-4d6c-bee6-3e99868019ac';
const userUrl = `https://dev-lms360-backend.aixhub.ai/api/v1/users/${userId}`;
const apiToken = (process.env.API_TOKEN || process.env.USERS_API_TOKEN || '').replace(/^Bearer\s+/i, '').trim();

test.describe('LMS users API PATCH flow @api @positive @users', () => {
  test.skip(!apiToken || apiToken === 'your-token', 'Set USERS_API_TOKEN to a valid bearer token');

  test('updates only the user email and validates the response user', async ({ request }) => {
    const email = `test-${Date.now()}@example.com`;
    const response = await request.patch(userUrl, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      data: { email },
    });

    const responseBody = await response.text();
    expect(
      [200, 204],
      `Users PATCH returned ${response.status()}: ${responseBody}`,
    ).toContain(response.status());

    if (responseBody) {
      const body = JSON.parse(responseBody);
      const updatedUser = body.user || body;
      expect(updatedUser).toEqual(expect.objectContaining({
        id: userId,
        email,
      }));
    }
  });
});
