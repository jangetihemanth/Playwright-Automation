const { test, expect } = require('@playwright/test');

const courseCategoriesUrl =
  'https://dev-lms360-backend.aixhub.ai/api/v1/skill-categories?page=1&limit=999&type=COURSE';
const skillsUrl =
  'https://dev-lms360-backend.aixhub.ai/api/v1/skills?page=1&limit=10';
const managersUrl =
  'https://dev-lms360-backend.aixhub.ai/api/v1/users?page=1&limit=10&roleCode=MANAGER';
const createCourseUrl =
  'https://dev-lms360-backend.aixhub.ai/api/v1/courses/wizard/step1/basic-info';
const apiToken = (process.env.API_TOKEN || '').replace(/^Bearer\s+/i, '').trim();

test.describe('LMS courses API create flow @api @positive @courses', () => {
  test.skip(!apiToken || apiToken === 'your-token', 'Set API_TOKEN in .env before running the courses API flow');

  test('gets course category, skill, and manager before creating a course', async ({ request }) => {
    const headers = {
      Authorization: `Bearer ${apiToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const categoryResponse = await request.get(courseCategoriesUrl, { headers });
    const categoryBody = await categoryResponse.text();
    expect(categoryResponse.status(), categoryBody).toBe(200);
    const categoryJson = JSON.parse(categoryBody);
    const categories = Array.isArray(categoryJson)
      ? categoryJson
      : categoryJson.data || categoryJson.categories || [];
    expect(categories.length).toBeGreaterThan(0);

    const skillsResponse = await request.get(skillsUrl, { headers });
    const skillsBody = await skillsResponse.text();
    expect(skillsResponse.status(), skillsBody).toBe(200);
    const skillsJson = JSON.parse(skillsBody);
    const skills = Array.isArray(skillsJson) ? skillsJson : skillsJson.data || skillsJson.skills || [];
    expect(skills.length).toBeGreaterThan(0);

    const managersResponse = await request.get(managersUrl, { headers });
    const managersBody = await managersResponse.text();
    expect(managersResponse.status(), managersBody).toBe(200);
    const managersJson = JSON.parse(managersBody);
    const managers = Array.isArray(managersJson) ? managersJson : managersJson.data || managersJson.users || [];
    expect(managers.length).toBeGreaterThan(0);

    const iteration = Date.now();
    const payload = {
      title: `Course-${iteration}`,
      description: 'Course created through the learning-path setup flow',
      category: categories[0].name || categories[0].code || categories[0].id,
      skillIds: [skills[0].id],
      instructors: [{
        instructorId: managers[0].id,
        instructorName: managers[0].name || `${managers[0].firstName || ''} ${managers[0].lastName || ''}`.trim(),
      }],
    };
    const response = await request.post(createCourseUrl, { headers, data: payload });
    const responseBody = await response.text();

    console.log('COURSE POST payload:', payload);
    console.log('COURSE POST status:', response.status());
    console.log('COURSE POST response:', responseBody);
    expect([200, 201], responseBody).toContain(response.status());
    expect(JSON.parse(responseBody)).toEqual(expect.objectContaining(payload));
  });
});