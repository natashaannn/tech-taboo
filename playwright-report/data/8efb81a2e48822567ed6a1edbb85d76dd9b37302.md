# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: export-quality.spec.ts >> Font and Asset Verification >> should embed techybara images in card samples
- Location: src/e2e/export-quality.spec.ts:184:3

# Error details

```
Error: page.click: Test ended.
Call log:
  - waiting for locator('[data-testid="category-select"]')

```

# Test source

```ts
  1  | // Helper functions for E2E tests
  2  | import type { Page } from '@playwright/test';
  3  |
  4  | /**
  5  |  * Selects an option from a Radix UI Select component
  6  |  * @param page - Playwright page instance
  7  |  * @param triggerTestId - Test ID of the trigger button
  8  |  * @param optionText - Text of the option to select
  9  |  */
  10 | export async function selectRadixOption(page: Page, triggerTestId: string, optionText: string) {
  11 |   // Click the trigger to open the dropdown
> 12 |   await page.click(`[data-testid="${triggerTestId}"]`);
     |              ^ Error: page.click: Test ended.
  13 |
  14 |   // Wait for dropdown content to appear
  15 |   await page.waitForSelector('[role="option"]');
  16 |
  17 |   // Click the option by text
  18 |   await page.click(`[role="option"]:has-text("${optionText}")`);
  19 |
  20 |   // Wait for dropdown to close
  21 |   await page.waitForSelector('[role="option"]', { state: 'hidden' });
  22 | }
  23 |
  24 | /**
  25 |  * Selects an option from a Radix UI DropdownMenu component
  26 |  * @param page - Playwright page instance
  27 |  * @param triggerTestId - Test ID of the trigger button
  28 |  * @param optionText - Text of the option to select
  29 |  */
  30 | export async function selectDropdownMenuOption(page: Page, triggerTestId: string, optionText: string) {
  31 |   // Click the trigger to open the dropdown
  32 |   await page.click(`[data-testid="${triggerTestId}"]`);
  33 |
  34 |   // Wait for dropdown content to appear
  35 |   await page.waitForSelector('[role="menuitem"]');
  36 |
  37 |   // Click the option by text
  38 |   await page.click(`[role="menuitem"]:has-text("${optionText}")`);
  39 |
  40 |   // Wait for dropdown to close
  41 |   await page.waitForSelector('[role="menuitem"]', { state: 'hidden' });
  42 | }
  43 |
  44 | /**
  45 |  * Waits for SVG content to be rendered
  46 |  * @param page - Playwright page instance
  47 |  * @param testId - Test ID of the SVG container
  48 |  */
  49 | export async function waitForSVG(page: Page, testId: string) {
  50 |   await page.waitForSelector(`[data-testid="${testId}"] svg`, { timeout: 10000 });
  51 | }
  52 |
```
