const { test, expect } = require('@playwright/test');

const skillCategoriesUrl = 'https://dev-lms360-backend.aixhub.ai/api/v1/skill-categories';
const categoryType = 'COURSE';
const apiToken = (process.env.SKILL_CATEGORIES_API_TOKEN || process.env.USERS_API_TOKEN || '')
  .replace(/^Bearer\s+/i, '')
  .trim();
let iteration = 0;

test.describe('skill category API for TNT_64201 @skill-categories @api', () => {
  test.skip(!apiToken, 'Set SKILL_CATEGORIES_API_TOKEN or USERS_API_TOKEN before running this suite');

  function requestHeaders() {
    return {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    };
  }

  function createCategoryPayload() {
    const suffix = `${Date.now()}${iteration++}${Math.floor(Math.random() * 1000)}`;
    const letters = suffix.replace(/\d/g, digit => String.fromCharCode(65 + Number(digit)));
    return {
      name: `SkillCategory${letters}`,
      description: `Description${letters}`,
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

  test('creates one COURSE skill category @positive @p0', async ({ request }) => {
    const payload = createCategoryPayload();
    const response = await request.post(skillCategoriesUrl, {
      headers: requestHeaders(),
      data: payload,
    });
    await recordApiDetails(test.info(), payload, '200 or 201', response);

    expect([200, 201], `Expected status 200 or 201, received ${response.status()}`).toContain(response.status());
    expect(await response.json()).toEqual(expect.objectContaining(payload));
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
      const payload = { ...createCategoryPayload(), ...changes };
      const response = await request.post(skillCategoriesUrl, {
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
    ['name with SQL text', { name: "' OR 1=1 --" }],
    ['name with only spaces', { name: '   ' }],
    ['description as a number', { description: 123 }],
    ['description as an object', { description: {} }],
    ['description with HTML', { description: '<img src=x onerror=alert(1)>' }],
    ['type as a number', { type: 123 }],
    ['type as an object', { type: {} }],
    ['unsupported type USER', { type: 'USER' }],
    ['unsupported type EMPTY', { type: 'UNKNOWN' }],
    ['lowercase course type', { type: 'course' }],
    ['whitespace course type', { type: ' COURSE ' }],
    ['null name', { name: null }],
    ['null description', { description: null }],
    ['null type', { type: null }],
    ['boolean name', { name: true }],
    ['boolean description', { description: false }],
    ['array name', { name: [] }],
  ];

  for (const [name, changes] of invalidValueCases) {
    test(`rejects ${name} @negative @edge`, async ({ request }) => {
      const payload = { ...createCategoryPayload(), ...changes };
      const response = await request.post(skillCategoriesUrl, {
        headers: requestHeaders(),
        data: payload,
      });
      await recordApiDetails(test.info(), payload, '400, 409, or 422', response);
      expect([400, 409, 422], `Expected status 400, 409, or 422, received ${response.status()}`).toContain(response.status());
    });
  }

  const boundaryValues = [
    ['name length 0', { name: '' }],
    ['name length 1', { name: 'A' }],
    ['name length 2', { name: 'AB' }],
    ['name length 255', { name: 'A'.repeat(255) }],
    ['name length 256', { name: 'A'.repeat(256) }],
    ['description length 0', { description: '' }],
    ['description length 1', { description: 'A' }],
    ['description length 2', { description: 'AB' }],
    ['description length 999', { description: 'A'.repeat(999) }],
    ['description length 1000', { description: 'A'.repeat(1000) }],
    ['description length 1001', { description: 'A'.repeat(1001) }],
    ['name leading whitespace', { name: ' Category' }],
    ['name trailing whitespace', { name: 'Category ' }],
    ['description whitespace', { description: ' ' }],
    ['type length 1', { type: 'C' }],
    ['type length 6', { type: 'COURSE' }],
    ['type length 7', { type: 'COURSES' }],
    ['name unicode', { name: '技能类别' }],
    ['description unicode', { description: '技能说明' }],
    ['name emoji', { name: 'Category🎓' }],
    ['description newline', { description: 'Description\nwith newline' }],
    ['name tab', { name: 'Category\tTab' }],
    ['extra field', { unexpectedField: 'unexpected' }],
    ['name array boundary', { name: ['Category'] }],
    ['description array boundary', { description: ['Description'] }],
  ];

  for (const [name, changes] of boundaryValues) {
    test(`handles ${name} @negative @boundary`, async ({ request }) => {
      const payload = { ...createCategoryPayload(), ...changes };
      const response = await request.post(skillCategoriesUrl, {
        headers: requestHeaders(),
        data: payload,
      });
      await recordApiDetails(test.info(), payload, '400, 409, or 422', response);
      expect([400, 409, 422], `Expected status 400, 409, or 422, received ${response.status()}`).toContain(response.status());
    });
  }
});
