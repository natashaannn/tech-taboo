// public/scripts/manufacturer.js
import { tabooList } from "./data/tabooList.js";
import { generateSVG } from "./lib/generateSVG.js";
import { getCategoryColor, detectCategory } from "./lib/categories.js";
import { preloadTechybaraImages } from "./lib/imageData.js";

const VARIETY_PACK_COUNTS = {
  "General": 60,
  "AI": 16,
  "Software Engineering": 16,
  "Product Management": 16,
};

const I18N = {
  en: {
    title: "Manufacturer Download",
    subtitle: "For our card manufacturer: download the complete Variety Pack as a PNG zip.",
    download: "Download All Cards (PNG ZIP)",
    packagingTitle: "Packaging Designs",
    packagingDesc: "Download the packaging design files as a zip.",
    packagingDownload: "Download Packaging Designs (ZIP)",
    back: "⤺ Back to Tech Taboo",
    instructions: (count) => `Steps:\n1) Click “Download All Cards (PNG ZIP)”\n2) Wait until the download prompt appears (do not click multiple times)\n3) Unzip the file to get ${count} PNG images\n\nNotes:\n- This exports the Variety Pack selection used by the main app\n- Output resolution is high, so export may take a while`,
    packInfo: (count) => `Variety Pack contents: ${count} cards. Categories and counts: General ${VARIETY_PACK_COUNTS["General"]}, AI ${VARIETY_PACK_COUNTS["AI"]}, Software Engineering ${VARIETY_PACK_COUNTS["Software Engineering"]}, Product Management ${VARIETY_PACK_COUNTS["Product Management"]}.`,
    statusReady: "Ready.",
    statusWorking: (done, total) => `Exporting… ${done}/${total}`,
    statusDone: "Export started (zip download).",
    statusError: "Export failed. Please refresh and try again.",
  },
  zh: {
    title: "工厂下载页面",
    subtitle: "给卡牌生产工厂使用：一键下载“Variety Pack”全部卡牌（PNG 压缩包）。",
    download: "下载全部卡牌（PNG ZIP）",
    packagingTitle: "包装设计文件",
    packagingDesc: "将包装设计文件打包下载（ZIP）。",
    packagingDownload: "下载包装设计文件（ZIP）",
    back: "⤺ 返回 Tech Taboo",
    instructions: (count) => `操作步骤：\n1）点击“下载全部卡牌（PNG ZIP）”\n2）等待浏览器弹出下载（请勿重复点击）\n3）解压后会得到 ${count} 张 PNG 图片\n\n注意：\n- 导出内容与主页面的 Variety Pack 版本一致\n- 图片分辨率较高，导出需要一些时间`,
    packInfo: (count) => `Variety Pack 共 ${count} 张卡牌。分类数量：通用 ${VARIETY_PACK_COUNTS["General"]}，AI ${VARIETY_PACK_COUNTS["AI"]}，软件工程 ${VARIETY_PACK_COUNTS["Software Engineering"]}，产品管理 ${VARIETY_PACK_COUNTS["Product Management"]}。`,
    statusReady: "已就绪。",
    statusWorking: (done, total) => `正在导出… ${done}/${total}`,
    statusDone: "已开始下载（ZIP）。",
    statusError: "导出失败，请刷新后重试。",
  }
};

let exportBusy = false;

function setExportBusy(busy, label) {
  exportBusy = !!busy;
  const btn = document.getElementById('btn-download');
  if (btn) btn.disabled = exportBusy;

  let overlay = document.getElementById('export-loader');
  if (!exportBusy) {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    const style = document.getElementById('export-loader-style');
    if (style && style.parentNode) style.parentNode.removeChild(style);
    return;
  }

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'export-loader';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,0.45)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.padding = '24px';

    const box = document.createElement('div');
    box.style.background = '#ffffff';
    box.style.borderRadius = '12px';
    box.style.padding = '18px 20px';
    box.style.maxWidth = '520px';
    box.style.width = 'min(520px, 92vw)';
    box.style.boxShadow = '0 10px 30px rgba(0,0,0,0.25)';
    box.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';

    const title = document.createElement('div');
    title.id = 'export-loader-title';
    title.style.fontWeight = '700';
    title.style.marginBottom = '10px';
    title.style.fontSize = '16px';
    title.textContent = 'Exporting…';

    const barWrap = document.createElement('div');
    barWrap.style.height = '10px';
    barWrap.style.background = '#e5e7eb';
    barWrap.style.borderRadius = '999px';
    barWrap.style.overflow = 'hidden';

    const bar = document.createElement('div');
    bar.style.height = '100%';
    bar.style.width = '40%';
    bar.style.background = '#17424A';
    bar.style.borderRadius = '999px';
    bar.style.animation = 'exportLoaderMove 1.05s ease-in-out infinite';

    const style = document.createElement('style');
    style.id = 'export-loader-style';
    style.textContent = `@keyframes exportLoaderMove { 0% { transform: translateX(-60%); } 50% { transform: translateX(110%); } 100% { transform: translateX(-60%); } }`;

    barWrap.appendChild(bar);
    box.appendChild(title);
    box.appendChild(barWrap);
    overlay.appendChild(box);
    document.head.appendChild(style);
    document.body.appendChild(overlay);
  }

  const t = document.getElementById('export-loader-title');
  if (t) t.textContent = String(label || 'Exporting…');
}

function buildVarietyPackPairs() {
  const byCategory = {};
  tabooList.forEach(item => {
    const cat = item.category || detectCategory(item.word);
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(item);
  });

  const pairs = [];
  Object.keys(VARIETY_PACK_COUNTS).forEach(cat => {
    const targetCount = VARIETY_PACK_COUNTS[cat];
    const wordsInCat = byCategory[cat] ? [...byCategory[cat]] : [];
    if (!targetCount || wordsInCat.length === 0) return;

    let take = Math.min(targetCount, wordsInCat.length);
    if (take % 2 !== 0) take -= 1;
    if (take < 2) return;

    const selected = wordsInCat.slice(0, take);
    for (let i = 0; i < selected.length; i += 2) {
      const w1 = selected[i];
      const w2 = selected[i + 1];
      pairs.push({
        top: {
          word: w1.word,
          taboos: w1.taboo,
          category: w1.category || detectCategory(w1.word),
        },
        bottom: {
          word: w2.word,
          taboos: w2.taboo,
          category: w2.category || detectCategory(w2.word),
        }
      });
    }
  });

  return pairs;
}

function setText(lang, totalCards) {
  const t = I18N[lang] || I18N.en;
  document.getElementById('title').textContent = t.title;
  document.getElementById('subtitle').textContent = t.subtitle;
  document.getElementById('btn-download').textContent = t.download;
  document.getElementById('packagingTitle').textContent = t.packagingTitle;
  document.getElementById('packagingDesc').textContent = t.packagingDesc;
  document.getElementById('btn-download-packaging').textContent = t.packagingDownload;
  document.getElementById('backLink').textContent = t.back;
  document.getElementById('instructions').textContent = t.instructions(totalCards);
  document.getElementById('packInfo').textContent = t.packInfo(totalCards);
  const status = document.getElementById('status');
  if (status && !status.textContent) status.textContent = t.statusReady;
}

async function ensureJSZip() {
  if (window.JSZip) return window.JSZip;
  await new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
    s.onload = resolve;
    s.onerror = () => reject(new Error('Failed to load JSZip'));
    document.head.appendChild(s);
  });
  return window.JSZip;
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function downloadPackagingZip() {
  if (exportBusy) return;

  const lang = (document.getElementById('lang') || {}).value || 'en';
  const t = I18N[lang] || I18N.en;
  const statusEl = document.getElementById('status');

  setExportBusy(true, lang === 'zh' ? '正在打包…' : 'Packaging…');
  try {
    const JSZip = await ensureJSZip();
    const zip = new JSZip();

    let manifest;
    try {
      const res = await fetch('./packaging/manifest.json', { cache: 'no-cache' });
      manifest = await res.json();
    } catch (_) {
      manifest = [];
    }

    const files = Array.isArray(manifest) ? manifest.map(String).filter(Boolean) : [];
    const safeFiles = files.filter((p) => !p.includes('..') && !p.startsWith('/') && !/^[a-zA-Z]+:/.test(p));

    if (safeFiles.length === 0) {
      if (statusEl) statusEl.textContent = lang === 'zh' ? '未找到包装文件（请先上传并更新 packaging/manifest.json）' : 'No packaging files found (please upload files and update packaging/manifest.json).';
      return;
    }

    for (let i = 0; i < safeFiles.length; i++) {
      const rel = safeFiles[i];
      if (statusEl) statusEl.textContent = (lang === 'zh') ? `正在下载文件… ${i + 1}/${safeFiles.length}` : `Downloading files… ${i + 1}/${safeFiles.length}`;

      const res = await fetch(`./packaging/${encodeURI(rel).replace(/%2F/g, '/')}`, { cache: 'no-cache' });
      if (!res.ok) continue;
      const blob = await res.blob();
      zip.file(rel, blob);

      if (i % 6 === 0) {
        await new Promise(r => setTimeout(r, 0));
      }
    }

    if (statusEl) statusEl.textContent = (lang === 'zh') ? '正在生成 ZIP…' : 'Generating ZIP…';
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    triggerDownload(zipBlob, 'tech-taboo-packaging-designs.zip');
    if (statusEl) statusEl.textContent = t.statusDone;
  } catch (_) {
    if (statusEl) statusEl.textContent = t.statusError;
  } finally {
    setExportBusy(false);
  }
}

async function exportAllPngZip() {
  if (exportBusy) return;

  const lang = (document.getElementById('lang') || {}).value || 'en';
  const t = I18N[lang] || I18N.en;

  const pairs = buildVarietyPackPairs();
  const total = pairs.length;

  const statusEl = document.getElementById('status');

  setExportBusy(true, lang === 'zh' ? '正在导出…' : 'Exporting…');
  try {
    const { savePNGsAsZip } = await import('./lib/exporters.js');

    let techybaraImages;
    try {
      techybaraImages = await preloadTechybaraImages();
    } catch (_) {
      techybaraImages = {
        teacher: './techybara/teacher.png',
        peekOut: './techybara/peek out.png',
      };
    }

    const items = [];
    for (let i = 0; i < pairs.length; i++) {
      if (statusEl) statusEl.textContent = t.statusWorking(i + 1, total);

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
      });

      items.push({ name: `card-${i + 1}.svg`, markup: svg });

      if (i % 8 === 0) {
        await new Promise(r => setTimeout(r, 0));
      }
    }

    await savePNGsAsZip(items, 'tech-taboo-variety-pack-png.zip', 610, 910);
    if (statusEl) statusEl.textContent = t.statusDone;
  } catch (_) {
    if (statusEl) statusEl.textContent = t.statusError;
  } finally {
    setExportBusy(false);
  }
}

function init() {
  const pairs = buildVarietyPackPairs();
  const totalCards = pairs.length;

  const langSel = document.getElementById('lang');
  const lang = (langSel && langSel.value) || 'en';
  setText(lang, totalCards);

  if (langSel) {
    langSel.addEventListener('change', () => {
      setText(langSel.value || 'en', totalCards);
    });
  }

  const btn = document.getElementById('btn-download');
  if (btn) btn.addEventListener('click', exportAllPngZip);

  const btnPackaging = document.getElementById('btn-download-packaging');
  if (btnPackaging) btnPackaging.addEventListener('click', downloadPackagingZip);

  const statusEl = document.getElementById('status');
  if (statusEl) statusEl.textContent = (I18N[lang] || I18N.en).statusReady;
}

init();
