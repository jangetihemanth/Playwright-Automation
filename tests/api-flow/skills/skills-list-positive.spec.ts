import { test, expect } from '@playwright/test';

const skillsUrl = 'https://dev-lms360-backend.aixhub.ai/api/v1/skills?page=1&limit=10';
const apiToken = (process.env.API_TOKEN || process.env.USERS_API_TOKEN || '').replace(/^Bearer\s+/i, '').trim();

test.describe('LMS skills API GET flow @api @positive @skills', () => {
  test.skip(!apiToken || apiToken === 'your-token', 'Set API_TOKEN in .env before running the skills API flow');

  test('gets the first page of skills', async ({ request }) => {
    const response = await request.get(skillsUrl, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: 'application/json',
      },
    });

    const responseBody = await response.text();
    console.log('SKILLS GET status:', response.status());
    console.log('SKILLS GET response:', responseBody);

    expect(response.status(), responseBody).toBe(200);

    const body = JSON.parse(responseBody);
    const skills = Array.isArray(body) ? body : body.data || body.skills;
    expect(Array.isArray(skills), 'Skills response should contain an array').toBeTruthy();
    expect(skills.length).toBeLessThanOrEqual(10);
  });
});
