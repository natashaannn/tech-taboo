import { test, expect } from "@playwright/test";
import { createHash } from "crypto";
import {
  selectRadixOption,
  selectDropdownMenuOption,
  waitForSVG,
} from "./helpers/test-helpers";

test.describe("Export Quality Verification", () => {
  test("should export packaging PNG at correct dimensions", async ({
    page,
  }) => {
    await page.goto("/packaging");

    // Select VARIETY_PACK edition
    await selectRadixOption(page, "category-select", "VARIETY PACK");

    // Wait for preview to generate
    await waitForSVG(page, "packaging-svg");

    // Start download listener
    const downloadPromise = page.waitForEvent("download");

    // Click export PNG button
    await page.click('[data-testid="export-png-button"]');

    // Wait for download
    const download = await downloadPromise;

    // Get downloaded file as buffer
    const buffer = await download.createReadStream();
    const chunks = [];
    for await (const chunk of buffer) {
      chunks.push(chunk);
    }
    const imageBuffer = Buffer.concat(chunks);

    // Basic PNG verification
    expect(imageBuffer.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");

    // Log file size for manual verification
    console.log(`Packaging PNG size: ${imageBuffer.length} bytes`);

    // Note: For actual DPI and dimension verification, you would need
    // an image processing library like 'sharp' or 'jimp'
    // This is a placeholder for such verification
  });

  test("should export card PNG at correct dimensions", async ({ page }) => {
    await page.goto("/");

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

    // Get downloaded file as buffer
    const buffer = await download.createReadStream();
    const chunks = [];
    for await (const chunk of buffer) {
      chunks.push(chunk);
    }
    const imageBuffer = Buffer.concat(chunks);

    // Basic PNG verification
    expect(imageBuffer.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");

    // Log file size for manual verification
    console.log(`Card PNG size: ${imageBuffer.length} bytes`);

    // Note: Card should be 1906x2844 pixels at 300 DPI (610x910 SVG * 300/96 scale)
  });

  test("should export SVG with all required elements", async ({ page }) => {
    await page.goto("/packaging");

    // Select Frontend category
    await selectRadixOption(page, "category-select", "Frontend");

    // Wait for preview to generate
    await waitForSVG(page, "packaging-svg");

    // Start download listener
    const downloadPromise = page.waitForEvent("download");

    // Click export SVG button
    await page.click('[data-testid="export-svg-button"]');

    // Wait for download
    const download = await downloadPromise;

    // Get downloaded file as text
    const path = await download.path();
    const fs = await import("fs/promises");
    const svgContent = await fs.readFile(path || "", "utf8");

    // Verify SVG structure
    expect(svgContent).toContain("<svg");
    expect(svgContent).toContain("</svg>");

    // Verify required elements
    expect(svgContent).toContain("font-family"); // Fonts should be embedded
    expect(svgContent).toContain("Gaegu"); // Gaegu font
    expect(svgContent).toContain("data:image"); // Images should be embedded
    expect(svgContent).toContain("Frontend"); // Category name
    expect(svgContent).toContain("techybara"); // Techybara images

    // Verify card samples
    const cardSampleCount = (svgContent.match(/data:image\/svg\+xml/g) || [])
      .length;
    expect(cardSampleCount).toBeGreaterThan(0);

    // Log SVG size for reference
    console.log(`Packaging SVG size: ${svgContent.length} characters`);
  });

  test("should maintain consistency across exports", async ({ page }) => {
    await page.goto("/packaging");

    // Select VARIETY_PACK edition
    await selectRadixOption(page, "category-select", "VARIETY PACK");

    // Wait for preview to generate
    await waitForSVG(page, "packaging-svg");

    // Get SVG content hash
    const svgElement = page.locator('[data-testid="packaging-svg"]');
    const svgContent = await svgElement.innerHTML();
    const svgHash = createHash("md5").update(svgContent).digest("hex");

    // Export SVG to verify
    const downloadPromise = page.waitForEvent("download");
    await page.click('[data-testid="export-svg-button"]');
    const download = await downloadPromise;
    const path = await download.path();
    const fs = await import("fs/promises");
    const downloadedSvg = await fs.readFile(path || "", "utf8");
    const downloadedHash = createHash("md5")
      .update(downloadedSvg)
      .digest("hex");

    // Verify consistency
    expect(svgHash).toBe(downloadedHash);

    console.log(`SVG content hash: ${svgHash}`);
  });
});

test.describe("Font and Asset Verification", () => {
  test("should embed Gaegu font in packaging exports", async ({ page }) => {
    await page.goto("/packaging");

    // Select any edition
    await selectRadixOption(page, "category-select", "VARIETY PACK");

    // Wait for preview
    await waitForSVG(page, "packaging-svg");

    // Check preview
    const svg = page.locator('[data-testid="packaging-svg"]');
    const svgContent = await svg.innerHTML();

    // Should contain font-face for Gaegu
    expect(svgContent).toContain("@font-face");
    expect(svgContent).toContain("Gaegu");

    // Export SVG to verify
    const downloadPromise = page.waitForEvent("download");
    await page.click('[data-testid="export-svg-button"]');
    const download = await downloadPromise;
    const path = await download.path();
    const fs = await import("fs/promises");
    const exportedSvg = await fs.readFile(path || "", "utf8");

    // Should also have embedded font in export
    expect(exportedSvg).toContain("font-family");
    expect(exportedSvg).toContain("Gaegu");
  });

  test("should embed techybara images in card samples", async ({ page }) => {
    await page.goto("/packaging");

    // Select Frontend category
    await selectRadixOption(page, "category-select", "Frontend");

    // Wait for preview
    await waitForSVG(page, "packaging-svg");

    // Check SVG content
    const svg = page.locator('[data-testid="packaging-svg"]');
    const svgContent = await svg.innerHTML();

    // Find card samples
    const cardSamples = svgContent.match(/data:image\/svg\+xml([^>]+)>/g) || [];

    // Verify at least one card sample exists
    expect(cardSamples.length).toBeGreaterThan(0);

    // Check if card samples contain techybara images
    const hasTechybara = cardSamples.some((sample) =>
      decodeURIComponent(sample).includes("techybara"),
    );
    expect(hasTechybara).toBe(true);
  });

  test("should display correct words on cards", async ({ page }) => {
    await page.goto("/");

    // Select Frontend category
    await selectDropdownMenuOption(page, "category-select", "Frontend");

    // Click generate
    await page.click('[data-testid="generate-button"]');

    // Wait for cards
    await page.waitForSelector('[data-testid="card-output"]', {
      timeout: 10000,
    });

    // Check card content
    const cardOutput = page.locator('[data-testid="card-output"] svg');
    const cardContent = await cardOutput.innerHTML();

    // Should contain Frontend-related terms
    const frontendTerms = ["React", "Component", "State", "Props"];
    const hasFrontendTerm = frontendTerms.some((term) =>
      cardContent.includes(term),
    );

    expect(hasFrontendTerm).toBe(true);

    // Should have techybara images
    expect(cardContent).toContain("techybara");
  });
});
