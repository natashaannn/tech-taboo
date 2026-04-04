# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: export-quality.spec.ts >> Export Quality Verification >> should export card PNG at correct dimensions
- Location: src/e2e/export-quality.spec.ts:43:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[role="menuitem"]:has-text("Frontend")')

```

# Page snapshot

```yaml
- generic:
    - generic:
        - generic:
            - banner:
                - generic:
                    - generic:
                        - link:
                            - /url: /
                            - generic: Your browser does not support SVG
                            - generic: Techie Taboo
                    - navigation:
                        - generic:
                            - list:
                                - listitem:
                                    - link:
                                        - /url: /
                                        - text: Card Generator
                                - listitem:
                                    - link:
                                        - /url: /manufacturer
                                        - text: Manufacturer
                                - listitem:
                                    - link:
                                        - /url: /packaging
                                        - text: Packaging
                    - generic:
                        - button: Contact
            - main:
                - generic:
                    - generic:
                        - heading [level=1]: Techie Taboo Card Generator
                        - paragraph: Generate custom taboo cards for tech learning and team building
                    - generic:
                        - generic:
                            - generic:
                                - generic:
                                    - generic:
                                        - img:
                                            - generic:
                                                - generic:
                                                    - generic: Artificial Intelligence
                                                    - generic: (AI)
                                                    - generic: Replace
                                                    - generic: Machine
                                                    - generic: Model
                                                    - generic: Language
                                                    - generic: Chatbot
                                                - generic:
                                                    - generic: Cloud Computing
                                                    - generic: Sky
                                                    - generic: Server
                                                    - generic: Network
                                                    - generic: Storage
                                                    - generic: Online
                                    - generic:
                                        - button: Export
                                        - generic:
                                            - button:
                                                - img
                                            - generic: 1 / 52
                                            - button:
                                                - img
                        - generic:
                            - generic:
                                - generic:
                                    - generic: Card Generation Options
                                    - generic: Configure your card generation settings
                                - generic:
                                    - generic:
                                        - generic:
                                            - text: Category
                                            - button [expanded]:
                                                - generic: General
                                                - img
                                        - button: Shuffle Cards
                            - generic:
                                - generic:
                                    - generic:
                                        - generic:
                                            - text: Custom Card
                                            - img
                                        - generic: Create a custom card by entering words and taboo words (comma-separated)
    - menu "General" [active] [ref=e1]:
        - menuitem "General" [ref=e2]
        - menuitem "AI" [ref=e3]
        - menuitem "Software Engineering" [ref=e4]
        - menuitem "Data" [ref=e5]
        - menuitem "Product Management" [ref=e6]
        - menuitem "DSA" [ref=e7]
        - menuitem "System Design" [ref=e8]
        - menuitem "Game Dev" [ref=e9]
        - menuitem "DevOps" [ref=e10]
        - menuitem "Cybersecurity" [ref=e11]
        - menuitem "UX Design" [ref=e12]
        - menuitem "Responsible Tech" [ref=e13]
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
  12 |   await page.click(`[data-testid="${triggerTestId}"]`);
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
> 38 |   await page.click(`[role="menuitem"]:has-text("${optionText}")`);
     |              ^ Error: page.click: Test timeout of 30000ms exceeded.
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
