const { test, expect } = require('@playwright/test');

const courseId = '6a9e634baec8e66bfa61419d';
const courseDetailUrl = `https://dev-lms360-backend.aixhub.ai/api/v1/courses/${courseId}/detail`;
const apiToken = (process.env.API_TOKEN || '').replace(/^Bearer\s+/i, '').trim();

test.describe('LMS course detail GET flow @api @positive @courses', () => {
  test.skip(!apiToken || apiToken === 'your-token', 'Set API_TOKEN in .env before running the course API flow');

  test('gets course details before reading lesson materials', async ({ request }) => {
    const response = await request.get(courseDetailUrl, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: 'application/json',
      },
    });
    const responseBody = await response.text();

    console.log('COURSE DETAIL GET status:', response.status());
    console.log('COURSE DETAIL GET response:', responseBody);
    expect(response.status(), responseBody).toBe(200);

    const body = JSON.parse(responseBody);
    const course = body.data || body.course || body;
    expect(course).toEqual(expect.objectContaining({ id: courseId }));
  });
});