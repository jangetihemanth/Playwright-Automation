import fs from 'fs';
import { test, expect } from '@playwright/test';

const courseCategoriesUrl =
  'https://dev-lms360-backend.aixhub.ai/api/v1/skill-categories?page=1&limit=999&type=COURSE';
const skillsUrl =
  'https://dev-lms360-backend.aixhub.ai/api/v1/skills?page=1&limit=10';
const managersUrl =
  'https://dev-lms360-backend.aixhub.ai/api/v1/users?page=1&limit=10&roleCode=MANAGER';
const createCourseUrl =
  'https://dev-lms360-backend.aixhub.ai/api/v1/courses/wizard/step1/basic-info';
const addLessonUrl =
  'https://dev-lms360-backend.aixhub.ai/api/v1/courses/wizard/step2/add-lesson';
const addContentUrl =
  'https://dev-lms360-backend.aixhub.ai/api/v1/courses/wizard/step2/add-content';
const uploadContentUrl =
  'https://dev-lms360-backend.aixhub.ai/api/v1/courses/wizard/step2/upload-content';
const pdfPath = 'C:\\Users\\Hemanth kumar\\Downloads\\javascript_tutorial 2.pdf';
const videoPath = 'C:\\Users\\Hemanth kumar\\Downloads\\SLAW - How to create a mentally healthy workplace culture and reduce stigma.mp4';
const apiToken = (process.env.API_TOKEN || '').replace(/^Bearer\s+/i, '').trim();

async function createCourseAndLesson(request, headers, iteration) {
  const [categoryResponse, skillsResponse, managersResponse] = await Promise.all([
    request.get(courseCategoriesUrl, { headers }),
    request.get(skillsUrl, { headers }),
    request.get(managersUrl, { headers }),
  ]);
  const categoryBody = await categoryResponse.text();
  const skillsBody = await skillsResponse.text();
  const managersBody = await managersResponse.text();
  expect(categoryResponse.status(), categoryBody).toBe(200);
  expect(skillsResponse.status(), skillsBody).toBe(200);
  expect(managersResponse.status(), managersBody).toBe(200);

  const categoryJson = JSON.parse(categoryBody);
  const skillsJson = JSON.parse(skillsBody);
  const managersJson = JSON.parse(managersBody);
  const categories = Array.isArray(categoryJson) ? categoryJson : categoryJson.data || categoryJson.categories || [];
  const skills = Array.isArray(skillsJson) ? skillsJson : skillsJson.data || skillsJson.skills || [];
  const managers = Array.isArray(managersJson) ? managersJson : managersJson.data || managersJson.users || [];
  expect(categories.length).toBeGreaterThan(0);
  expect(skills.length).toBeGreaterThan(0);
  expect(managers.length).toBeGreaterThan(0);

  const courseResponse = await request.post(createCourseUrl, {
    headers,
    data: {
      title: `Course-${iteration}`,
      description: 'Course created before adding content',
      category: categories[0].name || categories[0].code || categories[0].id,
      skillIds: [skills[0].id],
      instructors: [{
        instructorId: managers[0].id,
        instructorName: managers[0].name || `${managers[0].firstName || ''} ${managers[0].lastName || ''}`.trim(),
      }],
    },
  });
  const courseBody = await courseResponse.text();
  expect([200, 201], courseBody).toContain(courseResponse.status());
  const courseJson = JSON.parse(courseBody);
  const course = courseJson.data || courseJson.course || courseJson;
  expect(course.id).toBeTruthy();

  const lessonResponse = await request.post(addLessonUrl, {
    headers,
    data: {
      courseId: course.id,
      title: `Lesson-${iteration}`,
      description: 'Lesson created before adding content',
      orderIndex: 0,
    },
  });
  const lessonBody = await lessonResponse.text();
  expect([200, 201], lessonBody).toContain(lessonResponse.status());
  const lessonJson = JSON.parse(lessonBody);
  const lesson = lessonJson.data || lessonJson.lesson || lessonJson;
  expect(lesson.id).toBeTruthy();

  return { course, lesson };
}

test.describe('LMS add content API flow @api @positive @courses', () => {
  test.skip(!apiToken || apiToken === 'your-token', 'Set API_TOKEN in .env before running the courses API flow');

  test('creates a course and lesson, then adds text content', async ({ request }) => {
    const headers = {
      Authorization: `Bearer ${apiToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const [categoryResponse, skillsResponse, managersResponse] = await Promise.all([
      request.get(courseCategoriesUrl, { headers }),
      request.get(skillsUrl, { headers }),
      request.get(managersUrl, { headers }),
    ]);
    const categoryBody = await categoryResponse.text();
    const skillsBody = await skillsResponse.text();
    const managersBody = await managersResponse.text();
    expect(categoryResponse.status(), categoryBody).toBe(200);
    expect(skillsResponse.status(), skillsBody).toBe(200);
    expect(managersResponse.status(), managersBody).toBe(200);

    const categoryJson = JSON.parse(categoryBody);
    const skillsJson = JSON.parse(skillsBody);
    const managersJson = JSON.parse(managersBody);
    const categories = Array.isArray(categoryJson) ? categoryJson : categoryJson.data || categoryJson.categories || [];
    const skills = Array.isArray(skillsJson) ? skillsJson : skillsJson.data || skillsJson.skills || [];
    const managers = Array.isArray(managersJson) ? managersJson : managersJson.data || managersJson.users || [];
    expect(categories.length).toBeGreaterThan(0);
    expect(skills.length).toBeGreaterThan(0);
    expect(managers.length).toBeGreaterThan(0);

    const iteration = Date.now();
    const courseResponse = await request.post(createCourseUrl, {
      headers,
      data: {
        title: `Course-${iteration}`,
        description: 'Course created before adding content',
        category: categories[0].name || categories[0].code || categories[0].id,
        skillIds: [skills[0].id],
        instructors: [{
          instructorId: managers[0].id,
          instructorName: managers[0].name || `${managers[0].firstName || ''} ${managers[0].lastName || ''}`.trim(),
        }],
      },
    });
    const courseBody = await courseResponse.text();
    expect([200, 201], courseBody).toContain(courseResponse.status());
    const courseJson = JSON.parse(courseBody);
    const course = courseJson.data || courseJson.course || courseJson;
    expect(course.id).toBeTruthy();

    const lessonResponse = await request.post(addLessonUrl, {
      headers,
      data: {
        courseId: course.id,
        title: `Lesson-${iteration}`,
        description: 'Lesson created before adding content',
        orderIndex: 0,
      },
    });
    const lessonBody = await lessonResponse.text();
    expect([200, 201], lessonBody).toContain(lessonResponse.status());
    const lessonJson = JSON.parse(lessonBody);
    const lesson = lessonJson.data || lessonJson.lesson || lessonJson;
    expect(lesson.id).toBeTruthy();

    const contentPayload = {
      courseId: course.id,
      lessonId: lesson.id,
      title: `Content-${iteration}`,
      contentType: 'TEXT',
    };
    const contentResponse = await request.post(addContentUrl, {
      headers,
      data: contentPayload,
    });
    const contentBody = await contentResponse.text();

    console.log('CONTENT POST payload:', contentPayload);
    console.log('CONTENT POST status:', contentResponse.status());
    console.log('CONTENT POST response:', contentBody);
    expect([200, 201], contentBody).toContain(contentResponse.status());
  });

  test('adds PDF content to a lesson', async ({ request }) => {
    expect(fs.existsSync(pdfPath), `PDF file was not found: ${pdfPath}`).toBeTruthy();
    const headers = { Authorization: `Bearer ${apiToken}`, Accept: 'application/json' };
    const iteration = Date.now();
    const { course, lesson } = await createCourseAndLesson(request, headers, iteration);
    const response = await request.post(uploadContentUrl, {
      headers,
      multipart: {
        courseId: course.id,
        lessonId: lesson.id,
        title: `PDF-${iteration}`,
        contentType: 'DOCUMENT',
        fileName: 'javascript_tutorial 2.pdf',
        mimeType: 'application/pdf',
        description: 'Workplace mental health lesson PDF',
        orderIndex: '0',
        durationMinutes: '0',
        isMandatory: 'true',
        file: { name: 'javascript_tutorial 2.pdf', mimeType: 'application/pdf', buffer: fs.readFileSync(pdfPath) },
      },
    });
    const body = await response.text();
    console.log('PDF CONTENT POST status:', response.status());
    console.log('PDF CONTENT POST response:', body);
    expect([200, 201], body).toContain(response.status());
  });

  test('adds video content to a lesson', async ({ request }) => {
    expect(fs.existsSync(videoPath), `Video file was not found: ${videoPath}`).toBeTruthy();
    const headers = { Authorization: `Bearer ${apiToken}`, Accept: 'application/json' };
    const iteration = Date.now();
    const { course, lesson } = await createCourseAndLesson(request, headers, iteration);
    const response = await request.post(uploadContentUrl, {
      headers,
      multipart: {
        courseId: course.id,
        lessonId: lesson.id,
        title: `Video-${iteration}`,
        contentType: 'VIDEO',
        fileName: 'SLAW - How to create a mentally healthy workplace culture and reduce stigma.mp4',
        mimeType: 'video/mp4',
        description: 'Mentally healthy workplace culture video',
        orderIndex: '0',
        durationMinutes: '30',
        isMandatory: 'true',
        file: { name: 'SLAW - How to create a mentally healthy workplace culture and reduce stigma.mp4', mimeType: 'video/mp4', buffer: fs.readFileSync(videoPath) },
      },
    });
    const body = await response.text();
    console.log('VIDEO CONTENT POST status:', response.status());
    console.log('VIDEO CONTENT POST response:', body);
    expect([200, 201], body).toContain(response.status());
  });
});