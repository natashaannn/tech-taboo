// public/scripts/lib/exporters.js

/**
 * Modify SVG markup to use pixel dimensions for proper high-DPI rasterization
 * @param {string} svgMarkup - Original SVG markup
 * @param {number} targetWidth - Target width in pixels
 * @param {number} targetHeight - Target height in pixels
 * @param {string} fallbackViewBox - ViewBox to use if not present (e.g. "0 0 610 910")
 * @returns {string} Modified SVG markup
 */
export function setSvgPixelDimensions(svgMarkup, targetWidth, targetHeight, fallbackViewBox) {
  let modifiedSvg = String(svgMarkup);
  const svgTagMatch = modifiedSvg.match(/<svg[^>]*>/);
  
  if (!svgTagMatch) return modifiedSvg;
  
  const originalTag = svgTagMatch[0];
  const viewBoxMatch = originalTag.match(/viewBox=["']([^"']+)["']/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : fallbackViewBox;
  
  let newTag = originalTag;
  
  // Replace or add width
  if (/width=["'][^"']+["']/.test(newTag)) {
    newTag = newTag.replace(/width=["'][^"']+["']/, `width="${targetWidth}"`);
  } else {
    newTag = newTag.replace(/<svg/, `<svg width="${targetWidth}"`);
  }
  
  // Replace or add height  
  if (/height=["'][^"']+["']/.test(newTag)) {
    newTag = newTag.replace(/height=["'][^"']+["']/, `height="${targetHeight}"`);
  } else {
    newTag = newTag.replace(/<svg/, `<svg height="${targetHeight}"`);
  }
  
  // Replace or add viewBox
  if (viewBoxMatch) {
    newTag = newTag.replace(/viewBox=["'][^"']+["']/, `viewBox="${viewBox}"`);
  } else {
    const insertPos = newTag.lastIndexOf('>');
    newTag = newTag.substring(0, insertPos) + ` viewBox="${viewBox}"` + newTag.substring(insertPos);
  }
  
  return modifiedSvg.replace(originalTag, newTag);
}

/**
 * Generate CRC32 lookup table (cached for performance)
 * @returns {Uint32Array} CRC lookup table
 */
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c;
  }
  return table;
})();

/**
 * Calculate CRC32 checksum for PNG chunks
 * @param {Uint8Array} data - Data to calculate CRC for
 * @returns {number} CRC32 checksum
 */
function calculateCRC32(data) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ data[i]) & 0xFF];
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

/**
 * Add DPI metadata (pHYs chunk) to a PNG blob
 * @param {Blob} pngBlob - Original PNG blob from canvas
 * @param {number} dpi - Desired DPI (default 300)
 * @returns {Promise<Blob>} PNG blob with DPI metadata
 */
export async function addDpiMetadataToPng(pngBlob, dpi = 300) {
  const arrayBuffer = await pngBlob.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  if (data.length < 8 || data[0] !== 0x89 || data[1] !== 0x50 || data[2] !== 0x4E || data[3] !== 0x47) {
    console.warn('Invalid PNG signature, returning original blob');
    return pngBlob;
  }
  
  // Convert DPI to pixels per meter (PNG pHYs format)
  // 1 inch = 0.0254 meters, so pixels/meter = DPI / 0.0254
  const pixelsPerMeter = Math.round(dpi / 0.0254);
  
  // Create pHYs chunk
  const phys = new Uint8Array(21);
  // Chunk length: 9 bytes
  phys[0] = 0; phys[1] = 0; phys[2] = 0; phys[3] = 9;
  // Chunk type: "pHYs"
  phys[4] = 0x70; phys[5] = 0x48; phys[6] = 0x59; phys[7] = 0x73;
  // Pixels per unit, X axis (4 bytes, big-endian)
  phys[8] = (pixelsPerMeter >>> 24) & 0xFF;
  phys[9] = (pixelsPerMeter >>> 16) & 0xFF;
  phys[10] = (pixelsPerMeter >>> 8) & 0xFF;
  phys[11] = pixelsPerMeter & 0xFF;
  // Pixels per unit, Y axis (4 bytes, big-endian)
  phys[12] = (pixelsPerMeter >>> 24) & 0xFF;
  phys[13] = (pixelsPerMeter >>> 16) & 0xFF;
  phys[14] = (pixelsPerMeter >>> 8) & 0xFF;
  phys[15] = pixelsPerMeter & 0xFF;
  // Unit: 1 = meter
  phys[16] = 1;
  
  // Calculate CRC32 for pHYs chunk (type + data)
  const crc = calculateCRC32(phys.subarray(4, 17));
  phys[17] = (crc >>> 24) & 0xFF;
  phys[18] = (crc >>> 16) & 0xFF;
  phys[19] = (crc >>> 8) & 0xFF;
  phys[20] = crc & 0xFF;
  
  // Insert pHYs chunk after IHDR (first chunk after signature)
  // PNG structure: signature(8) + IHDR chunk + ... other chunks
  // IHDR chunk is always 25 bytes: length(4) + type(4) + data(13) + CRC(4)
  const insertPosition = 8 + 25; // After signature and IHDR
  
  const result = new Uint8Array(data.length + phys.length);
  result.set(data.subarray(0, insertPosition), 0);
  result.set(phys, insertPosition);
  result.set(data.subarray(insertPosition), insertPosition + phys.length);
  
  return new Blob([result], { type: 'image/png' });
}

async function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read blob'));
    reader.readAsDataURL(blob);
  });
}

async function inlineSvgImages(svgMarkup) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(String(svgMarkup), 'image/svg+xml');
    const images = Array.from(doc.querySelectorAll('image'));

    for (const img of images) {
      const rawHref = img.getAttribute('href') || img.getAttribute('xlink:href') || '';
      const href = String(rawHref).trim();
      if (!href || href.startsWith('data:')) continue;

      let absolute;
      try {
        absolute = new URL(href, window.location.href).href;
      } catch (_) {
        continue;
      }

      let res;
      try {
        res = await fetch(absolute, { cache: 'force-cache' });
      } catch (_) {
        continue;
      }
      if (!res || !res.ok) continue;

      let blob;
      try {
        blob = await res.blob();
      } catch (_) {
        continue;
      }

      let dataUrl;
      try {
        dataUrl = await blobToDataURL(blob);
      } catch (_) {
        continue;
      }

      if (!dataUrl || !dataUrl.startsWith('data:')) continue;
      img.setAttribute('href', dataUrl);
      img.removeAttribute('xlink:href');
    }

    return new XMLSerializer().serializeToString(doc.documentElement);
  } catch (_) {
    return String(svgMarkup);
  }
}

export async function saveSVG(svgMarkup, filename = "taboo-card.svg") {
  let markup = String(svgMarkup);
  try {
    markup = await inlineSvgImages(markup);
  } catch (_) {
    markup = String(svgMarkup);
  }
  const blob = new Blob([markup], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Lazy-load JSZip from CDN if not already loaded
async function ensureJSZip() {
  if (window.JSZip) return window.JSZip;
  await new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js";
    s.onload = resolve;
    s.onerror = () => reject(new Error("Failed to load JSZip"));
    document.head.appendChild(s);
  });
  return window.JSZip;
}

export async function saveSVGsAsZip(svgs, zipName = "taboo-cards-svg.zip") {
  // svgs: array of { name: string, markup: string }
  const JSZip = await ensureJSZip();
  const zip = new JSZip();
  for (let i = 0; i < svgs.length; i++) {
    const { name, markup } = svgs[i];
    const filename = name || `card-${i + 1}.svg`;
    let inlined = String(markup);
    try {
      inlined = await inlineSvgImages(inlined);
    } catch (_) {
      inlined = String(markup);
    }
    zip.file(filename, inlined);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = zipName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export PNG files from SVG markup at 300 DPI print quality
 * 
 * DPI Calculation:
 * - Input width/height are in pixels at base resolution (typically 96 DPI equivalent)
 * - Canvas is scaled by 300/96 = 3.125x to achieve 300 DPI
 * - Final output has pixel dimensions suitable for 300 DPI printing
 * 
 * Example for 610x910px card:
 * - Input: 610px x 910px
 * - Output: 1906px x 2844px (at 300 DPI) ✓
 * 
 * NOTE: canvas.toBlob() creates correct pixel dimensions but may not set
 * DPI metadata (pHYs chunk) in the PNG file. Provide physical dimensions
 * to print software to ensure 300 DPI output.
 * 
 * @param {Array} svgs - Array of {name, markup} objects
 * @param {string} zipName - Output ZIP filename
 * @param {number} width - Base width in pixels
 * @param {number} height - Base height in pixels
 * @returns {Promise<void>}
 */
export async function savePNGsAsZip(svgs, zipName = "taboo-cards-png.zip", width = 610, height = 910) {
  // svgs: array of { name: string, markup: string }
  const JSZip = await ensureJSZip();
  const zip = new JSZip();

  function sanitizeForCanvas(markup) {
    // Remove foreignObject blocks to avoid tainting the canvas when drawing the SVG image
    return String(markup).replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '');
  }

  async function svgToPngBlob(markup) {
    return new Promise((resolve, reject) => {
      // Calculate target dimensions at 300 DPI
      const scale = 300 / 96; // = 3.125x for 300 DPI output
      const targetWidth = Math.round(width * scale);
      const targetHeight = Math.round(height * scale);
      
      const img = new Image();
      const safe = sanitizeForCanvas(markup);
      
      // Modify SVG to use pixel dimensions for proper high-DPI rasterization
      const modifiedSvg = setSvgPixelDimensions(safe, targetWidth, targetHeight, `0 0 ${width} ${height}`);
      
      const svgBlob = new Blob([modifiedSvg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        
        // SVG already rasterized at target resolution - draw 1:1
        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(async (blob) => {
          URL.revokeObjectURL(url);
          if (blob) {
            // Add 300 DPI metadata to PNG
            const pngWithDpi = await addDpiMetadataToPng(blob, 300);
            resolve(pngWithDpi);
          } else {
            reject(new Error("toBlob failed"));
          }
        }, "image/png");
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error("PNG export failed for one of the SVGs"));
      };
      img.src = url;
    });
  }

  for (let i = 0; i < svgs.length; i++) {
    const { name, markup } = svgs[i];
    const filename = (name || `card-${i + 1}.png`).replace(/\.svg$/i, ".png");
    let inlined = String(markup);
    try {
      inlined = await inlineSvgImages(inlined);
    } catch (_) {
      inlined = String(markup);
    }
    const blob = await svgToPngBlob(inlined);
    zip.file(filename, blob);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = zipName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export a single PNG from SVG markup at 300 DPI print quality
 * 
 * DPI Calculation:
 * - Scales canvas by 300/96 = 3.125x to achieve 300 DPI from base resolution
 * - Example: 610x910px input → 1906x2844px output (300 DPI suitable for print)
 * 
 * @param {string} svgMarkup - SVG content to convert
 * @param {string} filename - Output PNG filename
 * @param {number} width - Base width in pixels
 * @param {number} height - Base height in pixels
 */
export function savePNGFromSVG(svgMarkup, filename = "taboo-card.png", width = 610, height = 910) {
  (async () => {
    // Calculate target dimensions at 300 DPI
    const scale = 300 / 96; // = 3.125x for 300 DPI output
    const targetWidth = Math.round(width * scale);
    const targetHeight = Math.round(height * scale);
    
    const img = new Image();
    let markup = String(svgMarkup);
    try {
      markup = await inlineSvgImages(markup);
    } catch (_) {
      markup = String(svgMarkup);
    }
    const safe = String(markup).replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '');
    
    // Modify SVG to use pixel dimensions for proper high-DPI rasterization
    const modifiedSvg = setSvgPixelDimensions(safe, targetWidth, targetHeight, `0 0 ${width} ${height}`);
    
    const svgBlob = new Blob([modifiedSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      
      // SVG already rasterized at target resolution - draw 1:1
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(async function (blob) {
        URL.revokeObjectURL(url);
        if (!blob) {
          alert("PNG export failed. Try a different browser.");
          return;
        }
        // Add 300 DPI metadata to PNG
        const pngWithDpi = await addDpiMetadataToPng(blob, 300);
        const downloadUrl = URL.createObjectURL(pngWithDpi);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        // Clean up download URL after a short delay to ensure download starts
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
      }, "image/png");
    };
    img.onerror = function () {
      alert("PNG export failed. Try a different browser.");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  })();
}
