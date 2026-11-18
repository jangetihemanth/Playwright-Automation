const { test, expect } = require('@playwright/test');

const branchesUrl = 'https://dev-lms360-backend.aixhub.ai/api/v1/branches';
const apiToken = (process.env.API_TOKEN || '').replace(/^Bearer\s+/i, '').trim();

test.describe('LMS branches API GET flow @api @positive @branches', () => {
  test.skip(!apiToken || apiToken === 'your-token', 'Set API_TOKEN in .env before running the branches API flow');

  test('gets branches with GET', async ({ request }) => {
    const response = await request.get(branchesUrl, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: 'application/json',
      },
    });
    const responseBody = await response.text();

    console.log('BRANCHES GET status:', response.status());
    console.log('BRANCHES GET response:', responseBody);
    expect(response.status(), responseBody).toBe(200);

    const body = JSON.parse(responseBody);
    const branches = Array.isArray(body) ? body : body.data || body.branches || [];
    expect(Array.isArray(branches), 'Branches response should contain an array').toBeTruthy();
  });
});