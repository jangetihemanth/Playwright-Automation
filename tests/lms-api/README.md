# LMS API Testing

API tests are grouped by LMS domain so each area can be run independently.

## Folders

- `login/` - authentication and login APIs
- `skills/` - skills and skill-category APIs
- `courses/` - course APIs
- `users/` - user APIs

Run one domain from the repository root:

```powershell
npx playwright test tests/lms-api/login
npx playwright test tests/lms-api/skills
npx playwright test tests/lms-api/courses
npx playwright test tests/lms-api/users
```

Add new API specs inside the matching domain folder. Keep authentication values in environment variables and never commit tokens.