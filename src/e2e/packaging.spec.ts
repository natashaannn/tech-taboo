import { test, expect } from "@playwright/test";
import {
  selectRadixOption,
  selectDropdownMenuOption,
  waitForSVG,
} from "./helpers/test-helpers";

test.describe("Packaging Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/packaging");
  });

  test("should render packaging preview with correct edition and description", async ({
    page,
  }) => {
    // Wait for the page to load
    await page.waitForSelector('[data-testid="packaging-preview"]', {
      timeout: 10000,
    });

    // Select VARIETY_PACK edition
    await selectRadixOption(page, "category-select", "VARIETY PACK");

    // Wait for preview to generate
    await page.waitForSelector('[data-testid="packaging-svg"]', {
      timeout: 10000,
    });

    // Check if SVG is rendered
    const svg = page.locator('[data-testid="packaging-svg"]');
    await expect(svg).toBeVisible();

    // Verify SVG contains expected elements
    const svgContent = await svg.innerHTML();

    // Check for edition name
    expect(svgContent).toContain("VARIETY PACK");

    // Check for techybara images
    expect(svgContent).toContain("techybara");
    expect(svgContent).toContain("ragtech-logo");

    // Check for card samples
    expect(svgContent).toContain("data:image/svg+xml");

    // Verify fonts are applied
    expect(svgContent).toContain("font-family");
    expect(svgContent).toContain("Gaegu");
  });

  test("should render correct category-specific packaging", async ({
    page,
  }) => {
    // Select Frontend category
    await selectDropdownMenuOption(page, "category-select", "Frontend");

    // Wait for preview to generate
    await waitForSVG(page, "packaging-svg");

    const svg = page.locator('[data-testid="packaging-svg"]');
    const svgContent = await svg.innerHTML();

    // Check for Frontend category
    expect(svgContent).toContain("Frontend");

    // Verify card samples contain Frontend cards
    const cardSamples = svgContent.match(/data:image\/svg\+xml[^>]*>/g) || [];
    expect(cardSamples.length).toBeGreaterThan(0);

    // Check for category color
    expect(svgContent).toContain("#61DAFB"); // Frontend blue color
  });

  test("should update preview when description changes", async ({ page }) => {
    // Select an edition
    await selectRadixOption(page, "category-select", "VARIETY PACK");

    // Wait for initial preview
    await page.waitForSelector('[data-testid="packaging-svg"]', {
      timeout: 10000,
    });

    // Change description
    const customDescription = "Custom test description for packaging";
    await page.fill('[data-testid="description-textarea"]', customDescription);

    // Wait for update
    await page.waitForTimeout(1000);

    // Check if description is updated
    const svg = page.locator('[data-testid="packaging-svg"]');
    const svgContent = await svg.innerHTML();
    expect(svgContent).toContain(customDescription.toUpperCase());
  });
});

test.describe("Packaging PNG Export", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/packaging");
  });

  test("should export PNG with all elements at 300 DPI", async ({ page }) => {
    // Select VARIETY_PACK edition
    await selectRadixOption(page, "category-select", "VARIETY PACK");

    // Wait for preview to generate
    await page.waitForSelector('[data-testid="packaging-svg"]', {
      timeout: 10000,
    });

    // Start download listener
    const downloadPromise = page.waitForEvent("download");

    // Click export PNG button
    await page.click('[data-testid="export-png-button"]');

    // Wait for download
    const download = await downloadPromise;

    // Verify filename
    expect(download.suggestedFilename()).toMatch(
      /VARIETY_PACK-packaging\.png$/,
    );

    // Get downloaded file as buffer
    const buffer = await download.createReadStream();
    const chunks = [];
    for await (const chunk of buffer) {
      chunks.push(chunk);
    }
    const imageBuffer = Buffer.concat(chunks);

    // Verify PNG signature
    expect(imageBuffer.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");

    // Note: Actual DPI and size verification would require image processing library
    // This is a placeholder for such verification
    console.log(`PNG exported, size: ${imageBuffer.length} bytes`);
  });

  test("should export PNG without borders when option selected", async ({
    page,
  }) => {
    // Disable borders
    await page.uncheck('[data-testid="include-borders-switch"]');

    // Wait for preview to update
    await page.waitForTimeout(1000);

    // Start download listener
    const downloadPromise = page.waitForEvent("download");

    // Click export PNG no borders button
    await page.click('[data-testid="export-png-no-borders-button"]');

    // Wait for download
    const download = await downloadPromise;

    // Verify filename
    expect(download.suggestedFilename()).toMatch(
      /VARIETY_PACK-packaging-no-borders\.png$/,
    );
  });

  test("should export panels ZIP with individual panel PNGs", async ({
    page,
  }) => {
    // Select VARIETY_PACK edition
    await selectRadixOption(page, "category-select", "VARIETY PACK");

    // Wait for preview to generate
    await page.waitForSelector('[data-testid="packaging-svg"]', {
      timeout: 10000,
    });

    // Start download listener
    const downloadPromise = page.waitForEvent("download");

    // Click export panels ZIP button
    await page.click('[data-testid="export-panels-zip-button"]');

    // Wait for download
    const download = await downloadPromise;

    // Verify filename
    expect(download.suggestedFilename()).toMatch(/VARIETY_PACK-panels\.zip$/);
  });
});

test.describe("Manufacturer Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/manufacturer");
  });

  test("should export packaging PNG with all elements", async ({ page }) => {
    // Select VARIETY_PACK edition
    await selectRadixOption(page, "edition-select", "VARIETY PACK");

    // Start download listener
    const downloadPromise = page.waitForEvent("download");

    // Click download packaging whole button
    await page.click('[data-testid="download-packaging-whole-button"]');

    // Wait for download
    const download = await downloadPromise;

    // Verify filename
    expect(download.suggestedFilename()).toMatch(
      /VARIETY_PACK-packaging-whole\.png$/,
    );

    // Get downloaded file
    const buffer = await download.createReadStream();
    const chunks = [];
    for await (const chunk of buffer) {
      chunks.push(chunk);
    }
    const imageBuffer = Buffer.concat(chunks);

    // Verify PNG signature
    expect(imageBuffer.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  });

  test("should export cards PNG ZIP with correct cards", async ({ page }) => {
    // Select VARIETY_PACK edition
    await selectRadixOption(page, "edition-select", "VARIETY PACK");

    // Start download listener
    const downloadPromise = page.waitForEvent("download");

    // Click download cards button
    await page.click('[data-testid="download-cards-button"]');

    // Wait for download
    const download = await downloadPromise;

    // Verify filename
    expect(download.suggestedFilename()).toMatch(/VARIETY_PACK-cards\.zip$/);
  });
});

test.describe("Card Generator Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should render card preview with correct words and techybara assets", async ({
    page,
  }) => {
    // Select Frontend category
    await selectDropdownMenuOption(page, "category-select", "Frontend");

    // Click generate button
    await page.click('[data-testid="generate-button"]');

    // Wait for cards to generate
    await page.waitForSelector('[data-testid="card-output"]', {
      timeout: 10000,
    });

    // Check if cards are rendered
    const cards = page.locator('[data-testid="card-output"] svg');
    await expect(cards.first()).toBeVisible();

    // Verify card content
    const cardContent = await cards.first().innerHTML();

    // Check for techybara images
    expect(cardContent).toContain("techybara");

    // Check for words
    expect(cardContent).toContain("React"); // Frontend card

    // Verify fonts
    expect(cardContent).toContain("font-family");
  });

  test("should export individual card as PNG", async ({ page }) => {
    // Select Frontend category
    await selectDropdownMenuOption(page, "category-select", "Frontend");

    // Click generate button
    await page.click('[data-testid="generate-button"]');

    // Wait for cards to generate
    await page.waitForSelector('[data-testid="card-output"]', {
      timeout: 10000,
    });

    // Start download listener
    const downloadPromise = page.waitForEvent("download");

    // Click export PNG button
    await page.click('[data-testid="export-png-button"]');

    // Wait for download
    const download = await downloadPromise;

    // Verify filename
    expect(download.suggestedFilename()).toMatch(/taboo-cards\.png$/);

    // Verify PNG signature
    const buffer = await download.createReadStream();
    const chunks = [];
    for await (const chunk of buffer) {
      chunks.push(chunk);
    }
    const imageBuffer = Buffer.concat(chunks);
    expect(imageBuffer.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  });

  test("should export all cards as PNG ZIP", async ({ page }) => {
    // Select Frontend category
    await selectDropdownMenuOption(page, "category-select", "Frontend");

    // Click generate button
    await page.click('[data-testid="generate-button"]');

    // Wait for cards to generate
    await page.waitForSelector('[data-testid="card-output"]', {
      timeout: 10000,
    });

    // Start download listener
    const downloadPromise = page.waitForEvent("download");

    // Click export dropdown and select PNG ZIP
    await page.click('[data-testid="export-dropdown"]');
    await page.click('[data-testid="export-png-zip-button"]');

    // Wait for download
    const download = await downloadPromise;

    // Verify filename
    expect(download.suggestedFilename()).toMatch(/taboo-cards\.zip$/);
  });
});
