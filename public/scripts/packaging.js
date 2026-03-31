import { CATEGORY_DESCRIPTIONS, PACKAGING_SELECTIONS, PACKAGING_VERSIONS, createPackagingSvg } from "./lib/packagingRenderer.js";
import { savePNGFromSVG, addDpiMetadataToPng, setSvgPixelDimensions } from "./lib/exporters.js";

let renderRequestId = 0;

// DPI Constants for print quality
const SCREEN_DPI = 96;      // Standard screen resolution
const PRINT_DPI = 300;      // Target print resolution  
const DPI_SCALE = PRINT_DPI / SCREEN_DPI; // = 3.125x

const MM_TO_PX_AT_96 = 96 / 25.4;

const PANEL_EXPORT_LAYOUT = [
  { name: "lid-top", x: 29.4, y: 29.4, width: 66, height: 95 },
  { name: "short-side-top", x: 29.4, y: 0, width: 66, height: 29.4 },
  { name: "short-side-bottom", x: 29.4, y: 124.4, width: 66, height: 29.4 },
  { name: "long-side-left", x: 0, y: 29.4, width: 29.4, height: 95 },
  { name: "long-side-right", x: 95.4, y: 29.4, width: 29.4, height: 95 },
];

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function inlineSvgImages(svgMarkup) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(String(svgMarkup), "image/svg+xml");
  const images = Array.from(doc.querySelectorAll("image"));

  for (const img of images) {
    const href = (img.getAttribute("href") || img.getAttribute("xlink:href") || "").trim();
    if (!href || href.startsWith("data:")) continue;

    let absUrl;
    try {
      absUrl = new URL(href, window.location.href).href;
    } catch (_) {
      continue;
    }

    let res;
    try {
      res = await fetch(absUrl, { cache: "force-cache" });
    } catch (_) {
      continue;
    }
    if (!res.ok) continue;

    let blob;
    try {
      blob = await res.blob();
    } catch (_) {
      continue;
    }

    let dataUrl;
    try {
      dataUrl = await blobToDataUrl(blob);
    } catch (_) {
      continue;
    }

    img.setAttribute("href", dataUrl);
    img.removeAttribute("xlink:href");
  }

  return new XMLSerializer().serializeToString(doc.documentElement);
}

function getCurrentPackagingInputs() {
  return {
    category: document.getElementById("categorySelect")?.value || "VARIETY_PACK",
    version: document.getElementById("versionInput")?.value || "v1.0",
    description: document.getElementById("descriptionInput")?.value || "",
  };
}

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

function cropSvgToPanel(svgMarkup, panel) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(String(svgMarkup), "image/svg+xml");
  const svg = doc.documentElement;
  svg.setAttribute("width", `${panel.width}mm`);
  svg.setAttribute("height", `${panel.height}mm`);
  svg.setAttribute("viewBox", `${panel.x} ${panel.y} ${panel.width} ${panel.height}`);
  return new XMLSerializer().serializeToString(svg);
}

/**
 * Convert SVG to PNG blob at 300 DPI for print quality
 * 
 * DPI Calculation:
 * 1. Convert mm to pixels at base 96 DPI: widthPx = widthMm * (96/25.4)
 * 2. Scale canvas by 300/96 = 3.125x to achieve 300 DPI
 * 3. Final DPI = pixels / (mm / 25.4) = 300 DPI
 * 
 * Example for 66mm x 95mm panel:
 * - Base: 249px x 359px (at 96 DPI)
 * - Scaled: 778px x 1122px (at 300 DPI) ✓
 * 
 * NOTE: canvas.toBlob() sets correct pixel dimensions but may not write
 * DPI metadata (pHYs chunk) to PNG file. Print software should use pixel
 * dimensions and physical size (mm) to calculate 300 DPI.
 * 
 * @param {string} svgMarkup - SVG content to convert
 * @param {number} widthMm - Physical width in millimeters
 * @param {number} heightMm - Physical height in millimeters
 * @returns {Promise<Blob>} PNG blob with 300 DPI pixel dimensions
 */
async function svgToPngBlob(svgMarkup, widthMm, heightMm) {
  return new Promise((resolve, reject) => {
    const widthPx = Math.round(widthMm * MM_TO_PX_AT_96);
    const heightPx = Math.round(heightMm * MM_TO_PX_AT_96);
    
    // Calculate target dimensions at 300 DPI
    const scale = DPI_SCALE; // = 3.125x
    const targetWidth = Math.round(widthPx * scale);
    const targetHeight = Math.round(heightPx * scale);
    
    // Modify SVG to use pixel dimensions for proper high-DPI rasterization
    const modifiedSvg = setSvgPixelDimensions(
      String(svgMarkup),
      targetWidth,
      targetHeight,
      `0 0 ${widthMm} ${heightMm}`
    );
    
    const img = new Image();
    const svgBlob = new Blob([modifiedSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
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

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Panel PNG conversion failed"));
    };

    img.src = url;
  });
}

function renderCategoryOptions() {
  const select = document.getElementById("categorySelect");
  if (!select) return;
  select.innerHTML = PACKAGING_SELECTIONS
    .map((option) => `<option value="${option.key}">${option.type === "version" ? `[Version] ${option.label}` : option.label}</option>`)
    .join("");
}

function syncDescriptionFromCategory() {
  const category = document.getElementById("categorySelect")?.value || "VARIETY_PACK";
  const descriptionEl = document.getElementById("descriptionInput");
  if (!descriptionEl) return;
  const versionDescription = PACKAGING_VERSIONS[category]?.description;
  descriptionEl.value = versionDescription || CATEGORY_DESCRIPTIONS[category] || "";
}

async function renderPackaging() {
  const requestId = ++renderRequestId;
  const { category, version, description } = getCurrentPackagingInputs();
  const output = document.getElementById("packagingOutput");
  if (!output) return;

  output.innerHTML = "Rendering packaging...";
  const svg = await createPackagingSvg({ category, version, description });
  if (requestId !== renderRequestId) return;
  output.innerHTML = svg;
}

/**
 * Export full packaging design as PNG at 300 DPI (no borders)
 * Dimensions: 125.4mm x 153.8mm
 * Output: ~1476px x 1810px at 300 DPI
 */
async function exportPackagingPngNoBorders() {
  const { category, version, description } = getCurrentPackagingInputs();
  const svg = await createPackagingSvg({ category, version, description, includeBorders: false });

  // Full packaging dimensions: 125.4mm x 153.8mm
  // Convert to pixels at 96 DPI base, savePNGFromSVG will scale to 300 DPI
  const width = Math.round((125.4 / 25.4) * 96);   // ~469px base → ~1468px at 300 DPI
  const height = Math.round((153.8 / 25.4) * 96);  // ~579px base → ~1810px at 300 DPI
  savePNGFromSVG(svg, "packaging-lid-no-borders.png", width, height);
}

async function exportPanelsPngZip() {
  const { category, version, description } = getCurrentPackagingInputs();
  const svg = await createPackagingSvg({ category, version, description, includeBorders: false });
  const inlinedSvg = await inlineSvgImages(svg);
  const JSZip = await ensureJSZip();
  const zip = new JSZip();

  for (let i = 0; i < PANEL_EXPORT_LAYOUT.length; i += 1) {
    const panel = PANEL_EXPORT_LAYOUT[i];
    const croppedSvg = cropSvgToPanel(inlinedSvg, panel);
    const pngBlob = await svgToPngBlob(croppedSvg, panel.width, panel.height);
    zip.file(`${panel.name}.png`, pngBlob);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "packaging-panels-no-borders-png.zip";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function init() {
  renderCategoryOptions();
  syncDescriptionFromCategory();
  renderPackaging();

  const categorySelect = document.getElementById("categorySelect");
  if (categorySelect) {
    categorySelect.addEventListener("change", () => {
      syncDescriptionFromCategory();
      renderPackaging();
    });
  }

  const versionInput = document.getElementById("versionInput");
  if (versionInput) versionInput.addEventListener("input", renderPackaging);

  const descriptionInput = document.getElementById("descriptionInput");
  if (descriptionInput) descriptionInput.addEventListener("input", renderPackaging);

  const resetDescription = document.getElementById("resetDescription");
  if (resetDescription) {
    resetDescription.addEventListener("click", () => {
      syncDescriptionFromCategory();
      renderPackaging();
    });
  }

  const exportBtn = document.getElementById("exportPngNoBorders");
  if (exportBtn) exportBtn.addEventListener("click", exportPackagingPngNoBorders);

  const exportPanelsBtn = document.getElementById("exportPanelsZip");
  if (exportPanelsBtn) exportPanelsBtn.addEventListener("click", exportPanelsPngZip);
}

init();
