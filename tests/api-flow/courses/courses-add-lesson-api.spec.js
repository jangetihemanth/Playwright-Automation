const { test, expect } = require('@playwright/test');

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
const apiToken = (process.env.API_TOKEN || '').replace(/^Bearer\s+/i, '').trim();

test.describe('LMS add lesson API flow @api @positive @courses', () => {
  test.skip(!apiToken || apiToken === 'your-token', 'Set API_TOKEN in .env before running the courses API flow');

  test('creates a course, then adds a lesson with POST', async ({ request }) => {
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
    const coursePayload = {
      title: `Course-${iteration}`,
      description: 'Course created before adding a lesson',
      category: categories[0].name || categories[0].code || categories[0].id,
      skillIds: [skills[0].id],
      instructors: [{
        instructorId: managers[0].id,
        instructorName: managers[0].name || `${managers[0].firstName || ''} ${managers[0].lastName || ''}`.trim(),
      }],
    };
    const courseResponse = await request.post(createCourseUrl, { headers, data: coursePayload });
    const courseBody = await courseResponse.text();
    expect([200, 201], courseBody).toContain(courseResponse.status());
    const courseJson = JSON.parse(courseBody);
    const course = courseJson.data || courseJson.course || courseJson;
    expect(course.id).toBeTruthy();

    const lessonPayload = {
      courseId: course.id,
      title: `Lesson-${iteration}`,
      description: 'Lesson created through course wizard step 2',
      orderIndex: 0,
    };
    const lessonResponse = await request.post(addLessonUrl, {
      headers,
      data: lessonPayload,
    });
    const lessonBody = await lessonResponse.text();

    console.log('LESSON POST payload:', lessonPayload);
    console.log('LESSON POST status:', lessonResponse.status());
    console.log('LESSON POST response:', lessonBody);
    expect([200, 201], lessonBody).toContain(lessonResponse.status());
  });
});