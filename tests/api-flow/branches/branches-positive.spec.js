const { test, expect } = require('@playwright/test');

const managersUrl =
  'https://dev-lms360-backend.aixhub.ai/api/v1/users?page=1&limit=10&roleCode=MANAGER';
const learningPathsUrl =
  'https://dev-lms360-backend.aixhub.ai/api/v1/learning-paths?page=1&limit=10';
const branchesUrl =
  'https://dev-lms360-backend.aixhub.ai/api/v1/branches';
const apiToken = (process.env.API_TOKEN || '')
  .replace(/^Bearer\s+/i, '')
  .trim();

test.describe(
  'LMS branches API positive flow @api @positive @branches',
  () => {
    test.skip(
      !apiToken || apiToken === 'your-token',
      'Set API_TOKEN in .env before running the branches API flow',
    );

    test('creates a branch with POST', async ({ request }) => {
    const response = await request.get(managersUrl, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: 'application/json',
      },
    });

    const responseBody = await response.text();
    console.log('MANAGERS GET status:', response.status());
    console.log('MANAGERS GET response:', responseBody);

    expect(response.status(), responseBody).toBe(200);
    const body = JSON.parse(responseBody);
    const managers = Array.isArray(body) ? body : body.data || body.users;
    expect(Array.isArray(managers), 'Managers response should contain an array').toBeTruthy();
    expect(managers.length).toBeGreaterThan(0);

    const manager = managers[0];
    expect(manager.id).toBeTruthy();
    console.log('Selected manager ID:', manager.id);

    const learningPathsResponse = await request.get(learningPathsUrl, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: 'application/json',
      },
    });
    const learningPathsBody = await learningPathsResponse.text();
    console.log('LEARNING PATHS GET status:', learningPathsResponse.status());
    console.log('LEARNING PATHS GET response:', learningPathsBody);

    expect(learningPathsResponse.status(), learningPathsBody).toBe(200);
    const learningPathsJson = JSON.parse(learningPathsBody);
    const learningPaths = Array.isArray(learningPathsJson)
      ? learningPathsJson
      : learningPathsJson.data || learningPathsJson.learningPaths || [];
    expect(Array.isArray(learningPaths), 'Learning paths response should contain an array').toBeTruthy();
    expect(learningPaths.length).toBeGreaterThanOrEqual(2);
    const learningPathIds = learningPaths.slice(0, 2).map(learningPath => learningPath.id);
    expect(learningPathIds.every(Boolean)).toBeTruthy();
    console.log('Selected learning path IDs:', learningPathIds);

    const iteration = Date.now();
    const payload = {
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
    console.log('BRANCH POST payload:', payload);
    const branchResponse = await request.post(branchesUrl, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: payload,
    });
    const branchBody = await branchResponse.text();
    console.log('BRANCH POST status:', branchResponse.status());
    console.log('BRANCH POST response:', branchBody);

    expect([200, 201]).toContain(branchResponse.status());
    const createdBranch = JSON.parse(branchBody);
    expect(createdBranch).toEqual(expect.objectContaining(payload));

    });
  });
