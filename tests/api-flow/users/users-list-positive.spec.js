const { test, expect } = require('@playwright/test');

const apiToken = (process.env.API_TOKEN || process.env.USERS_API_TOKEN || '').replace(/^Bearer\s+/i, '').trim();

test.use({ baseURL: 'https://dev-lms360-backend.aixhub.ai' });

test.describe('LMS users API GET flow @api @positive @users', () => {
  test.skip(!apiToken || apiToken === 'your-token', 'Set API_TOKEN in .env before running the users API flow');

  test('gets the first page of users', async ({ request }) => {
    const response = await request.get('/api/v1/users?page=1&limit=10', {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    console.log('Status:', response.status());
    const responseBody = await response.text();
    console.log('Response:', responseBody);

    expect(response.status()).toBe(200);
  });
});
