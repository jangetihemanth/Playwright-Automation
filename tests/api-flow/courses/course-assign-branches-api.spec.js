const { test, expect } = require('@playwright/test');

const courseId = '6a9e634baec8e66bfa61419d';
const branchesUrl =
  'https://dev-lms360-backend.aixhub.ai/api/v1/branches?page=1&limit=20';
const assignBranchesUrl =
  `https://dev-lms360-backend.aixhub.ai/api/v1/courses/${courseId}/assign-branch`;
const apiToken = (process.env.API_TOKEN || '').replace(/^Bearer\s+/i, '').trim();

test.describe('LMS course assign branches flow @api @positive @courses', () => {
  test.skip(!apiToken || apiToken === 'your-token', 'Set API_TOKEN in .env before running the course API flow');

  test('gets branches and assigns the first two to the course', async ({ request }) => {
    const headers = {
      Authorization: `Bearer ${apiToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const branchesResponse = await request.get(branchesUrl, { headers });
    const branchesBody = await branchesResponse.text();
    expect(branchesResponse.status(), branchesBody).toBe(200);

    const branchesJson = JSON.parse(branchesBody);
    const branches = Array.isArray(branchesJson)
      ? branchesJson
      : branchesJson.data?.branches || branchesJson.data || branchesJson.branches || [];
    expect(Array.isArray(branches), 'Branches response should contain an array').toBeTruthy();
    expect(branches.length).toBeGreaterThanOrEqual(2);

    const branchIds = branches.slice(0, 2).map(branch => branch.id);
    expect(branchIds.every(Boolean)).toBeTruthy();
    const payload = { branchIds };
    const assignResponse = await request.post(assignBranchesUrl, {
      headers,
      data: payload,
    });
    const assignBody = await assignResponse.text();

    console.log('COURSE ASSIGN BRANCHES payload:', payload);
    console.log('COURSE ASSIGN BRANCHES status:', assignResponse.status());
    console.log('COURSE ASSIGN BRANCHES response:', assignBody);
    expect([200, 201], assignBody).toContain(assignResponse.status());
  });
});