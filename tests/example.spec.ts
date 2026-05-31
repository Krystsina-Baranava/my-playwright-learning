import { test, expect } from '@playwright/test';   
  // 1. import tools from playwright

test('has title', async ({ page }) => {
   await page.goto('https://playwright.dev/');       
  // 2. Created a test called "has title". 
  // Get page (browser tab) from Playwright.
  // Open the Playwright website. Wait until it loads.

  await expect(page).toHaveTitle(/Playwright/);    
});
 //Expect that the page title contains the word "Playwright".

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');
   // Created a test called "get started link".
   // Open the same website again.
 
  await page.getByRole('link', { name: 'Get started' }).click();
   // Find a link with text "Get started" → click it.

  // Expects page to have a heading with the name of "Installation".
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

// "devDependencies": { "@playwright/test": "^1.59.1",  "@types/node": "^25.6.0"
// It means that my project depends on 2 librariеs. Without them, tests won't run.