const { test, expect } = require('@playwright/test');

const managersUrl = 'https://dev-lms360-backend.aixhub.ai/api/v1/users?page=1&limit=10&roleCode=MANAGER';
const branchesUrl = 'https://dev-lms360-backend.aixhub.ai/api/v1/branches';
const apiToken = (process.env.API_TOKEN || '').replace(/^Bearer\s+/i, '').trim();

test.describe('LMS branches API PUT flow @api @positive @branches', () => {
  test.skip(!apiToken || apiToken === 'your-token', 'Set API_TOKEN in .env before running the branches API flow');

  test('updates a branch with PUT', async ({ request }) => {
    const headers = {
      Authorization: `Bearer ${apiToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const managersResponse = await request.get(managersUrl, { headers });
    const managersBody = await managersResponse.text();
    expect(managersResponse.status(), managersBody).toBe(200);
    const managersJson = JSON.parse(managersBody);
    const managers = Array.isArray(managersJson) ? managersJson : managersJson.data || managersJson.users || [];
    expect(managers.length).toBeGreaterThan(0);

    const iteration = Date.now();
    const createPayload = {
      name: `Engineering-${iteration}`,
      description: 'Software development and technical teams',
      code: `ENG-${iteration}`,
      location: '123 Main Street, New York',
      branchManager: 'John Doe',
      learningPathIds: [
        '6a9c1ce2aec8e66bfa61411b',
        '6a9c1cc7aec8e66bfa614118',
      ],
    };
    const createResponse = await request.post(branchesUrl, { headers, data: createPayload });
    const createBody = await createResponse.text();
    expect([200, 201], createBody).toContain(createResponse.status());
    const createdBranch = JSON.parse(createBody);
    const branch = createdBranch.data || createdBranch.branch || createdBranch;
    expect(branch.id).toBeTruthy();

    const updateName = `branch B-${iteration}`;
    const updatePayload = { ...createPayload, name: updateName };
    const putResponse = await request.put(`${branchesUrl}/${branch.id}`, {
      headers,
      data: updatePayload,
    });
    const putBody = await putResponse.text();

    console.log('BRANCH PUT status:', putResponse.status());
    console.log('BRANCH PUT response:', putBody);
    expect([200, 204], putBody).toContain(putResponse.status());
    if (putBody) expect(JSON.parse(putBody)).toEqual(expect.objectContaining({ name: updateName }));
  });
});