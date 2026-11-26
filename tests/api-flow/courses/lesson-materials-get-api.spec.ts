import { test, expect } from '@playwright/test';

const courseId = '6a9e634baec8e66bfa61419d';
const courseDetailUrl = `https://dev-lms360-backend.aixhub.ai/api/v1/courses/${courseId}/detail`;
const apiToken = (process.env.API_TOKEN || '').replace(/^Bearer\s+/i, '').trim();

test.describe('LMS lesson materials GET flow @api @positive @courses', () => {
  test.skip(!apiToken || apiToken === 'your-token', 'Set API_TOKEN in .env before running the lesson API flow');

  test('gets materials for the selected lesson', async ({ request }) => {
    const headers = {
      Authorization: `Bearer ${apiToken}`,
      Accept: 'application/json',
    };

    const detailResponse = await request.get(courseDetailUrl, { headers });
    const detailBody = await detailResponse.text();
    expect(detailResponse.status(), detailBody).toBe(200);
    const detailJson = JSON.parse(detailBody);
    const course = detailJson.data || detailJson.course || detailJson;
    const lessons = course.lessons || course.courseLessons || course.lessonList || [];
    expect(lessons.length, 'Course detail should contain at least one lesson').toBeGreaterThan(0);
    const lesson = lessons[0].lesson || lessons[0];
    expect(lesson.id).toBeTruthy();

    const materialsUrl = `https://dev-lms360-backend.aixhub.ai/api/v1/user-progress/lessons/${lesson.id}/materials`;
    const response = await request.get(materialsUrl, { headers });
    const responseBody = await response.text();

    console.log('LESSON MATERIALS GET status:', response.status());
    console.log('LESSON MATERIALS GET response:', responseBody);
    expect([200, 400], responseBody).toContain(response.status());
    if (response.status() === 400) {
      expect(responseBody).toContain('You must be enrolled in the course to download materials.');
    } else {
      expect(() => JSON.parse(responseBody)).not.toThrow();
    }
  });
});