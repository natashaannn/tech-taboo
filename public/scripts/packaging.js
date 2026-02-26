import { CATEGORY_DESCRIPTIONS, PACKAGING_SELECTIONS, PACKAGING_VERSIONS, createPackagingSvg } from "./lib/packagingRenderer.js";
import { savePNGFromSVG } from "./lib/exporters.js";

let renderRequestId = 0;
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

async function svgToPngBlob(svgMarkup, widthMm, heightMm) {
  return new Promise((resolve, reject) => {
    const widthPx = Math.round(widthMm * MM_TO_PX_AT_96);
    const heightPx = Math.round(heightMm * MM_TO_PX_AT_96);
    const img = new Image();
    const svgBlob = new Blob([String(svgMarkup)], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const scale = 300 / 96;
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(widthPx * scale);
      canvas.height = Math.round(heightPx * scale);
      const ctx = canvas.getContext("2d");
      ctx.scale(scale, scale);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, widthPx, heightPx);
      ctx.drawImage(img, 0, 0, widthPx, heightPx);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        if (blob) resolve(blob);
        else reject(new Error("toBlob failed"));
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

async function exportPackagingPngNoBorders() {
  const { category, version, description } = getCurrentPackagingInputs();
  const svg = await createPackagingSvg({ category, version, description, includeBorders: false });

  // 125.4mm x 153.8mm converted at ~96 DPI, exporter scales further for print.
  const width = Math.round((125.4 / 25.4) * 96);
  const height = Math.round((153.8 / 25.4) * 96);
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
