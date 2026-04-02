import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate between pages", async ({ page }) => {
    await page.goto("/");

    // Check initial page
    await expect(page).toHaveTitle(/Techie Taboo/);
    await expect(
      page.getByRole("link", { name: /card generator/i }),
    ).toBeVisible();

    // Navigate to manufacturer page
    await page.getByRole("link", { name: /manufacturer/i }).click();
    await expect(page).toHaveURL(/.*manufacturer/);
    await expect(
      page.getByRole("heading", { name: /manufacturer downloads/i }),
    ).toBeVisible();

    // Navigate back to home
    await page.getByRole("link", { name: /card generator/i }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("should have responsive navigation", async ({ page }) => {
    await page.goto("/");

    // Desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.getByText("Techie Taboo")).toBeVisible();

    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText("Techie Taboo")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /manufacturer/i }),
    ).toBeVisible();
  });
});
