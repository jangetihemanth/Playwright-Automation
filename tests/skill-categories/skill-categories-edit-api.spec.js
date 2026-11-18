const { test, expect } = require('@playwright/test');

const categoryUrl = 'https://dev-lms360-backend.aixhub.ai/api/v1/skill-categories/6a99bd3b685ad9a9aa07af00';
const categoryType = 'COURSE';
const apiToken = (process.env.SKILL_CATEGORIES_API_TOKEN || process.env.USERS_API_TOKEN || '')
  .replace(/^Bearer\s+/i, '')
  .trim();
let iteration = 0;

test.describe('edit skill category 6a99bd3b685ad9a9aa07af00 @skill-categories @api', () => {
  test.skip(!apiToken, 'Set SKILL_CATEGORIES_API_TOKEN or USERS_API_TOKEN before running this suite');

  function requestHeaders() {
    return {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    };
  }

  function validEditPayload() {
    const suffix = `${Date.now()}${iteration++}${Math.floor(Math.random() * 1000)}`;
    const letters = suffix.replace(/\d/g, digit => String.fromCharCode(65 + Number(digit)));
    return {
      name: `EditedCategory${letters}`,
      description: `EditedDescription${letters}`,
      type: categoryType,
    };
  }

  async function recordApiDetails(testInfo, payload, expected, response) {
    testInfo.annotations.push({
      type: 'api-details',
      description: JSON.stringify({
        request: payload,
        expected,
        actualStatus: response.status(),
        responseBody: await response.text(),
      }),
    });
  }

  test('updates the COURSE skill category @positive @p0', async ({ request }) => {
    const payload = validEditPayload();
    const response = await request.patch(categoryUrl, {
      headers: requestHeaders(),
      data: payload,
    });
    await recordApiDetails(test.info(), payload, '200 or 204', response);

    expect([200, 204], `Expected status 200 or 204, received ${response.status()}`).toContain(response.status());
  });

  const requiredFieldCases = [
    ['missing name', { name: undefined }],
    ['missing description', { description: undefined }],
    ['missing type', { type: undefined }],
    ['empty name', { name: '' }],
    ['empty description', { description: '' }],
    ['empty type', { type: '' }],
  ];

  for (const [name, changes] of requiredFieldCases) {
    test(`rejects ${name} @negative @required`, async ({ request }) => {
      const payload = { ...validEditPayload(), ...changes };
      const response = await request.patch(categoryUrl, {
        headers: requestHeaders(),
        data: payload,
      });
      await recordApiDetails(test.info(), payload, '400 or 422', response);
      expect([400, 422], `Expected status 400 or 422, received ${response.status()}`).toContain(response.status());
    });
  }

  const invalidValueCases = [
    ['name as a number', { name: 123 }],
    ['name as an object', { name: {} }],
    ['name with HTML', { name: '<script>alert(1)</script>' }],
    ['description as a number', { description: 123 }],
    ['description as an object', { description: {} }],
    ['description with HTML', { description: '<img src=x onerror=alert(1)>' }],
    ['type as a number', { type: 123 }],
    ['type as an object', { type: {} }],
    ['unsupported type', { type: 'UNKNOWN' }],
    ['lowercase type', { type: 'course' }],
    ['null name', { name: null }],
    ['null description', { description: null }],
    ['null type', { type: null }],
    ['unknown category ID', { __url: '00000000-0000-4000-8000-000000000000' }],
  ];

  for (const [name, changes] of invalidValueCases) {
    test(`rejects ${name} @negative @edge`, async ({ request }) => {
      const payload = { ...validEditPayload(), ...changes };
      const targetUrl = payload.__url ? categoryUrl.replace(/[^/]+$/, payload.__url) : categoryUrl;
      delete payload.__url;
      const response = await request.patch(targetUrl, {
        headers: requestHeaders(),
        data: payload,
      });
      await recordApiDetails(test.info(), payload, '400, 404, or 422', response);
      expect([400, 404, 409, 422], `Expected status 400, 404, 409, or 422, received ${response.status()}`).toContain(response.status());
    });
  }

  const boundaryValues = [
    ['name length 0', { name: '' }],
    ['name length 1', { name: 'A' }],
    ['name length 255', { name: 'A'.repeat(255) }],
    ['name length 256', { name: 'A'.repeat(256) }],
    ['description length 0', { description: '' }],
    ['description length 1', { description: 'A' }],
    ['description length 999', { description: 'A'.repeat(999) }],
    ['description length 1000', { description: 'A'.repeat(1000) }],
    ['description length 1001', { description: 'A'.repeat(1001) }],
    ['name leading whitespace', { name: ' Category' }],
    ['name trailing whitespace', { name: 'Category ' }],
    ['description whitespace', { description: ' ' }],
    ['type whitespace', { type: ' COURSE ' }],
    ['name unicode', { name: '技能类别' }],
    ['description newline', { description: 'Description\nwith newline' }],
  ];

  for (const [name, changes] of boundaryValues) {
    test(`handles ${name} @negative @boundary`, async ({ request }) => {
      const payload = { ...validEditPayload(), ...changes };
      const response = await request.patch(categoryUrl, {
        headers: requestHeaders(),
        data: payload,
      });
      await recordApiDetails(test.info(), payload, '400, 409, or 422', response);
      expect([400, 409, 422], `Expected status 400, 409, or 422, received ${response.status()}`).toContain(response.status());
    });
  }
});
