import { test, expect } from '@playwright/test';

const categoriesUrl = 'https://dev-lms360-backend.aixhub.ai/api/v1/skill-categories';
const categoryId = '6a9d5e3aaec8e66bfa614123';
const categoryUrl = `${categoriesUrl}/${categoryId}`;
const apiToken = (
  process.env.API_TOKEN || process.env.SKILL_CATEGORIES_API_TOKEN || process.env.USERS_API_TOKEN || ''
).replace(/^Bearer\s+/i, '').trim();

function headers() {
  return {
    Authorization: `Bearer ${apiToken}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

function uniqueName(prefix) {
  return `${prefix} ${Date.now()}`;
}

test.describe('LMS skill categories API positive flow @api @positive @skill-categories', () => {
  test.beforeEach(async () => {
    test.skip(!apiToken || apiToken === 'your-token', 'Set API_TOKEN in .env before running the skill-categories API flow');
  });

  test('creates a COURSE category', async ({ request }) => {
    const payload = {
      name: uniqueName('Python for AI and Automation'),
      description: 'N/a',
      type: 'COURSE',
    };
    const response = await request.post(categoriesUrl, { headers: headers(), data: payload });
    const responseBody = await response.text();

    console.log('COURSE POST status:', response.status());
    console.log('COURSE POST response:', responseBody);
    expect([200, 201], responseBody).toContain(response.status());
    expect(JSON.parse(responseBody)).toEqual(expect.objectContaining(payload));
  });

  test('creates a SKILL category', async ({ request }) => {
    const payload = {
      name: uniqueName('Python Skill'),
      description: 'N/a',
      type: 'SKILL',
    };
    const response = await request.post(categoriesUrl, { headers: headers(), data: payload });
    const responseBody = await response.text();

    console.log('SKILL POST status:', response.status());
    console.log('SKILL POST response:', responseBody);
    expect([200, 201], responseBody).toContain(response.status());
    expect(JSON.parse(responseBody)).toEqual(expect.objectContaining(payload));
  });

  test('updates the provided category with PATCH', async ({ request }) => {
    const payload = {
      name: uniqueName('Updated Python Category'),
      description: 'N/a',
      type: 'COURSE',
    };
    const response = await request.patch(categoryUrl, { headers: headers(), data: payload });
    const responseBody = await response.text();

    console.log('PATCH status:', response.status());
    console.log('PATCH response:', responseBody);
    expect([200, 204], responseBody).toContain(response.status());
    if (responseBody) expect(JSON.parse(responseBody)).toEqual(expect.objectContaining(payload));
  });

  test('gets the first page of categories', async ({ request }) => {
    const response = await request.get(`${categoriesUrl}?page=1&limit=10`, { headers: headers() });
    const responseBody = await response.text();

    console.log('GET status:', response.status());
    console.log('GET response:', responseBody);
    expect(response.status(), responseBody).toBe(200);

    const body = JSON.parse(responseBody);
    const categories = Array.isArray(body) ? body : body.data || body.categories;
    expect(Array.isArray(categories), 'Categories response should contain an array').toBeTruthy();
    expect(categories.length).toBeLessThanOrEqual(10);
  });
});
