# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: scripts\test-browser-influencer-flow.spec.ts >> influencer registration and redirect to Stripe
- Location: scripts\test-browser-influencer-flow.spec.ts:3:5

# Error details

```
Error: page.waitForURL: Target page, context or browser has been closed
=========================== logs ===========================
waiting for navigation to "**/connect.stripe.com/**" until "load"
============================================================
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('influencer registration and redirect to Stripe', async ({ browser }) => {
  4  |   const context = await browser.newContext({ ignoreHTTPSErrors: true });
  5  |   const page = await context.newPage();
  6  |   // Replace with the actual URL of the registration page
  7  |   const registrationUrl = 'https://websbaca.cz/partnerprogram';
  8  | 
  9  |   await page.goto(registrationUrl);
  10 |   await page.waitForLoadState('networkidle');
  11 | 
  12 |   // Fill out the registration form
  13 |   // The user stated the fields are "Jméno", "E-mail", "Sociální sítě"
  14 |   // I will assume the locators are based on the placeholder text or name attribute.
  15 |   // This may need to be adjusted based on the actual HTML structure.
  16 |   await page.getByPlaceholder('John Doe').fill('Test Influencer');
  17 |   await page.getByPlaceholder('john@example.com').fill(`test-${Date.now()}@example.com`);
  18 |   await page.getByPlaceholder('https://instagram.com/yourhandle or your YouTube channel link').fill('https://instagram.com/testinfluencer');
  19 | 
  20 |   // Click the submit button
  21 |   // This assumes the button has text "Registrovat" or similar.
  22 |   await page.locator('button[type="submit"]').click();
  23 | 
  24 |   // Wait for the navigation to Stripe Connect
  25 |   // The URL should contain 'connect.stripe.com'
> 26 |   await page.waitForURL('**/connect.stripe.com/**');
     |              ^ Error: page.waitForURL: Target page, context or browser has been closed
  27 | 
  28 |   // Assert that the page is on the Stripe domain
  29 |   expect(page.url()).toContain('connect.stripe.com');
  30 | });
  31 | 
```