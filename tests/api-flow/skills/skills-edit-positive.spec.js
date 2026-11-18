const { test, expect } = require('@playwright/test');

const categoriesUrl = 'https://dev-lms360-backend.aixhub.ai/api/v1/skill-categories?page=1&limit=999&type=SKILL';
const skillsUrl = 'https://dev-lms360-backend.aixhub.ai/api/v1/skills';
const skillId = '6a9d71e6aec8e66bfa61413d';
const categoryName = 'Skill_Category_34_7E9086E96D';
const apiToken = (process.env.API_TOKEN || process.env.USERS_API_TOKEN || '').replace(/^Bearer\s+/i, '').trim();

test.describe('LMS skills API PUT flow @api @positive @skills', () => {
  test.skip(!apiToken || apiToken === 'your-token', 'Set API_TOKEN in .env before running the skills API flow');

  test('gets one skill and updates it', async ({ request }) => {
    const headers = {
      Authorization: `Bearer ${apiToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const categoriesResponse = await request.get(categoriesUrl, { headers });
    expect(categoriesResponse.status(), await categoriesResponse.text()).toBe(200);
    const categoriesBody = await categoriesResponse.json();
    const categories = Array.isArray(categoriesBody)
      ? categoriesBody
      : categoriesBody.data || categoriesBody.categories || [];
    expect(categories.some(category => category.name === categoryName || category.code === categoryName)).toBeTruthy();

    const skillsResponse = await request.get(`${skillsUrl}?page=1&limit=999`, { headers });
    const skillsBody = await skillsResponse.json();
    expect(skillsResponse.status()).toBe(200);
    const skills = Array.isArray(skillsBody) ? skillsBody : skillsBody.data || skillsBody.skills || [];
    expect(skills.some(skill => skill.id === skillId), `Skill ${skillId} was not returned by the GET API`).toBeTruthy();

    const patchPayload = {
      name: 'nature',
      description: 'fvgbhn',
      category: categoryName,
      level: 'Intermediate',
    };
    const patchResponse = await request.put(`${skillsUrl}/${skillId}`, {
      headers,
      data: patchPayload,
    });
    const patchBody = await patchResponse.text();
    console.log('SKILL PUT status:', patchResponse.status());
    console.log('SKILL PUT response:', patchBody);

    expect([200, 204], patchBody).toContain(patchResponse.status());
    if (patchBody) {
      expect(JSON.parse(patchBody)).toEqual(expect.objectContaining({
        ...patchPayload,
        name: patchPayload.name.trim(),
      }));
    }
  });
});
