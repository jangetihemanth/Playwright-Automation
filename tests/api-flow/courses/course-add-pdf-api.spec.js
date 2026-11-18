const fs = require('fs');
const { test, expect } = require('@playwright/test');

const courseId = '6a9e634baec8e66bfa61419d';
const courseDetailUrl = `https://dev-lms360-backend.aixhub.ai/api/v1/courses/${courseId}/detail`;
const uploadContentUrl =
  'https://dev-lms360-backend.aixhub.ai/api/v1/courses/wizard/step2/upload-content';
const pdfPath = 'C:\\Users\\Hemanth kumar\\Downloads\\javascript_tutorial 2.pdf';
const apiToken = (process.env.API_TOKEN || '').replace(/^Bearer\s+/i, '').trim();

test.describe('LMS course PDF content flow @api @positive @courses', () => {
  test.skip(!apiToken || apiToken === 'your-token', 'Set API_TOKEN in .env before running the course API flow');

  test('gets course details, then adds a PDF to its first lesson', async ({ request }) => {
    expect(fs.existsSync(pdfPath), `PDF file was not found: ${pdfPath}`).toBeTruthy();
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

    const iteration = Date.now();
    const response = await request.post(uploadContentUrl, {
      headers,
      multipart: {
        courseId,
        lessonId: lesson.id,
        title: `JavaScript Tutorial PDF-${iteration}`,
        contentType: 'DOCUMENT',
        fileName: 'javascript_tutorial 2.pdf',
        mimeType: 'application/pdf',
        description: 'JavaScript tutorial PDF added to the course lesson',
        orderIndex: '0',
        durationMinutes: '0',
        isMandatory: 'true',
        file: {
          name: 'javascript_tutorial 2.pdf',
          mimeType: 'application/pdf',
          buffer: fs.readFileSync(pdfPath),
        },
      },
    });
    const responseBody = await response.text();

    console.log('COURSE PDF UPLOAD courseId:', courseId);
    console.log('COURSE PDF UPLOAD lessonId:', lesson.id);
    console.log('COURSE PDF UPLOAD status:', response.status());
    console.log('COURSE PDF UPLOAD response:', responseBody);
    expect([200, 201], responseBody).toContain(response.status());
  });
});