PS C:\Playwright>PS C:\Playwright># LMS Workforce360 Login Tests

## Setup

```powershell
npm install
npx playwright install chromium
```

Set `LOGIN_TENANT`, `LOGIN_PHONE`, and `LOGIN_OTP` only in your local environment when running authenticated DEV tests. Never commit credentials, tokens, or storage state.

## Playwright commands

```powershell
npm test
npm run test:p0
npm run test:smoke
npm run test:p1
npm run test:security
npm run test:a11y
npm run test:responsive
npm run test:performance
npm run report
```

To watch each browser action with a 3-second human-style delay:

```powershell
$env:HUMAN_MODE='true'; npx playwright test tests/login --project=chromium --headed
```

The authenticated session test is reported as skipped until `LOGIN_OTP` is supplied because the currently supplied DEV credentials return `400 Invalid Credentials`.

## Load test

Requires k6 and explicit DEV-only values:

```powershell
$env:LOGIN_TENANT='TNT_64201'; $env:LOGIN_PHONE='9877878990'; $env:VUS='100'; k6 run tests/login/load-test.js
```

Use `VUS=500` or `VUS=1000` only with approval for the DEV environment.

## Users API test

The users API tests create one learner and one instructor in the configured tenant. They also cover unauthenticated requests, missing fields, malformed identifiers, unsupported employee ID characters, and employee, name, email, phone, and UUID boundary cases. The tenant-admin creation flow is intentionally excluded because it is not a business requirement.

Run them with an authorized DEV token. Because Playwright uses `testDir: './tests'`, provide the test path relative to that directory:

```powershell
$env:USERS_API_TOKEN='YOUR_REAL_TOKEN'
npx playwright test users/users-api.spec.js --project=chromium --reporter=line
```

For a clear Markdown pass/fail report with parameters and failure reasons:

```powershell
npx playwright test users/users-api.spec.js --project=chromium --reporter=line,./reporters/users-summary-reporter.js
```

Open `playwright-report/users-api-summary.md` after the run. Each row shows the result, test case, changed parameter, expected status, actual status, and failure reason.

The tests use the shared department `a1fd3357-6ae9-45c3-8044-dd3fd8075dab` and the supplied learner and instructor role IDs.

## Skill categories API test

The skill categories suite tests `POST /api/v1/skill-categories` for `type: COURSE`. It includes one positive create case plus required-field, negative, edge, and boundary cases.

Run it with the same token or a separate token variable:

```powershell
$env:SKILL_CATEGORIES_API_TOKEN=$env:USERS_API_TOKEN
npx playwright test skill-categories/skill-categories-api.spec.js --project=chromium --reporter=line,./reporters/skill-categories-summary-reporter.js
```

The HTML report is written to `playwright-report/index.html`; detailed results are written to `playwright-report/skill-categories-api-summary.md`.

### Edit skill category

Run the edit tests for category `6a99bd3b685ad9a9aa07af00`:

```powershell
npx playwright test skill-categories/skill-categories-edit-api.spec.js --project=chromium
```

The edit tests use `PATCH /api/v1/skill-categories/6a99bd3b685ad9a9aa07af00` and write details to `playwright-report/skill-categories-api-summary.md`.
