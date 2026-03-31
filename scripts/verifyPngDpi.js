#!/usr/bin/env node

/**
 * PNG DPI Verification Tool
 * 
 * Verifies that exported PNG files have correct dimensions for 300 DPI printing.
 * 
 * Usage:
 *   node scripts/verifyPngDpi.js <png-file> <expected-width-mm> <expected-height-mm>
 * 
 * Example:
 *   node scripts/verifyPngDpi.js lid-top.png 66 95
 * 
 * This checks if lid-top.png has the correct pixel dimensions for
 * 66mm x 95mm at 300 DPI (should be ~778px x 1122px).
 */

const fs = require('fs');
const path = require('path');

const PRINT_DPI = 300;
const MM_TO_INCHES = 1 / 25.4;

function readPngDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  
  // PNG signature check
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (!buffer.slice(0, 8).equals(pngSignature)) {
    throw new Error('Not a valid PNG file');
  }
  
  // Read IHDR chunk (always the first chunk after signature)
  // IHDR is at offset 8 (after signature)
  const width = buffer.readUInt32BE(16);  // Width at offset 16
  const height = buffer.readUInt32BE(20); // Height at offset 20
  
  // Try to read pHYs chunk (physical pixel dimensions)
  let pHYsFound = false;
  let xPixelsPerUnit = null;
  let yPixelsPerUnit = null;
  let unit = null;
  
  let offset = 8; // Start after PNG signature
  while (offset < buffer.length) {
    const chunkLength = buffer.readUInt32BE(offset);
    const chunkType = buffer.toString('ascii', offset + 4, offset + 8);
    
    if (chunkType === 'pHYs') {
      pHYsFound = true;
      xPixelsPerUnit = buffer.readUInt32BE(offset + 8);
      yPixelsPerUnit = buffer.readUInt32BE(offset + 12);
      unit = buffer.readUInt8(offset + 16); // 0 = unknown, 1 = meters
      break;
    }
    
    // Move to next chunk (length + 4 bytes type + 4 bytes CRC)
    offset += chunkLength + 12;
    
    // Stop at IEND
    if (chunkType === 'IEND') break;
  }
  
  return {
    width,
    height,
    pHYs: pHYsFound ? {
      xPixelsPerUnit,
      yPixelsPerUnit,
      unit,
      dpiX: unit === 1 ? Math.round(xPixelsPerUnit * 0.0254) : null,
      dpiY: unit === 1 ? Math.round(yPixelsPerUnit * 0.0254) : null,
    } : null
  };
}

function verifyDpi(pngFile, expectedWidthMm, expectedHeightMm) {
  console.log('🔍 PNG DPI Verification Tool\n');
  console.log(`File: ${pngFile}`);
  console.log(`Expected physical size: ${expectedWidthMm}mm x ${expectedHeightMm}mm`);
  console.log(`Target DPI: ${PRINT_DPI}\n`);
  
  const info = readPngDimensions(pngFile);
  
  console.log('📏 PNG Dimensions:');
  console.log(`  Pixel size: ${info.width}px x ${info.height}px`);
  
  if (info.pHYs) {
    console.log(`\n📊 pHYs Metadata Found:`);
    console.log(`  Pixels per unit: ${info.pHYs.xPixelsPerUnit} x ${info.pHYs.yPixelsPerUnit}`);
    console.log(`  Unit: ${info.pHYs.unit === 1 ? 'meters' : 'unknown'}`);
    if (info.pHYs.dpiX) {
      console.log(`  DPI (from metadata): ${info.pHYs.dpiX} x ${info.pHYs.dpiY}`);
    }
  } else {
    console.log(`\n⚠️  No pHYs chunk found (DPI metadata missing)`);
  }
  
  // Calculate effective DPI based on pixel dimensions and expected physical size
  const expectedWidthInches = expectedWidthMm * MM_TO_INCHES;
  const expectedHeightInches = expectedHeightMm * MM_TO_INCHES;
  
  const effectiveDpiX = info.width / expectedWidthInches;
  const effectiveDpiY = info.height / expectedHeightInches;
  
  console.log(`\n✅ Calculated DPI (from pixel dimensions and physical size):`);
  console.log(`  Width: ${info.width}px / ${expectedWidthInches.toFixed(3)}in = ${effectiveDpiX.toFixed(2)} DPI`);
  console.log(`  Height: ${info.height}px / ${expectedHeightInches.toFixed(3)}in = ${effectiveDpiY.toFixed(2)} DPI`);
  
  // Verify if DPI is close to 300
  const tolerance = 5; // Allow 5 DPI tolerance
  const dpiOk = Math.abs(effectiveDpiX - PRINT_DPI) < tolerance && 
                Math.abs(effectiveDpiY - PRINT_DPI) < tolerance;
  
  console.log(`\n${dpiOk ? '✅' : '❌'} DPI Verification: ${dpiOk ? 'PASS' : 'FAIL'}`);
  
  if (!dpiOk) {
    console.log(`   Expected ~${PRINT_DPI} DPI, got ${effectiveDpiX.toFixed(1)} x ${effectiveDpiY.toFixed(1)} DPI`);
    console.log(`\n💡 Recommended pixel dimensions for ${expectedWidthMm}mm x ${expectedHeightMm}mm at ${PRINT_DPI} DPI:`);
    console.log(`   ${Math.round(expectedWidthInches * PRINT_DPI)}px x ${Math.round(expectedHeightInches * PRINT_DPI)}px`);
  }
  
  if (!info.pHYs) {
    console.log(`\n⚠️  Warning: pHYs chunk not found in PNG.`);
    console.log(`   Some print software may assume default DPI (72 or 96) instead of ${PRINT_DPI}.`);
    console.log(`   Pixel dimensions are correct, but consider adding pHYs metadata.`);
  }
  
  return dpiOk;
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length !== 3) {
    console.log('Usage: node verifyPngDpi.js <png-file> <width-mm> <height-mm>');
    console.log('\nExample:');
    console.log('  node scripts/verifyPngDpi.js lid-top.png 66 95');
    process.exit(1);
  }
  
  const [pngFile, widthMm, heightMm] = args;
  
  if (!fs.existsSync(pngFile)) {
    console.error(`Error: File not found: ${pngFile}`);
    process.exit(1);
  }
  
  try {
    const result = verifyDpi(pngFile, parseFloat(widthMm), parseFloat(heightMm));
    process.exit(result ? 0 : 1);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = { verifyDpi, readPngDimensions };
