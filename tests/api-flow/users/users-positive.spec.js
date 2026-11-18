const { test, expect } = require('@playwright/test');

const usersUrl = 'https://dev-lms360-backend.aixhub.ai/api/v1/users';
const apiToken = (process.env.API_TOKEN || process.env.USERS_API_TOKEN || '').replace(/^Bearer\s+/i, '').trim();

function createUserPayload() {
  const unique = Date.now().toString().slice(-8);
  return {
    firstName: 'PTest',
    lastName: 'User',
    email: `test-${Date.now()}@example.com`,
    employeeId: `EMP-${Date.now()}`,
    phone: `98${unique}`,
    departmentId: '1f0d5790-9daf-418c-9f47-dcb3a1007a8f',
    roleId: '01163e89-86e6-4b0b-b2c7-68881930fc2e',
  };
}

test.describe('LMS users API positive flow @api @positive @users', () => {
  test.skip(!apiToken || apiToken === 'your-token', 'Set USERS_API_TOKEN to a valid bearer token');

  test('creates a user with an automatically generated email and employee ID', async ({ request }) => {
    const payload = createUserPayload();
    const response = await request.post(usersUrl, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      data: payload,
    });

    const responseBody = await response.text();
    expect(
      [200, 201],
      `Users API returned ${response.status()}. Check that USERS_API_TOKEN is valid for dev-lms360-backend.aixhub.ai. Response: ${responseBody}`,
    ).toContain(response.status());
    expect(JSON.parse(responseBody)).toEqual(expect.objectContaining(payload));
  });
});
