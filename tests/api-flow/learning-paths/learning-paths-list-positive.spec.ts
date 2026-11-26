import { test, expect } from '@playwright/test';

const learningPathsUrl =
  'https://dev-lms360-backend.aixhub.ai/api/v1/learning-paths?page=1&limit=10';
const apiToken = (process.env.API_TOKEN || '').replace(/^Bearer\s+/i, '').trim();

test.describe('LMS learning paths API GET flow @api @positive @learning-paths', () => {
  test.skip(
    !apiToken || apiToken === 'your-token',
    'Set API_TOKEN in .env before running the learning-paths API flow',
  );

  test('gets the first page of learning paths with GET', async ({ request }) => {
    const response = await request.get(learningPathsUrl, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: 'application/json',
      },
    });
    const responseBody = await response.text();

    console.log('LEARNING PATHS GET status:', response.status());
    console.log('LEARNING PATHS GET response:', responseBody);
    expect(response.status(), responseBody).toBe(200);

    const body = JSON.parse(responseBody);
    const learningPaths = Array.isArray(body)
      ? body
      : body.data || body.learningPaths || [];
    expect(Array.isArray(learningPaths), 'Learning paths response should contain an array').toBeTruthy();
  });
});