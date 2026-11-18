const { test, expect } = require('@playwright/test');

const categoriesUrl = 'https://dev-lms360-backend.aixhub.ai/api/v1/skill-categories?page=1&limit=999&type=SKILL';
const skillsUrl = 'https://dev-lms360-backend.aixhub.ai/api/v1/skills';
const categoryName = 'Skill_Category_34_7E9086E96D';
const apiToken = (process.env.API_TOKEN || process.env.USERS_API_TOKEN || '').replace(/^Bearer\s+/i, '').trim();

test.describe('LMS skills API positive flow @api @positive @skills', () => {
  test.skip(!apiToken || apiToken === 'your-token', 'Set API_TOKEN in .env before running the skills API flow');

  test('gets skill categories before creating a skill', async ({ request }) => {
    const headers = {
      Authorization: `Bearer ${apiToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const categoriesResponse = await request.get(categoriesUrl, { headers });
    const categoriesBody = await categoriesResponse.text();
    console.log('SKILL CATEGORY GET status:', categoriesResponse.status());
    console.log('SKILL CATEGORY GET response:', categoriesBody);
    expect(categoriesResponse.status(), categoriesBody).toBe(200);

    const parsedCategories = JSON.parse(categoriesBody);
    const categories = Array.isArray(parsedCategories)
      ? parsedCategories
      : parsedCategories.data || parsedCategories.categories || [];
    expect(Array.isArray(categories)).toBeTruthy();
    expect(
      categories.some(category => category.name === categoryName || category.code === categoryName),
      `Skill category ${categoryName} was not returned by the category GET API`,
    ).toBeTruthy();

    const payload = {
      name: `tgbh-${Date.now()}`,
      description: 'fvgbhn',
      category: categoryName,
      level: 'Intermediate',
    };
    const skillResponse = await request.post(skillsUrl, {
      headers,
      data: payload,
    });
    const skillBody = await skillResponse.text();
    console.log('SKILL POST status:', skillResponse.status());
    console.log('SKILL POST response:', skillBody);

    expect([200, 201], skillBody).toContain(skillResponse.status());
    expect(JSON.parse(skillBody)).toEqual(expect.objectContaining(payload));
  });
});
