const { test, expect } = require('@playwright/test');

const usersUrl = 'https://dev-lms360-backend.aixhub.ai/api/v1/users';
const skillCategoriesUrl = 'https://dev-lms360-backend.aixhub.ai/api/v1/skill-categories';
const departmentId = 'a1fd3357-6ae9-45c3-8044-dd3fd8075dab';
const roleId = '7f9bc699-6949-41cf-8df4-1ceb59707995';
const apiToken = (process.env.API_TOKEN || process.env.USERS_API_TOKEN || '').replace(/^Bearer\s+/i, '').trim();
const skillCategoriesToken = (process.env.API_TOKEN || process.env.SKILL_CATEGORIES_API_TOKEN || apiToken).replace(/^Bearer\s+/i, '').trim();

function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

function uniqueSuffix() {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

test.describe('LMS API positive flow @api @positive @p0', () => {
  test.skip(!apiToken || apiToken === 'your-token' || !skillCategoriesToken || skillCategoriesToken === 'your-token', 'Set API_TOKEN in .env before running the API flow');

  test('creates a skill category and a user', async ({ request }) => {
    const suffix = uniqueSuffix();
    const category = {
      name: `PositiveCategory${suffix}`,
      description: `Positive category ${suffix}`,
      type: 'COURSE',
    };
    const categoryResponse = await request.post(skillCategoriesUrl, {
      headers: headers(skillCategoriesToken),
      data: category,
    });

    expect([200, 201]).toContain(categoryResponse.status());
    expect(await categoryResponse.json()).toEqual(expect.objectContaining(category));

    const user = {
      firstName: 'PTest',
      lastName: 'User',
      email: `positive.user.${suffix}@example.com`,
      phone: `98${suffix.slice(-8)}`,
      employeeId: `EMP${suffix}`,
      departmentId: '1f0d5790-9daf-418c-9f47-dcb3a1007a8f',
      roleId: '01163e89-86e6-4b0b-b2c7-68881930fc2e',
    };
    const userResponse = await request.post(usersUrl, {
      headers: headers(apiToken),
      data: user,
    });

    const userResponseBody = await userResponse.json();
    console.log('USER POST status:', userResponse.status());
    console.log('USER POST response:', userResponseBody);

    expect([200, 201]).toContain(userResponse.status());
    expect(userResponseBody).toEqual(expect.objectContaining(user));
  });
});
