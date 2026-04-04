# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: export-quality.spec.ts >> Export Quality Verification >> should maintain consistency across exports
- Location: src/e2e/export-quality.spec.ts:123:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-testid="category-select"]')

```

# Page snapshot

```yaml
- generic [ref=e3]:
    - banner [ref=e4]:
        - generic [ref=e5]:
            - link "Techie Taboo Techie Taboo" [ref=e7] [cursor=pointer]:
                - /url: /
                - generic "Techie Taboo" [ref=e8]: Your browser does not support SVG
                - generic [ref=e9]: Techie Taboo
            - navigation "Main" [ref=e10]:
                - list [ref=e12]:
                    - listitem [ref=e13]:
                        - link "Card Generator" [ref=e14] [cursor=pointer]:
                            - /url: /
                    - listitem [ref=e15]:
                        - link "Manufacturer" [ref=e16] [cursor=pointer]:
                            - /url: /manufacturer
                    - listitem [ref=e17]:
                        - link "Packaging" [ref=e18] [cursor=pointer]:
                            - /url: /packaging
            - button "Contact" [ref=e20] [cursor=pointer]
    - main [ref=e21]:
        - generic [ref=e22]:
            - generic [ref=e23]:
                - heading "Packaging Lid Renderer" [level=1] [ref=e24]
                - paragraph [ref=e25]: "Rigid box full-lid layout with 5 sides: lid top 66x95mm, long side 95x29.4mm x2, short side 66x29.4mm x2."
            - generic [ref=e26]:
                - generic [ref=e28]:
                    - generic [ref=e29]:
                        - generic [ref=e30]: Packaging Preview
                        - generic [ref=e31]: Preview of your packaging design (1:1 scale)
                    - generic [ref=e32]:
                        - button "Export as SVG" [ref=e33] [cursor=pointer]
                        - button "Export as PNG (Print Quality)" [ref=e34] [cursor=pointer]
                - img [ref=e38]:
                    - generic [ref=e45]: Great for parties and events!
                    - generic [ref=e48]: 2+ players
                    - generic [ref=e49]:
                        - generic [ref=e50]: TECHIE
                        - generic [ref=e51]: TABOO
                    - generic [ref=e52]:
                        - generic [ref=e53]: A CARD GAME FOR A BROAD MIX OF
                        - generic [ref=e54]: CORE TECH, AI, ENGINEERING,
                        - generic [ref=e55]: AND PRODUCT TOPICS.
                    - generic [ref=e57]: Variety Pack
                    - generic [ref=e63]:
                        - generic [ref=e65]: TECHIE
                        - generic [ref=e66]: TABOO
                        - generic [ref=e69]: Variety Pack
                    - generic [ref=e70]:
                        - generic [ref=e72]: TECHIE
                        - generic [ref=e73]: TABOO
                        - generic [ref=e76]: Variety Pack
                    - generic [ref=e81]:
                        - generic [ref=e82]: VARIETY
                        - generic [ref=e83]: PACK
                        - generic [ref=e84]:
                            - generic [ref=e86]: A card game for a broad mix of core
                            - generic [ref=e87]: tech, AI, engineering, and product
                            - generic [ref=e88]: topics.
                    - generic [ref=e89]:
                        - generic [ref=e90]: VARIETY
                        - generic [ref=e91]: PACK
                        - generic [ref=e92]:
                            - generic [ref=e94]: A card game for a broad mix of core
                            - generic [ref=e95]: tech, AI, engineering, and product
                            - generic [ref=e96]: topics.
            - generic [ref=e97]:
                - generic [ref=e98]:
                    - generic [ref=e99]: Packaging Options
                    - generic [ref=e100]: Configure your packaging design settings
                - generic [ref=e101]:
                    - generic [ref=e102]:
                        - generic [ref=e103]:
                            - text: Category / Edition
                            - combobox [ref=e104] [cursor=pointer]:
                                - generic: Variety Pack
                                - img [ref=e105]
                        - generic [ref=e107]:
                            - text: Version
                            - textbox "Version" [ref=e108]:
                                - /placeholder: Enter version
                                - text: v1.0
                        - generic [ref=e109]:
                            - text: Description
                            - textbox "Description" [ref=e110]:
                                - /placeholder: Enter description
                                - text: A card game for a broad mix of core tech, AI, engineering, and product topics.
                        - generic [ref=e111]:
                            - text: Borders
                            - generic [ref=e112]:
                                - switch "Borders Include Panel Borders" [checked] [ref=e113] [cursor=pointer]
                                - generic [ref=e114]: Include Panel Borders
                    - generic [ref=e115]:
                        - button "Generate Packaging" [ref=e116] [cursor=pointer]
                        - button "Reset Category Description" [ref=e117] [cursor=pointer]
                        - button "Export PNG (No Borders)" [ref=e118] [cursor=pointer]
                        - button "Export Panels PNG ZIP" [ref=e119] [cursor=pointer]
            - generic [ref=e120]:
                - generic [ref=e122]: Edition Info
                - generic [ref=e123]:
                    - paragraph [ref=e124]: A card game for a broad mix of core tech, AI, engineering, and product topics.
                    - paragraph [ref=e125]:
                        - strong [ref=e126]: "Categories:"
                        - text: General, AI, Software Engineering, Product Management
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
     |              ^ Error: page.click: Test timeout of 30000ms exceeded.
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
