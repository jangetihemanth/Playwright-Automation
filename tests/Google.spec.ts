import { test, expect } from '@playwright/test';

test('verify the application title', async ({ page }) => {
  await page.goto('https://chatgpt.com');

  const url = await page.url();
  console.log('chat gpt url is: ' + url);

  const title = await page.title();
  console.log('chat gpt title is: ' + title);

  await expect(page).toHaveTitle(/ChatGPT|OpenAI/i);
});
