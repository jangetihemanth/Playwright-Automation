import fs from 'fs';
import { test, expect } from '@playwright/test';

const courseId = '6a9e634baec8e66bfa61419d';
const certificateUploadUrl =
  'https://dev-lms360-backend.aixhub.ai/api/v1/certificates/template/upload';
const settingsUrl =
  `https://dev-lms360-backend.aixhub.ai/api/v1/courses/wizard/step4/settings/${courseId}`;
const certificatePath =
  'C:\\Users\\Hemanth kumar\\Downloads\\certificatee 1 (1).html';
const apiToken = (process.env.API_TOKEN || '').replace(/^Bearer\s+/i, '').trim();

test.describe('LMS course certificate and settings flow @api @positive @courses', () => {
  test.skip(!apiToken || apiToken === 'your-token', 'Set API_TOKEN in .env before running the course API flow');

  test('uploads certificate template, then updates course settings', async ({ request }) => {
    expect(fs.existsSync(certificatePath), `Certificate file was not found: ${certificatePath}`).toBeTruthy();
    const headers = {
      Authorization: `Bearer ${apiToken}`,
      Accept: 'application/json',
    };

    const uploadResponse = await request.post(certificateUploadUrl, {
      headers,
      multipart: {
        html: {
          name: 'certificatee 1 (1).html',
          mimeType: 'text/html',
          buffer: fs.readFileSync(certificatePath),
        },
      },
    });
    const uploadBody = await uploadResponse.text();
    console.log('CERTIFICATE UPLOAD status:', uploadResponse.status());
    console.log('CERTIFICATE UPLOAD response:', uploadBody);
    expect([200, 201], uploadBody).toContain(uploadResponse.status());

    const uploadJson = uploadBody ? JSON.parse(uploadBody) : {};
    const uploadData = uploadJson.data || uploadJson;
    const certificatePathValue = uploadData.blobPath;
    expect(certificatePathValue, 'Certificate upload response should contain blobPath').toBeTruthy();
    const today = new Date();
    const enrollmentDeadline = new Date(Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      23,
      59,
      59,
    )).toISOString();
    const settingsPayload = {
      isPublic: false,
      enrollmentDeadline,
      certificationEnabled: true,
      certificationStructureHtmlPath: certificatePathValue,
      expiryDays: 365,
      allowComments: true,
      allowDownload: false,
      requireSequentialCompletion: false,
      passingScore: 70,
      durationHours: 3,
      durationDays: 7,
      durationWeeks: 12,
      durationMonths: 3,
    };
    const settingsResponse = await request.put(settingsUrl, {
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      data: settingsPayload,
    });
    const settingsBody = await settingsResponse.text();
    console.log('COURSE SETTINGS PUT payload:', settingsPayload);
    console.log('COURSE SETTINGS PUT status:', settingsResponse.status());
    console.log('COURSE SETTINGS PUT response:', settingsBody);
    expect([200, 204], settingsBody).toContain(settingsResponse.status());
  });
});