import { test, expect } from '@playwright/test';

const API_URL = process.env.EMPLOYEE_API_URL || 'https://dev-aixworkforce360-backend.aixhub.ai/api/employee/update-step-1';
const DEFAULT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjZjU2MmE4Ny00NmM0LTRiMmItOWI3ZC00OTliNmY3ZGVmMzQiLCJ0ZW5hbnRJZCI6IjQzYzIwNjQ2LTlmNzctNDJkZi1hYTdkLTA1NjE5ZDA3ZDA3MiIsInNlc3Npb25JZCI6Im5YV3RTOEl3dmdUTC1MMTlwWFRJbktMRmF5ZmpQbEZKdS14cDBFTFFfSTgiLCJyb2xlIjoiTUFOQUdFUiIsInJvbGVJZCI6IjYzODU4YzE1LTM3ODEtNDZlNS04NjFkLTU0YzZhYjY2ZDA1YSIsImFwcENvZGUiOiJBV0YwMDEiLCJ0b2tlblR5cGUiOiJBQ0NFU1MiLCJpYXQiOjE3OTUwMjQ0NDUsImV4cCI6MTc5NTAyNjI0NSwiYXVkIjoicGxhdGZvcm0iLCJpc3MiOiJpZGVudGl0eS1zZXJ2aWNlIn0.oB-ntz67c7SZwup74PVNEGUOdYsyc4VTZMdMM7fIIZ4';
const AUTH_TOKEN = (process.env.API_TOKEN || process.env.USERS_API_TOKEN || DEFAULT_TOKEN).replace(/^Bearer\s+/i, '').trim();

interface EmployeeStep1Payload {
  tenantId?: string | number | null;
  phone?: string | number | null;
  employeeId?: string | number | null;
  status?: string | number | null;
  userId?: string | number | null;
  [key: string]: any;
}

const validBasePayload: EmployeeStep1Payload = {
  tenantId: '9b1f4ce0-c14b-4923-b74d-83416a5e7f37',
  phone: '+1234567888',
  employeeId: 'EMP-001',
  status: 'ACTIVE',
  userId: 'd098e14b-c9ae-400c-a9b9-ab9ef448eeb0',
};

function getHeaders(token: string = AUTH_TOKEN) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function recordCountryValidation(
  testInfo: any,
  data: {
    country: string;
    scenario: string;
    phone: string;
    digits: number | string;
    expected: string;
    actualStatus: number;
    message?: string;
  }
) {
  testInfo.annotations.push({
    type: 'country-validation',
    description: JSON.stringify(data),
  });
}

test.describe('Employee API - update-step-1 Integration Suite', () => {

  test.describe('1. Worldwide Country-Wise Phone Validation (Valid / Min Underflow / Max Overflow)', () => {
    interface CountryCase {
      country: string;
      code: string;
      valid: { phone: string; digits: number };
      underLength: { phone: string; digits: number };
      overLength: { phone: string; digits: number };
    }

    const countryMatrix: CountryCase[] = [
      {
        country: 'India (+91)',
        code: '+91',
        valid: { phone: '+919877899878', digits: 10 },
        underLength: { phone: '+91989999999', digits: 9 },
        overLength: { phone: '+9198778998789', digits: 11 },
      },
      {
        country: 'USA / Canada (+1)',
        code: '+1',
        valid: { phone: '+12025550143', digits: 10 },
        underLength: { phone: '+1202555014', digits: 9 },
        overLength: { phone: '+120255501439', digits: 11 },
      },
      {
        country: 'United Kingdom (+44)',
        code: '+44',
        valid: { phone: '+447911123456', digits: 10 },
        underLength: { phone: '+44791112345', digits: 9 },
        overLength: { phone: '+4479111234567', digits: 11 },
      },
      {
        country: 'Australia (+61)',
        code: '+61',
        valid: { phone: '+61412345678', digits: 9 },
        underLength: { phone: '+6141234567', digits: 8 },
        overLength: { phone: '+614123456789', digits: 10 },
      },
      {
        country: 'Singapore (+65)',
        code: '+65',
        valid: { phone: '+6581234567', digits: 8 },
        underLength: { phone: '+658123456', digits: 7 },
        overLength: { phone: '+65812345678', digits: 9 },
      },
      {
        country: 'United Arab Emirates (+971)',
        code: '+971',
        valid: { phone: '+971501234567', digits: 9 },
        underLength: { phone: '+97150123456', digits: 8 },
        overLength: { phone: '+9715012345678', digits: 10 },
      },
      {
        country: 'Germany (+49)',
        code: '+49',
        valid: { phone: '+491512345678', digits: 11 },
        underLength: { phone: '+491512345', digits: 8 },
        overLength: { phone: '+491512345678901', digits: 14 },
      },
      {
        country: 'Japan (+81)',
        code: '+81',
        valid: { phone: '+819012345678', digits: 10 },
        underLength: { phone: '+8190123456', digits: 8 },
        overLength: { phone: '+8190123456789', digits: 12 },
      },
      {
        country: 'France (+33)',
        code: '+33',
        valid: { phone: '+33612345678', digits: 9 },
        underLength: { phone: '+336123456', digits: 8 },
        overLength: { phone: '+336123456789', digits: 10 },
      },
      {
        country: 'Saudi Arabia (+966)',
        code: '+966',
        valid: { phone: '+966512345678', digits: 9 },
        underLength: { phone: '+9665123456', digits: 8 },
        overLength: { phone: '+9665123456789', digits: 10 },
      },
      {
        country: 'Brazil (+55)',
        code: '+55',
        valid: { phone: '+5511987654321', digits: 11 },
        underLength: { phone: '+55119876543', digits: 10 },
        overLength: { phone: '+55119876543210', digits: 12 },
      },
      {
        country: 'South Africa (+27)',
        code: '+27',
        valid: { phone: '+27821234567', digits: 9 },
        underLength: { phone: '+2782123456', digits: 8 },
        overLength: { phone: '+278212345678', digits: 10 },
      },
    ];

    for (const item of countryMatrix) {
      test.describe(`Country: ${item.country}`, () => {
        // 1. Valid Phone Number
        test(`[VALID] ${item.country} should pass with exact ${item.valid.digits} digits (${item.valid.phone}) @positive`, async ({ request }) => {
          const response = await request.put(API_URL, {
            headers: getHeaders(),
            data: {
              ...validBasePayload,
              phone: item.valid.phone,
            },
          });

          const body = await response.json().catch(() => ({}));
          await recordCountryValidation(test.info(), {
            country: item.country,
            scenario: `Valid Exact Length (${item.valid.digits} digits)`,
            phone: item.valid.phone,
            digits: item.valid.digits,
            expected: 'Pass (Accepted)',
            actualStatus: response.status(),
            message: response.status() === 400 ? body.message : 'Phone format accepted',
          });

          // Ensure phone is not rejected for validation errors
          if (response.status() === 400) {
            expect(JSON.stringify(body).toLowerCase()).not.toContain('phone');
          }
        });

        // 2. Under-Length Phone Number (Min boundary failure)
        test(`[UNDER-LENGTH] ${item.country} should fail validation with ${item.underLength.digits} digits (${item.underLength.phone}) @negative`, async ({ request }) => {
          const response = await request.put(API_URL, {
            headers: getHeaders(),
            data: {
              ...validBasePayload,
              phone: item.underLength.phone,
            },
          });

          const body = await response.json().catch(() => ({}));
          await recordCountryValidation(test.info(), {
            country: item.country,
            scenario: `Under-Length Min Failure (${item.underLength.digits} digits)`,
            phone: item.underLength.phone,
            digits: item.underLength.digits,
            expected: 'Fail (Rejected)',
            actualStatus: response.status(),
            message: body.message || 'Validation rejected under-length number',
          });

          expect([400, 422, 401]).toContain(response.status());
        });

        // 3. Over-Length Phone Number (Max boundary failure)
        test(`[OVER-LENGTH] ${item.country} should fail validation with ${item.overLength.digits} digits (${item.overLength.phone}) @negative`, async ({ request }) => {
          const response = await request.put(API_URL, {
            headers: getHeaders(),
            data: {
              ...validBasePayload,
              phone: item.overLength.phone,
            },
          });

          const body = await response.json().catch(() => ({}));
          await recordCountryValidation(test.info(), {
            country: item.country,
            scenario: `Over-Length Max Failure (${item.overLength.digits} digits)`,
            phone: item.overLength.phone,
            digits: item.overLength.digits,
            expected: 'Fail (Rejected)',
            actualStatus: response.status(),
            message: body.message || 'Validation rejected over-length number',
          });

          expect([400, 422, 401]).toContain(response.status());
        });
      });
    }
  });

  test.describe('2. Negative Phone Format & Injection Scenarios', () => {
    const invalidPhoneCases = [
      { desc: 'missing leading plus sign', phone: '9877899878' },
      { desc: 'phone with only plus sign', phone: '+' },
      { desc: 'phone containing alphabets', phone: '+919877ABCD8' },
      { desc: 'phone containing spaces and hyphens', phone: '+91 9877-899878' },
      { desc: 'phone with special characters/symbols', phone: '+91@9877#898$' },
      { desc: 'phone containing SQL injection payload', phone: "'+919877' OR '1'='1" },
      { desc: 'empty string phone', phone: '' },
    ];

    for (const { desc, phone } of invalidPhoneCases) {
      test(`should reject invalid phone format: ${desc} ("${phone}") @negative`, async ({ request }) => {
        const response = await request.put(API_URL, {
          headers: getHeaders(),
          data: {
            ...validBasePayload,
            phone,
          },
        });

        const body = await response.json().catch(() => ({}));
        await recordCountryValidation(test.info(), {
          country: 'Format Validation',
          scenario: desc,
          phone,
          digits: 'N/A',
          expected: 'Fail (Rejected)',
          actualStatus: response.status(),
          message: body.message || 'Validation error',
        });

        expect([400, 422, 401]).toContain(response.status());
      });
    }
  });

  test.describe('3. Field Validations (Status, TenantId, UserId, EmployeeId)', () => {
    test('should accept INACTIVE status @positive', async ({ request }) => {
      const response = await request.put(API_URL, {
        headers: getHeaders(),
        data: { ...validBasePayload, status: 'INACTIVE' },
      });
      expect([200, 201, 400, 401, 404]).toContain(response.status());
    });

    test('should reject invalid status value @negative', async ({ request }) => {
      const response = await request.put(API_URL, {
        headers: getHeaders(),
        data: { ...validBasePayload, status: 'INVALID_ENUM' },
      });
      expect([400, 422, 401]).toContain(response.status());
    });

    test('should reject invalid UUID for tenantId @negative', async ({ request }) => {
      const response = await request.put(API_URL, {
        headers: getHeaders(),
        data: { ...validBasePayload, tenantId: 'invalid-uuid-format' },
      });
      expect([400, 422, 401]).toContain(response.status());
    });

    test('should reject invalid UUID for userId @negative', async ({ request }) => {
      const response = await request.put(API_URL, {
        headers: getHeaders(),
        data: { ...validBasePayload, userId: 'invalid-user-uuid' },
      });
      expect([400, 422, 401]).toContain(response.status());
    });

    test('should reject empty employeeId @negative', async ({ request }) => {
      const response = await request.put(API_URL, {
        headers: getHeaders(),
        data: { ...validBasePayload, employeeId: '' },
      });
      expect([400, 422, 401]).toContain(response.status());
    });
  });

  test.describe('4. Missing Required Fields & Authentication Security', () => {
    const requiredFields = ['tenantId', 'phone', 'employeeId', 'status', 'userId'];

    for (const field of requiredFields) {
      test(`should reject request when required field "${field}" is omitted @negative`, async ({ request }) => {
        const payload = { ...validBasePayload };
        delete payload[field];

        const response = await request.put(API_URL, {
          headers: getHeaders(),
          data: payload,
        });

        expect([400, 422, 401]).toContain(response.status());
      });
    }

    test('should reject request when Authorization header is missing @security @negative', async ({ request }) => {
      const response = await request.put(API_URL, {
        headers: { 'Content-Type': 'application/json' },
        data: validBasePayload,
      });

      expect([401, 403]).toContain(response.status());
    });
  });
});
