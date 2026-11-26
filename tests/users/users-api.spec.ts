import { test, expect } from '@playwright/test';

const usersUrl = 'https://dev-lms360-backend.aixhub.ai/api/v1/users';
const departmentId = 'a1fd3357-6ae9-45c3-8044-dd3fd8075dab';
const roleIds = {
  learner: '7f9bc699-6949-41cf-8df4-1ceb59707995',
  instructor: '2228574c-77be-4f51-bf7f-28515466f673',
};
const apiToken = (process.env.USERS_API_TOKEN || '').replace(/^Bearer\s+/i, '').trim();
let iteration = 0;

test.describe('create users for TNT_64201 @users @api', () => {
  test.skip(!apiToken, 'Set USERS_API_TOKEN before running this suite');

  function requestHeaders() {
    return {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    };
  }

  function createUserPayload(role) {
    const suffix = `${Date.now()}${iteration++}${Math.floor(Math.random() * 1000)}`;
    const nameSuffix = suffix.replace(/\d/g, digit => String.fromCharCode(65 + Number(digit)));
    return {
      firstName: `Test${role}${nameSuffix}`,
      lastName: `User${nameSuffix}`,
      email: `test.${role.toLowerCase()}.${suffix}@example.com`,
      phone: `+919${suffix.slice(-9)}`,
      employeeId: `EMP${role.slice(0, 3).toUpperCase()}${suffix}`,
      departmentId,
      roleId: roleIds[role],
    };
  }

  async function recordApiDetails(testInfo, payload, expected, response) {
    const responseBody = await response.text();
    testInfo.annotations.push({
      type: 'api-details',
      description: JSON.stringify({
        request: payload,
        expected,
        actualStatus: response.status(),
        responseBody,
      }),
    });
  }

  for (const role of ['learner', 'instructor']) {
    test(`creates one ${role} user in the shared department @positive`, async ({ request }) => {
      const payload = createUserPayload(role);
      test.info().annotations.push({ type: 'parameters', description: `roleId=${payload.roleId}; departmentId=${payload.departmentId}; employeeId=${payload.employeeId}; email=${payload.email}; expected=200 or 201` });
      const response = await request.post(usersUrl, {
        headers: requestHeaders(),
        data: payload,
      });
      await recordApiDetails(test.info(), payload, '200 or 201', response);

      expect([200, 201], `Expected status 200 or 201, received ${response.status()}`).toContain(response.status());
      expect(await response.json()).toEqual(expect.objectContaining({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone,
        employeeId: payload.employeeId,
        departmentId,
        roleId: roleIds[role],
      }));
    });
  }

  const requiredFieldCases: [string, Record<string, any>][] = [
    ['missing firstName', { firstName: undefined }],
    ['missing lastName', { lastName: undefined }],
    ['missing email', { email: undefined }],
    ['missing phone', { phone: undefined }],
    ['missing employeeId', { employeeId: undefined }],
    ['missing departmentId', { departmentId: undefined }],
    ['missing roleId', { roleId: undefined }],
    ['empty firstName', { firstName: '' }],
    ['empty lastName', { lastName: '' }],
    ['empty email', { email: '' }],
    ['empty phone', { phone: '' }],
    ['empty employeeId', { employeeId: '' }],
    ['empty departmentId', { departmentId: '' }],
    ['empty roleId', { roleId: '' }],
  ];

  for (const [name, changes] of requiredFieldCases) {
    test(`rejects ${name} @negative @required`, async ({ request }) => {
      const payload = { ...createUserPayload('learner'), ...changes };
      const response = await request.post(usersUrl, {
        headers: requestHeaders(),
        data: payload,
      });
      await recordApiDetails(test.info(), payload, '400 or 422', response);
      expect([400, 422], `Expected status 400 or 422, received ${response.status()}`).toContain(response.status());
    });
  }

  const invalidValueCases: [string, Record<string, any>][] = [
    ['firstName as a number', { firstName: 123 }],
    ['lastName as an object', { lastName: {} }],
    ['email without at sign', { email: 'invalid.example.com' }],
    ['email without domain', { email: 'invalid@' }],
    ['email with spaces', { email: 'invalid user@example.com' }],
    ['phone with letters', { phone: '+91ABC1234567' }],
    ['phone too short', { phone: '+9198765' }],
    ['phone too long', { phone: '+919876543210987' }],
    ['employeeId with punctuation', { employeeId: 'EMP-001!' }],
    ['employeeId with spaces', { employeeId: 'EMP 001' }],
    ['employeeId as an object', { employeeId: {} }],
    ['departmentId as text', { departmentId: 'not-a-uuid' }],
    ['departmentId as a number', { departmentId: 123 }],
    ['roleId as text', { roleId: 'not-a-uuid' }],
    ['roleId as a number', { roleId: 123 }],
    ['unsupported role ID', { roleId: '13491ce4-0f21-4d9a-8e19-ea0f06a59eac' }],
    ['unknown department ID', { departmentId: '00000000-0000-4000-8000-000000000000' }],
    ['script in firstName', { firstName: '<script>alert(1)</script>' }],
    ['SQL text in lastName', { lastName: "' OR 1=1 --" }],
    ['Unicode employeeId', { employeeId: '员工001' }],
  ];

  for (const [name, changes] of invalidValueCases) {
    test(`rejects ${name} @negative @edge`, async ({ request }) => {
      const payload = { ...createUserPayload('instructor'), ...changes };
      const response = await request.post(usersUrl, {
        headers: requestHeaders(),
        data: payload,
      });
      await recordApiDetails(test.info(), payload, '400, 409, or 422', response);
      expect([400, 409, 422], `Expected status 400, 409, or 422, received ${response.status()}`).toContain(response.status());
    });
  }

  const boundaryValues: [string, Record<string, any>][] = [
    ['firstName length 0', { firstName: '' }],
    ['firstName length 1', { firstName: 'A' }],
    ['firstName length 255', { firstName: 'A'.repeat(255) }],
    ['firstName length 256', { firstName: 'A'.repeat(256) }],
    ['lastName length 0', { lastName: '' }],
    ['lastName length 1', { lastName: 'B' }],
    ['lastName length 255', { lastName: 'B'.repeat(255) }],
    ['lastName length 256', { lastName: 'B'.repeat(256) }],
    ['employeeId length 1', { employeeId: 'E' }],
    ['employeeId length 2', { employeeId: 'E1' }],
    ['employeeId length 50', { employeeId: 'E'.repeat(50) }],
    ['employeeId length 51', { employeeId: 'E'.repeat(51) }],
    ['employeeId length 255', { employeeId: 'E'.repeat(255) }],
    ['employeeId length 256', { employeeId: 'E'.repeat(256) }],
    ['email local part boundary', { email: `${'a'.repeat(64)}@example.com` }],
    ['email local part over boundary', { email: `${'a'.repeat(65)}@example.com` }],
    ['phone 9 digits', { phone: '+91987654321' }],
    ['phone 10 digits', { phone: '+919876543210' }],
    ['phone 11 digits', { phone: '+9198765432109' }],
    ['departmentId all zeroes', { departmentId: '00000000-0000-0000-0000-000000000000' }],
    ['roleId all zeroes', { roleId: '00000000-0000-0000-0000-000000000000' }],
    ['firstName whitespace', { firstName: ' ' }],
    ['lastName whitespace', { lastName: ' ' }],
    ['employeeId whitespace', { employeeId: ' ' }],
    ['email whitespace', { email: ' ' }],
  ];

  for (const [name, changes] of boundaryValues) {
    test(`handles ${name} @negative @boundary`, async ({ request }) => {
      const payload = { ...createUserPayload('learner'), ...changes };
      const response = await request.post(usersUrl, {
        headers: requestHeaders(),
        data: payload,
      });
      await recordApiDetails(test.info(), payload, '400, 409, or 422', response);
      expect([400, 409, 422], `Expected status 400, 409, or 422, received ${response.status()}`).toContain(response.status());
    });
  }
});
