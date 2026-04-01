import { tabooList } from "./data/tabooList.js";
import { generateSVG } from "./lib/generateSVG.js";
import { getCategoryColor, detectCategory } from "./lib/categories.js";
import { preloadTechybaraImages, preloadFonts } from "./lib/imageData.js";
import { DEFAULT_VERSION_ID, VERSION_DEFINITIONS, getVersionCounts, getVersionLabel } from "./lib/versions.js";
import { createPackagingSvg } from "./lib/packagingRenderer.js";

const ENABLED_SUPPLIER_VERSIONS = new Set([
  "VARIETY_PACK",
  "SOFTWARE_INTERVIEW_EXTENSION",
]);

const PACKAGING_VERSION_MAP = {
  VARIETY_PACK: "VARIETY_PACK",
  SOFTWARE_INTERVIEW_EXTENSION: "SOFTWARE_INTERVIEW_EXTENSION",
  DEVSECOPS_PACK: "DEVSEC_PACK",
  PRODUCT_PACK: "PRODUCT_EXPERIENCE_PACK",
  Data_AI_PACK: "DATA_AI_PACK",
  SWE_GAME_DEV_PACK: "ENGINEERING_GAME_PACK",
  RESPONSIBLE_TECH_PACK: "Responsible Tech",
};

const MM_TO_PX_AT_96 = 96 / 25.4;
const PACKAGING_TOTAL_MM = { width: 124.8, height: 153.8 };
const PANEL_EXPORT_LAYOUT = [
  { name: "lid-top", x: 29.4, y: 29.4, width: 66, height: 95 },
  { name: "short-side-top", x: 29.4, y: 0, width: 66, height: 29.4 },
  { name: "short-side-bottom", x: 29.4, y: 124.4, width: 66, height: 29.4 },
  { name: "long-side-left", x: 0, y: 29.4, width: 29.4, height: 95 },
  { name: "long-side-right", x: 95.4, y: 29.4, width: 29.4, height: 95 },
];

const I18N = {
  en: {
    title: "Manufacturer Download",
    subtitle: "Select an edition, then export card PNG files and packaging print files.",
    langLabel: "Language / 语言",
    versionLabel: "Edition / 版本",
    cardsBtn: "Download Cards (PNG ZIP)",
    pkgWholeBtn: "Download Packaging (Whole ZIP)",
    pkgPanelsBtn: "Download Packaging (Panels ZIP)",
    packagingTitle: "Packaging Designs",
    packagingDesc: "Export full packaging artwork or individual panel artwork for print.",
    referenceTitle: "Reference Preview",
    referenceCaption: "Reference image (card.png). Confirm final print files match font and layout.",
    back: "↩ Back to Tech Taboo",
    comingSoon: "Coming soon",
    statusReady: "Ready.",
    statusError: "Export failed. Please refresh and try again.",
    statusCards: (done, total) => `Rendering cards... ${done}/${total}`,
    statusPackaging: "Rendering packaging...",
    statusZip: "Generating ZIP...",
    statusDone: "Download started.",
    statusFontError: "Export blocked: fonts failed to load. Check your network connection and try again.",
    instructions: (label) =>
      `Instructions for ${label}:\n` +
      "1) Click \"Download Cards (PNG ZIP)\" to get all card fronts for this edition.\n" +
      "2) Click \"Download Packaging (Whole ZIP)\" to get the full lid layout as one PNG.\n" +
      "3) Click \"Download Packaging (Panels ZIP)\" to get top/long/short sides as separate PNGs.\n" +
      "4) Unzip all files before print production.",
    packInfo: (label, total, cats) => `${label}: ${total} cards. Category counts: ${cats}.`,
  },
  zh: {
    title: "工厂下载页面",
    subtitle: "请选择版本，然后分别导出卡牌 PNG 和包装印刷文件。",
    langLabel: "语言 / Language",
    versionLabel: "版本 / Edition",
    cardsBtn: "下载卡牌（PNG ZIP）",
    pkgWholeBtn: "下载包装整图（ZIP）",
    pkgPanelsBtn: "下载包装分面（ZIP）",
    packagingTitle: "包装设计文件",
    packagingDesc: "可导出整张包装图，或按面导出（顶面/长边/短边）用于印刷。",
    referenceTitle: "参考预览",
    referenceCaption: "参考图（card.png）。请确认最终印刷文件的字体与版式一致。",
    back: "↩ 返回 Tech Taboo",
    comingSoon: "暂未开放",
    statusReady: "已就绪。",
    statusError: "导出失败，请刷新后重试。",
    statusCards: (done, total) => `正在渲染卡牌... ${done}/${total}`,
    statusPackaging: "正在渲染包装...",
    statusZip: "正在生成 ZIP...",
    statusDone: "已开始下载。",
    statusFontError: "导出已中止：字体加载失败，请检查网络连接后重试。",
    instructions: (label) =>
      `${label} 操作说明：\n` +
      "1）点击“下载卡牌（PNG ZIP）”，下载该版本全部卡牌图。\n" +
      "2）点击“下载包装整图（ZIP）”，下载整张包装展开图 PNG。\n" +
      "3）点击“下载包装分面（ZIP）”，下载顶面/长边/短边单独 PNG。\n" +
      "4）下载后请先解压，再交付印刷。",
    packInfo: (label, total, cats) => `${label}：共 ${total} 张卡牌。分类数量：${cats}。`,
  },
};

let exportBusy = false;

function getLang() {
  return (document.getElementById("lang")?.value || "en");
}

function getText() {
  return I18N[getLang()] || I18N.en;
}

function setStatus(text) {
  const el = document.getElementById("status");
  if (el) el.textContent = text || "";
}

function setExportBusy(busy, label) {
  exportBusy = !!busy;
  ["btn-download-cards", "btn-download-packaging-whole", "btn-download-packaging-panels"]
    .forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.disabled = exportBusy;
    });

  let overlay = document.getElementById("export-loader");
  if (!exportBusy) {
    if (overlay?.parentNode) overlay.parentNode.removeChild(overlay);
    const style = document.getElementById("export-loader-style");
    if (style?.parentNode) style.parentNode.removeChild(style);
    return;
  }

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "export-loader";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0,0,0,0.45)";
    overlay.style.zIndex = "9999";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.padding = "24px";

    const box = document.createElement("div");
    box.style.background = "#fff";
    box.style.borderRadius = "12px";
    box.style.padding = "18px 20px";
    box.style.maxWidth = "520px";
    box.style.width = "min(520px, 92vw)";
    box.style.boxShadow = "0 10px 30px rgba(0,0,0,0.25)";
    box.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";

    const title = document.createElement("div");
    title.id = "export-loader-title";
    title.style.fontWeight = "700";
    title.style.marginBottom = "10px";
    title.style.fontSize = "16px";
    title.textContent = "Exporting...";

    const barWrap = document.createElement("div");
    barWrap.style.height = "10px";
    barWrap.style.background = "#e5e7eb";
    barWrap.style.borderRadius = "999px";
    barWrap.style.overflow = "hidden";

    const bar = document.createElement("div");
    bar.style.height = "100%";
    bar.style.width = "40%";
    bar.style.background = "#17424A";
    bar.style.borderRadius = "999px";
    bar.style.animation = "exportLoaderMove 1.05s ease-in-out infinite";

    const style = document.createElement("style");
    style.id = "export-loader-style";
    style.textContent = "@keyframes exportLoaderMove { 0% { transform: translateX(-60%); } 50% { transform: translateX(110%); } 100% { transform: translateX(-60%); } }";

    barWrap.appendChild(bar);
    box.appendChild(title);
    box.appendChild(barWrap);
    overlay.appendChild(box);
    document.head.appendChild(style);
    document.body.appendChild(overlay);
  }

  const t = document.getElementById("export-loader-title");
  if (t) t.textContent = String(label || "Exporting...");
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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

function buildPairsForVersion(versionId) {
  const counts = getVersionCounts(versionId) || {};
  const byCategory = {};

  tabooList.forEach((item) => {
    const category = item.category || detectCategory(item.word);
    if (!byCategory[category]) byCategory[category] = [];
    byCategory[category].push(item);
  });

  const pairs = [];
  Object.entries(counts).forEach(([category, target]) => {
    const pool = byCategory[category] ? [...byCategory[category]] : [];
    if (!pool.length || !target) return;

    let take = Math.min(target, pool.length);
    if (take % 2 !== 0) take -= 1;
    if (take < 2) return;

    const selected = pool.slice(0, take);
    for (let i = 0; i < selected.length; i += 2) {
      const top = selected[i];
      const bottom = selected[i + 1];
      pairs.push({
        top: {
          word: top.word,
          taboos: top.taboo,
          category: top.category || detectCategory(top.word),
        },
        bottom: {
          word: bottom.word,
          taboos: bottom.taboo,
          category: bottom.category || detectCategory(bottom.word),
        },
      });
    }
  });

  return pairs;
}

function getSelectedVersion() {
  return document.getElementById("versionSelect")?.value || DEFAULT_VERSION_ID;
}

function getSelectedVersionLabel() {
  return getVersionLabel(getSelectedVersion()) || getSelectedVersion();
}

function getCategorySummary(versionId) {
  const counts = getVersionCounts(versionId) || {};
  return Object.entries(counts)
    .map(([name, count]) => `${name} ${count}`)
    .join(", ");
}

function populateVersionOptions() {
  const select = document.getElementById("versionSelect");
  if (!select) return;
  const t = getText();
  const prev = select.value;

  select.innerHTML = VERSION_DEFINITIONS
    .map((v) => {
      const enabled = ENABLED_SUPPLIER_VERSIONS.has(v.id);
      const extra = enabled ? "" : ` (${t.comingSoon})`;
      return `<option value="${v.id}" ${enabled ? "" : "disabled"}>${v.label}${extra}</option>`;
    })
    .join("");

  if (prev && ENABLED_SUPPLIER_VERSIONS.has(prev)) {
    select.value = prev;
  } else if (ENABLED_SUPPLIER_VERSIONS.has(DEFAULT_VERSION_ID)) {
    select.value = DEFAULT_VERSION_ID;
  } else {
    const firstEnabled = VERSION_DEFINITIONS.find((v) => ENABLED_SUPPLIER_VERSIONS.has(v.id));
    if (firstEnabled) select.value = firstEnabled.id;
  }
}

function applyText() {
  const t = getText();
  const selectedVersion = getSelectedVersion();
  const label = getSelectedVersionLabel();
  const pairs = buildPairsForVersion(selectedVersion);
  const totalCards = pairs.length;
  const cats = getCategorySummary(selectedVersion);

  document.getElementById("title").textContent = t.title;
  document.getElementById("subtitle").textContent = t.subtitle;
  document.getElementById("langLabel").textContent = t.langLabel;
  document.getElementById("versionLabel").textContent = t.versionLabel;
  document.getElementById("btn-download-cards").textContent = t.cardsBtn;
  document.getElementById("btn-download-packaging-whole").textContent = t.pkgWholeBtn;
  document.getElementById("btn-download-packaging-panels").textContent = t.pkgPanelsBtn;
  document.getElementById("packagingTitle").textContent = t.packagingTitle;
  document.getElementById("packagingDesc").textContent = t.packagingDesc;
  document.getElementById("referenceTitle").textContent = t.referenceTitle;
  document.getElementById("referenceCaption").textContent = t.referenceCaption;
  document.getElementById("backLink").textContent = t.back;
  document.getElementById("instructions").textContent = t.instructions(label);
  document.getElementById("packInfo").textContent = t.packInfo(label, totalCards, cats);
  if (!document.getElementById("status")?.textContent) setStatus(t.statusReady);
}

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
      reject(new Error("PNG conversion failed"));
    };

    img.src = url;
  });
}

function resolvePackagingSelection(versionId) {
  return PACKAGING_VERSION_MAP[versionId] || versionId;
}

async function exportCardsZip() {
  if (exportBusy) return;
  const versionId = getSelectedVersion();
  const t = getText();
  const pairs = buildPairsForVersion(versionId);

  setExportBusy(true, t.statusPackaging);
  try {
    const { savePNGsAsZip } = await import("./lib/exporters.js");
    let techybaraImages, embeddedFonts;
    try {
      [techybaraImages, embeddedFonts] = await Promise.all([
        preloadTechybaraImages(),
        preloadFonts()
      ]);
    } catch (_) {
      techybaraImages = { teacher: "./techybara/teacher.png", peekOut: "./techybara/peek out.png" };
      embeddedFonts = null;
    }

    const fontsOk = embeddedFonts &&
      embeddedFonts.monospaceNormal &&
      embeddedFonts.monospaceBold;
    if (!fontsOk) {
      setStatus(t.statusFontError);
      setExportBusy(false);
      return;
    }

    const items = [];
    for (let i = 0; i < pairs.length; i += 1) {
      setStatus(t.statusCards(i + 1, pairs.length));
      const pair = pairs[i];
      const cardColor = getCategoryColor(pair.top.category);
      const svg = generateSVG(pair.top.word, pair.top.taboos, pair.bottom.word, pair.bottom.taboos, {
        baseColor: cardColor,
        background: cardColor,
        strokeColor: cardColor,
        matchStrokeBackground: false,
        showBleed: false,
        category: pair.top.category,
        teacherImage: techybaraImages.teacher,
        peekOutImage: techybaraImages.peekOut,
        fonts: embeddedFonts,
      });
      items.push({ name: `card-${i + 1}.svg`, markup: svg });
      if (i % 8 === 0) await new Promise((r) => setTimeout(r, 0));
    }

    await savePNGsAsZip(items, `tech-taboo-${versionId.toLowerCase()}-cards.zip`, 610, 910);
    setStatus(t.statusDone);
  } catch (_) {
    setStatus(t.statusError);
  } finally {
    setExportBusy(false);
  }
}

async function exportPackagingWholeZip() {
  if (exportBusy) return;
  const t = getText();
  const versionId = getSelectedVersion();
  const packagingKey = resolvePackagingSelection(versionId);

  setExportBusy(true, t.statusPackaging);
  try {
    const JSZip = await ensureJSZip();
    const zip = new JSZip();
    const svg = await createPackagingSvg({
      category: packagingKey,
      includeBorders: false,
    });
    const inlined = await inlineSvgImages(svg);
    const pngBlob = await svgToPngBlob(inlined, PACKAGING_TOTAL_MM.width, PACKAGING_TOTAL_MM.height);
    zip.file("packaging-whole.png", pngBlob);
    setStatus(t.statusZip);
    const zipBlob = await zip.generateAsync({ type: "blob" });
    triggerDownload(zipBlob, `tech-taboo-${versionId.toLowerCase()}-packaging-whole.zip`);
    setStatus(t.statusDone);
  } catch (_) {
    setStatus(t.statusError);
  } finally {
    setExportBusy(false);
  }
}

async function exportPackagingPanelsZip() {
  if (exportBusy) return;
  const t = getText();
  const versionId = getSelectedVersion();
  const packagingKey = resolvePackagingSelection(versionId);

  setExportBusy(true, t.statusPackaging);
  try {
    const JSZip = await ensureJSZip();
    const zip = new JSZip();
    const svg = await createPackagingSvg({
      category: packagingKey,
      includeBorders: false,
    });
    const inlined = await inlineSvgImages(svg);

    for (let i = 0; i < PANEL_EXPORT_LAYOUT.length; i += 1) {
      const panel = PANEL_EXPORT_LAYOUT[i];
      const cropped = cropSvgToPanel(inlined, panel);
      const pngBlob = await svgToPngBlob(cropped, panel.width, panel.height);
      zip.file(`${panel.name}.png`, pngBlob);
    }

    setStatus(t.statusZip);
    const zipBlob = await zip.generateAsync({ type: "blob" });
    triggerDownload(zipBlob, `tech-taboo-${versionId.toLowerCase()}-packaging-panels.zip`);
    setStatus(t.statusDone);
  } catch (_) {
    setStatus(t.statusError);
  } finally {
    setExportBusy(false);
  }
}

function wireEvents() {
  document.getElementById("lang")?.addEventListener("change", () => {
    populateVersionOptions();
    applyText();
    setStatus(getText().statusReady);
  });

  document.getElementById("versionSelect")?.addEventListener("change", () => {
    applyText();
    setStatus(getText().statusReady);
  });

  document.getElementById("btn-download-cards")?.addEventListener("click", exportCardsZip);
  document.getElementById("btn-download-packaging-whole")?.addEventListener("click", exportPackagingWholeZip);
  document.getElementById("btn-download-packaging-panels")?.addEventListener("click", exportPackagingPanelsZip);
}

function init() {
  populateVersionOptions();
  applyText();
  wireEvents();
  setStatus(getText().statusReady);
}

init();
