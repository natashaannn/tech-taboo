// Helper functions for E2E tests
import type { Page } from "@playwright/test";

/**
 * Selects an option from a Radix UI Select component
 * @param page - Playwright page instance
 * @param triggerTestId - Test ID of the trigger button
 * @param optionText - Text of the option to select
 */
export async function selectRadixOption(
  page: Page,
  triggerTestId: string,
  optionText: string,
) {
  // Click the trigger to open the dropdown
  await page.click(`[data-testid="${triggerTestId}"]`);

  // Wait for dropdown content to appear
  await page.waitForSelector('[role="option"]');

  // Click the option by text
  await page.click(`[role="option"]:has-text("${optionText}")`);

  // Wait for dropdown to close
  await page.waitForSelector('[role="option"]', { state: "hidden" });
}

/**
 * Selects an option from a Radix UI DropdownMenu component
 * @param page - Playwright page instance
 * @param triggerTestId - Test ID of the trigger button
 * @param optionText - Text of the option to select
 */
export async function selectDropdownMenuOption(
  page: Page,
  triggerTestId: string,
  optionText: string,
) {
  // Click the trigger to open the dropdown
  await page.click(`[data-testid="${triggerTestId}"]`);

  // Wait for dropdown content to appear
  await page.waitForSelector('[role="menuitem"]');

  // Click the option by text
  await page.click(`[role="menuitem"]:has-text("${optionText}")`);

  // Wait for dropdown to close
  await page.waitForSelector('[role="menuitem"]', { state: "hidden" });
}

/**
 * Waits for SVG content to be rendered
 * @param page - Playwright page instance
 * @param testId - Test ID of the SVG container
 */
export async function waitForSVG(page: Page, testId: string) {
  await page.waitForSelector(`[data-testid="${testId}"] svg`, {
    timeout: 10000,
  });
}
