#!/usr/bin/env node

// Simple test verification script
// This script checks that all test files are properly formatted and have the required test IDs

import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testDir = join(__dirname, "../src/e2e");
const testFiles = readdirSync(testDir).filter((f) => f.endsWith(".spec.ts"));

console.log("Found E2E test files:");
testFiles.forEach((file) => console.log(`  - ${file}`));

// Check test files for required test IDs
const requiredTestIds = [
  "packaging-preview",
  "packaging-svg",
  "category-select",
  "export-png-button",
  "export-svg-button",
  "card-output",
  "generate-button",
  "download-cards-button",
  "download-packaging-whole-button",
];

console.log("\nRequired test IDs:");
requiredTestIds.forEach((id) => console.log(`  - ${id}`));

// Verify test files contain the test IDs
console.log("\nVerifying test files contain required test IDs...");
testFiles.forEach((file) => {
  const content = readFileSync(join(testDir, file), "utf8");
  console.log(`\n${file}:`);

  requiredTestIds.forEach((id) => {
    if (content.includes(id)) {
      console.log(`  ✓ Contains test ID: ${id}`);
    } else {
      console.log(`  ✗ Missing test ID: ${id}`);
    }
  });
});

// Check component files for test IDs
console.log("\nChecking component files for test IDs...");
const componentFiles = [
  "../src/pages/Packaging.tsx",
  "../src/pages/Manufacturer.tsx",
  "../src/pages/CardGenerator.tsx",
  "../src/components/CardOutput.tsx",
  "../src/components/CardControls.tsx",
];

componentFiles.forEach((file) => {
  try {
    const content = readFileSync(join(__dirname, file), "utf8");
    console.log(`\n${file}:`);

    requiredTestIds.forEach((id) => {
      if (content.includes(`data-testid="${id}"`)) {
        console.log(`  ✓ Has test ID: ${id}`);
      }
    });
  } catch (error) {
    console.log(`  Could not read file: ${file}`);
  }
});

console.log("\nE2E test verification complete!");
