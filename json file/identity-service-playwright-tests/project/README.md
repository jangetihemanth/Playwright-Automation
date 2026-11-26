# Identity & Access Service — Playwright API Tests

Auto-generated Playwright test suite covering all **76 endpoints** across **11 resources**
from the AiXHub Identity & Access Service OpenAPI spec.

| Resource              | File                              | Tests |
|------------------------|------------------------------------|-------|
| Users                  | `tests/users.spec.ts`              | 18    |
| Tenants                 | `tests/tenants.spec.ts`             | 15    |
| Applications            | `tests/applications.spec.ts`        | 10    |
| Auth                    | `tests/auth.spec.ts`                | 8     |
| Tenant Roles            | `tests/tenant-roles.spec.ts`        | 7     |
| Teams                   | `tests/teams.spec.ts`               | 6     |
| Tenant Role Policies    | `tests/tenant-role-policies.spec.ts`| 4     |
| Departments             | `tests/departments.spec.ts`         | 3     |
| Regions                 | `tests/regions.spec.ts`             | 3     |
| Blob                    | `tests/blob.spec.ts`                | 1     |
| Public                  | `tests/public.spec.ts`              | 1     |

## Setup

```bash
npm install
npx playwright install   # only needed once, installs browser binaries used by the reporter
cp .env.example .env
```

Edit `.env` with a real base URL and test-account credentials.

## Running

```bash
npx playwright test                     # run everything
npx playwright test tests/users.spec.ts # run one resource
npx playwright test --ui                # interactive UI mode
npx playwright show-report              # view the HTML report after a run
```

## How auth works

Endpoints that require a bearer token use the `authRequest` fixture
(`fixtures/api.fixture.ts`) instead of Playwright's built-in `request` fixture.
On first use it calls `POST /auth/login` with the credentials from `.env`,
pulls the access token out of the response, and hands back an
`APIRequestContext` with `Authorization: Bearer <token>` already attached.

**The OpenAPI spec didn't document the exact shape of the login response**, so the
fixture tries `accessToken`, `token`, `data.accessToken`, and `data.token`. If your
API nests the token somewhere else, update the lookup at the top of
`fixtures/api.fixture.ts` — it throws a clear error telling you the actual response
shape when the token isn't found.

## What was generated vs. what needs your review

This suite was generated mechanically from the spec, so it's a strong starting
point, not a finished suite. Before relying on it:

- **Request bodies** are built from each schema's field types/formats/examples
  (e.g. `email` fields get `user@example.com`, `password` fields get a fake
  password). Swap in realistic values for your environment.
- **Path parameters** (`{appId}`, `{tenantId}`, etc.) are filled with obvious
  placeholders (`00000000-0000-0000-0000-000000000000` for id-like fields).
  Each is marked with a `// TODO: replace with a real <param>` comment —
  replace these with IDs that actually exist in your test environment, or wire
  up setup steps that create the resource first.
- **Expected status codes** default to the first `2xx` response documented for
  that operation (usually `200`). Update assertions for operations you want to
  test more thoroughly (validation errors, 404s, permission checks, etc.).
- **Response body assertions** were intentionally left out — the spec's
  response schemas are inconsistent, so add `expect(body).toMatchObject(...)`
  checks once you've confirmed the real response shape per endpoint.

## Project structure

```
.
├── fixtures/
│   └── api.fixture.ts     # authRequest fixture (logs in once, attaches bearer token)
├── tests/
│   ├── auth.spec.ts
│   ├── applications.spec.ts
│   ├── tenants.spec.ts
│   ├── tenant-roles.spec.ts
│   ├── tenant-role-policies.spec.ts
│   ├── users.spec.ts
│   ├── departments.spec.ts
│   ├── regions.spec.ts
│   ├── teams.spec.ts
│   ├── blob.spec.ts
│   └── public.spec.ts
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── .env.example
```
