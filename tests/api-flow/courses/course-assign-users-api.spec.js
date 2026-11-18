const { test, expect } = require('@playwright/test');

const courseId = '6a9e634baec8e66bfa61419d';
const employeesUrl =
  'https://dev-lms360-backend.aixhub.ai/api/v1/users?page=1&limit=2999&roleCode=EMPLOYEE';
const assignUsersUrl =
  'https://dev-lms360-backend.aixhub.ai/api/v1/user-progress/assign-courses';
const apiToken = (process.env.API_TOKEN || '').replace(/^Bearer\s+/i, '').trim();

test.describe('LMS course assign users flow @api @positive @courses', () => {
  test.skip(!apiToken || apiToken === 'your-token', 'Set API_TOKEN in .env before running the course API flow');

  test('gets employees and assigns the first three to the course', async ({ request }) => {
    const headers = {
      Authorization: `Bearer ${apiToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const employeesResponse = await request.get(employeesUrl, { headers, timeout: 60000 });
    const employeesBody = await employeesResponse.text();
    expect(employeesResponse.status(), employeesBody).toBe(200);
    const employeesJson = JSON.parse(employeesBody);
    const employees = Array.isArray(employeesJson)
      ? employeesJson
      : employeesJson.data || employeesJson.users || [];
    expect(employees.length).toBeGreaterThanOrEqual(3);
    const userIds = employees.slice(0, 3).map(employee => employee.id);
    expect(userIds.every(Boolean)).toBeTruthy();

    const assignments = await Promise.all(userIds.map(async userId => {
      const payload = {
        userId,
        courseIds: [courseId],
      };
      const response = await request.post(assignUsersUrl, {
        headers,
        data: payload,
      });
      const body = await response.text();
      console.log('COURSE ASSIGN user payload:', payload);
      console.log('COURSE ASSIGN user status:', response.status());
      console.log('COURSE ASSIGN user response:', body);
      return { response, body };
    }));

    for (const assignment of assignments) {
      expect([200, 201], assignment.body).toContain(assignment.response.status());
    }
  });
});