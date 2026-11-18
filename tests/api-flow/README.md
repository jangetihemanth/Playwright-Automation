# LMS API Flow

Positive API flow tests live here. They use the configured tenant and API token environment variables.

Run the complete positive API flow:

```powershell
npx playwright test tests/api-flow
```

Required environment variables:

```powershell
$env:USERS_API_TOKEN = "your-token"
$env:SKILL_CATEGORIES_API_TOKEN = "your-token"
```

Add future module flows as separate files under this folder:

```text
tests/api-flow/
  login/
  users/
  skills/
  courses/
  learning-paths/
  branches/
  participants/
```
