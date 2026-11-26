import { test, expect } from '@playwright/test';

const learningPathsUrl =
  'https://dev-lms360-backend.aixhub.ai/api/v1/learning-paths';
const apiToken = (process.env.API_TOKEN || '').replace(/^Bearer\s+/i, '').trim();

test.describe('LMS learning paths API positive flow @api @positive @learning-paths', () => {
  test.skip(
    !apiToken || apiToken === 'your-token',
    'Set API_TOKEN in .env before running the learning-paths API flow',
  );

  test('probes learning paths wizard endpoints', async ({ request }) => {
    const res1 = await request.post('https://dev-lms360-backend.aixhub.ai/api/v1/learning-paths/wizard/step1/basic-info', {
      headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
      data: { title: 'lp1' },
    });
    console.log('WIZARD STEP1 status:', res1.status(), await res1.text());
  });
});
