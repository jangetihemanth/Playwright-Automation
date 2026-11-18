const { test, expect } = require('@playwright/test');

const courseId = '6a9e634baec8e66bfa61419d';
const previewUrl =
  `https://dev-lms360-backend.aixhub.ai/api/v1/certificates/template/course/${courseId}/preview`;
const apiToken = (process.env.API_TOKEN || '').replace(/^Bearer\s+/i, '').trim();

test.describe('LMS certificate preview GET flow @api @positive @courses', () => {
  test.skip(!apiToken || apiToken === 'your-token', 'Set API_TOKEN in .env before running the certificate API flow');

  test('gets a temporary certificate preview URL for the course', async ({ request }) => {
    const response = await request.get(previewUrl, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: 'application/json',
      },
    });
    const responseBody = await response.text();

    console.log('CERTIFICATE PREVIEW GET status:', response.status());
    console.log('CERTIFICATE PREVIEW GET response:', responseBody);
    expect(response.status(), responseBody).toBe(200);
    expect(responseBody).toBeTruthy();
    expect(() => JSON.parse(responseBody)).not.toThrow();
  });
});