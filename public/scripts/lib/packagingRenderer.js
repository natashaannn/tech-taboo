import { tabooList } from "../data/tabooList.js";
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_TEXT_COLORS, CATEGORY_THEME_NAMES } from "./categories.js";
import { generateSVG } from "./generateSVG.js";

export const PACKAGING_PANEL_MM = {
  lidTop: { width: 66, height: 95 },
  longSide: { width: 95, height: 29.4 },
  shortSide: { width: 29.4, height: 66 },
};

export const CATEGORY_DESCRIPTIONS = {
  "General": "A card game for broad, cross-functional technology conversations.",
  "Software Engineering": "A card game for coding, systems, APIs, and software delivery.",
  "Data": "A card game for analytics, pipelines, and data-driven decision making.",
  "AI": "A card game for practical AI, models, prompts, and intelligent workflows.",
  "Product Management": "A card game for strategy, prioritization, and product outcomes.",
  "Data Structures & Algorithms": "A card game for algorithms, complexity, and interview fundamentals.",
  "System Design": "A card game for scalable architecture and distributed system tradeoffs.",
  "Game Development": "A card game for engines, gameplay systems, and interactive development.",
  "DevOps": "A card game for automation, deployment, observability, and reliability.",
  "Cybersecurity": "A card game for threats, defenses, and secure engineering practices.",
  "UX Design": "A card game for user research, interaction design, and usability.",
  "Responsible Tech": "A card game for ethics, privacy, trust, and sustainable technology.",
};

export const PACKAGING_VERSIONS = {
  VARIETY_PACK: {
    label: "Variety Pack",
    categories: ["General", "AI", "Software Engineering", "Product Management"],
    description: "A card game for a broad mix of core tech, AI, engineering, and product topics.",
  },
  SOFTWARE_INTERVIEW_EXTENSION: {
    label: "Software Interview Prep",
    categories: ["Data Structures & Algorithms", "System Design"],
    description: "A card game for software interview preparation across algorithms and system design.",
  },
  DEVSEC_PACK: {
    label: "DevSecOps Pack",
    categories: ["DevOps", "Cybersecurity"],
    description: "A card game for secure delivery, operations, and cyber defense discussions.",
  },
  PRODUCT_EXPERIENCE_PACK: {
    label: "Product Pack",
    categories: ["Product Management", "UX Design"],
    description: "A card game for product strategy and user experience conversations.",
  },
  DATA_AI_PACK: {
    label: "Data + AI Pack",
    categories: ["Data", "AI"],
    description: "A card game for data foundations and applied AI concepts.",
  },
  ENGINEERING_GAME_PACK: {
    label: "Engineering + Game Dev Pack",
    categories: ["Software Engineering", "Game Development"],
    description: "A card game for software craftsmanship and game development techniques.",
  },
};

export const PACKAGING_SELECTIONS = [
  ...Object.entries(PACKAGING_VERSIONS).map(([key, value]) => ({ key, label: value.label, type: "version" })),
  ...CATEGORIES.filter((category) => !Object.values(PACKAGING_VERSIONS).some((version) => version.categories.includes(category)))
    .map((category) => ({ key: category, label: category, type: "category" })),
];

function wrapWords(text, maxCharsPerLine, maxLines = 3) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxCharsPerLine || !current) {
      current = next;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);

  if (lines.length <= maxLines) return lines;
  const trimmed = lines.slice(0, maxLines);
  const last = trimmed[maxLines - 1];
  trimmed[maxLines - 1] = last.length > maxCharsPerLine - 3
    ? `${last.slice(0, Math.max(0, maxCharsPerLine - 3))}...`
    : `${last}...`;
  return trimmed;
}

function getEvenSamplesFromCategory(category, targetCount) {
  const pool = tabooList.filter((item) => item.category === category);
  if (pool.length === 0) return [];

  let count = Math.min(targetCount, pool.length);
  if (count % 2 !== 0) count -= 1;
  if (count < 2) return pool.length >= 2 ? pool.slice(0, 2) : pool.slice(0, 1);

  const step = Math.max(1, Math.floor(pool.length / count));
  const picked = [];
  let idx = 0;
  while (picked.length < count) {
    picked.push(pool[idx % pool.length]);
    idx += step;
  }
  return picked;
}

function buildCategorySamples(categories, options = {}) {
  const targetCategories = Array.isArray(categories) ? categories : [categories];
  const { onePerCategory = false, singleCategoryCount = 6 } = options;

  if (onePerCategory) {
    return targetCategories
      .map((category) => {
        const pool = tabooList.filter((item) => item.category === category);
        return pool[0] || null;
      })
      .filter(Boolean);
  }

  if (targetCategories.length === 1) {
    return getEvenSamplesFromCategory(targetCategories[0], singleCategoryCount);
  }

  const samples = [];
  targetCategories.forEach((category) => {
    samples.push(...getEvenSamplesFromCategory(category, 2));
  });
  return samples;
}

function buildArcPositions(cardCount, topX, topY) {
  if (cardCount <= 0) return [];

  const centerX = topX + 33;
  const spacing = 13;
  const startX = centerX - (((cardCount - 1) * spacing) / 2);
  const baseY = topY + 60;

  return Array.from({ length: cardCount }).map((_, idx) => {
    const t = cardCount === 1 ? 0 : ((idx / (cardCount - 1)) * 2) - 1;
    return {
      x: startX + (idx * spacing) - 17.5,
      y: baseY + (Math.abs(t) * 10),
      rotate: t * 36,
    };
  });
}

function resolveAssetUrl(path) {
  if (typeof window === "undefined" || !window.location) return path;
  try {
    return new URL(path, window.location.href).href;
  } catch (_) {
    return path;
  }
}

const TECHYBARA_IMAGE_CACHE = {
  teacher: null,
  peekOut: null,
};
const FONT_DATA_CACHE = {
  gaegu: null,
  mono: null,
};

function blobToDataUri(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function fetchImageAsDataUri(path) {
  const absoluteUrl = resolveAssetUrl(path);
  const response = await fetch(absoluteUrl, { cache: "force-cache" });
  if (!response.ok) throw new Error(`Failed to fetch asset: ${absoluteUrl}`);
  const blob = await response.blob();
  return blobToDataUri(blob);
}

async function ensureEmbeddedTechybaraImages() {
  if (!TECHYBARA_IMAGE_CACHE.teacher) {
    TECHYBARA_IMAGE_CACHE.teacher = await fetchImageAsDataUri("./techybara/teacher.png");
  }
  if (!TECHYBARA_IMAGE_CACHE.peekOut) {
    TECHYBARA_IMAGE_CACHE.peekOut = await fetchImageAsDataUri("./techybara/peek out.png");
  }
  return TECHYBARA_IMAGE_CACHE;
}

async function ensureEmbeddedFonts() {
  if (!FONT_DATA_CACHE.gaegu) {
    FONT_DATA_CACHE.gaegu = await fetchImageAsDataUri("./fonts/Gaegu/Gaegu-Bold.ttf");
  }
  if (!FONT_DATA_CACHE.mono) {
    FONT_DATA_CACHE.mono = await fetchImageAsDataUri("./fonts/monospace/Monospace.ttf");
  }
  return FONT_DATA_CACHE;
}

async function createCardThumbnailDataUri(item, fallbackCategory, fallbackColor) {
  const itemCategory = item?.category || fallbackCategory;
  const categoryColor = CATEGORY_COLORS[itemCategory] || fallbackColor;
  const word = String(item?.word || "").trim() || itemCategory;
  const taboos = Array.isArray(item?.taboo) && item.taboo.length > 0
    ? item.taboo.slice(0, 5)
    : ["Code", "Cloud", "Deploy", "Scale", "Debug"];
  const embeddedImages = await ensureEmbeddedTechybaraImages();

  const cardSvg = generateSVG(word, taboos, word, taboos, {
    baseColor: categoryColor,
    background: categoryColor,
    strokeColor: categoryColor,
    category: itemCategory,
    teacherImage: embeddedImages.teacher,
    peekOutImage: embeddedImages.peekOut,
    showBleed: false,
  });
  return `data:image/svg+xml;utf8,${encodeURIComponent(cardSvg)}`;
}

async function buildCardSampleMarkup(item, x, y, rotate, cardWidth, cardHeight, fallbackCategory, fallbackColor) {
  const href = await createCardThumbnailDataUri(item, fallbackCategory, fallbackColor);
  const cx = x + (cardWidth / 2);
  const cy = y + (cardHeight / 2);
  return `<image href="${href}" x="${x}" y="${y}" width="${cardWidth}" height="${cardHeight}" transform="rotate(${rotate} ${cx} ${cy})" preserveAspectRatio="xMidYMid meet" />`;
}

export async function createPackagingSvg({
  category,
  version = "v1.0",
  description = "",
  includeBorders = true,
} = {}) {
  const selectionKey = category || "General";
  const selectedVersion = PACKAGING_VERSIONS[selectionKey] || null;
  const activeCategories = selectedVersion ? selectedVersion.categories : [selectionKey];
  const editionLabel = selectedVersion ? selectedVersion.label : selectionKey;
  const primaryCategory = activeCategories[0] || "General";
  const editionName = editionLabel.toUpperCase();
  const topEditionName = editionLabel;
  const categoryColor = CATEGORY_COLORS[primaryCategory] || "#DCECF0";
  const categoryTextColor = CATEGORY_TEXT_COLORS[primaryCategory] || "#23555F";
  const uniqueThemeNames = Array.from(new Set(
    activeCategories.map((cat) => CATEGORY_THEME_NAMES[cat]).filter(Boolean),
  ));
  const themeNamesText = uniqueThemeNames.join(", ");
  const background = "#fff3c2";
  const techieColor = "#9f7e5f";
  const tabooColor = "#8dbbb6";
  const defaultDescription = selectedVersion ? selectedVersion.description : CATEGORY_DESCRIPTIONS[primaryCategory];
  const desc = (description || defaultDescription || "").toUpperCase();

  const sidePanelWidth = PACKAGING_PANEL_MM.shortSide.width;
  const sidePanelHeight = PACKAGING_PANEL_MM.longSide.height;
  const totalWidth = PACKAGING_PANEL_MM.lidTop.width + (sidePanelWidth * 2);
  const totalHeight = PACKAGING_PANEL_MM.lidTop.height + (sidePanelHeight * 2);
  const topX = sidePanelWidth;
  const topY = sidePanelHeight;
  const leftX = 0;
  const rightX = topX + PACKAGING_PANEL_MM.lidTop.width;
  const topSideY = 0;
  const bottomSideY = topY + PACKAGING_PANEL_MM.lidTop.height;

  const descriptionLines = wrapWords(desc, 30, 3);
  const longSideCategoryLines = wrapWords(editionName, 8, 4);
  const topPaletteLines = wrapWords(`Card palette inspired by VSCode themes: ${themeNamesText}`, 56, 3);
  const sideDescriptionText = (description || defaultDescription || "").trim();
  const samples = buildCategorySamples(activeCategories, {
    onePerCategory: selectionKey === "VARIETY_PACK",
    singleCategoryCount: primaryCategory === "Responsible Tech" ? 4 : 6,
  });
  const cardPositions = buildArcPositions(samples.length, topX, topY);

  const sampleCardsMarkup = await Promise.all(
    cardPositions.map((pos, idx) => buildCardSampleMarkup(samples[idx], pos.x, pos.y, pos.rotate, 35, 52.4, primaryCategory, categoryColor))
  );
  const embeddedFonts = await ensureEmbeddedFonts();
  const longPool = tabooList.filter((item) => activeCategories.includes(item.category));
  const longSideLeftItem = longPool[0] || samples[0];
  const longSideRightItem = longPool[Math.floor(longPool.length / 2)] || samples[1] || samples[0];
  const longSideCardsMarkup = await Promise.all([
    buildCardSampleMarkup(longSideLeftItem, leftX - 11, topY + 1, -90, 30, 44, primaryCategory, categoryColor),
    buildCardSampleMarkup(longSideRightItem, rightX + 10, topY + 1, 90, 30, 44, primaryCategory, categoryColor),
  ]);
  const leftLongCenterX = leftX + (PACKAGING_PANEL_MM.longSide.height / 2);
  const rightLongCenterX = rightX + (PACKAGING_PANEL_MM.longSide.height / 2);
  const longSideCenterY = topY + (PACKAGING_PANEL_MM.longSide.width / 2);
  const longSideDescCenterY = longSideCenterY;
  const longSideLabelCenterY = topY + 55;
  const topPillWidth = Math.max(16, (topEditionName.length * 1.8) + 8);
  const topPillX = topX + ((PACKAGING_PANEL_MM.lidTop.width - topPillWidth) / 2);
  const topPillTextX = topPillX + (topPillWidth / 2);
  const palettePillWidth = 62;
  const palettePillX = topX + ((PACKAGING_PANEL_MM.lidTop.width - palettePillWidth) / 2);
  const palettePillHeight = 2.8 + (topPaletteLines.length * 2.6);
  const shortPillCenterX = topX + 49;
  const shortPillBaseWidth = Math.max(16, (topEditionName.length * 1.45) + 6);
  const shortPillWidth = Math.max(8, shortPillBaseWidth / 2);
  const shortPillX = shortPillCenterX - (shortPillWidth / 2);
  const shortPillHeight = 3.05;
  const shortDescPillWidth = 58;
  const shortDescPillX = topX + ((PACKAGING_PANEL_MM.shortSide.height - shortDescPillWidth) / 2);

  const panelAttrs = includeBorders ? 'class="panel-stroke"' : 'stroke="none"';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}mm" height="${totalHeight}mm" viewBox="0 0 ${totalWidth} ${totalHeight}">
  <defs>
    <style><![CDATA[
      @font-face {
        font-family: 'Gaegu';
        src: url('${embeddedFonts.gaegu || resolveAssetUrl("./fonts/Gaegu/Gaegu-Bold.ttf")}') format('truetype');
        font-style: normal;
        font-weight: 700;
      }
      @font-face {
        font-family: 'Monospace';
        src: url('${embeddedFonts.mono || resolveAssetUrl("./fonts/monospace/Monospace.ttf")}') format('truetype');
        font-style: normal;
        font-weight: 400;
      }
      .gaegu { font-family: 'Gaegu', cursive; }
      .mono { font-family: 'Monospace', monospace; }
      .panel-stroke { stroke: rgba(8, 20, 24, 0.48); stroke-width: 0.35; }
    ]]></style>
    <filter id="titleLift" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="5" stdDeviation="2" flood-color="#6b7280" flood-opacity="0.32" />
    </filter>
    <clipPath id="lidTopClip">
      <rect x="${topX}" y="${topY}" width="${PACKAGING_PANEL_MM.lidTop.width}" height="${PACKAGING_PANEL_MM.lidTop.height}" />
    </clipPath>
    <clipPath id="lidTopAndLongSidesClip">
      <rect x="${topX}" y="${topY}" width="${PACKAGING_PANEL_MM.lidTop.width}" height="${PACKAGING_PANEL_MM.lidTop.height}" />
      <rect x="${leftX}" y="${topY}" width="${PACKAGING_PANEL_MM.longSide.height}" height="${PACKAGING_PANEL_MM.longSide.width}" />
      <rect x="${rightX}" y="${topY}" width="${PACKAGING_PANEL_MM.longSide.height}" height="${PACKAGING_PANEL_MM.longSide.width}" />
    </clipPath>
    <clipPath id="leftLongSideClip">
      <rect x="${leftX}" y="${topY}" width="${PACKAGING_PANEL_MM.longSide.height}" height="${PACKAGING_PANEL_MM.longSide.width}" />
    </clipPath>
    <clipPath id="rightLongSideClip">
      <rect x="${rightX}" y="${topY}" width="${PACKAGING_PANEL_MM.longSide.height}" height="${PACKAGING_PANEL_MM.longSide.width}" />
    </clipPath>
  </defs>

  <rect x="${topX}" y="${topY}" width="${PACKAGING_PANEL_MM.lidTop.width}" height="${PACKAGING_PANEL_MM.lidTop.height}" fill="${background}" ${panelAttrs} />
  <rect x="${topX}" y="${topSideY}" width="${PACKAGING_PANEL_MM.shortSide.height}" height="${PACKAGING_PANEL_MM.shortSide.width}" fill="${background}" ${panelAttrs} />
  <rect x="${topX}" y="${bottomSideY}" width="${PACKAGING_PANEL_MM.shortSide.height}" height="${PACKAGING_PANEL_MM.shortSide.width}" fill="${background}" ${panelAttrs} />
  <rect x="${leftX}" y="${topY}" width="${PACKAGING_PANEL_MM.longSide.height}" height="${PACKAGING_PANEL_MM.longSide.width}" fill="${background}" ${panelAttrs} />
  <rect x="${rightX}" y="${topY}" width="${PACKAGING_PANEL_MM.longSide.height}" height="${PACKAGING_PANEL_MM.longSide.width}" fill="${background}" ${panelAttrs} />

  <image href="./ragtech-logo-rectangle.png" x="${topX + 2}" y="${topY + 2}" width="16" height="6" preserveAspectRatio="xMidYMid meet" />
  <text x="${topX + 34}" y="${topY + 6.9}" text-anchor="middle" fill="${techieColor}" font-size="2.5" class="gaegu">Great for parties and events!</text>
  <g transform="rotate(25 ${topX + 55} ${topY + 6.9})">
    <rect x="${topX + 50}" y="${topY + 4}" width="15.5" height="5.8" rx="2.9" fill="${categoryTextColor}" />
    <text x="${topX + 57.5}" y="${topY + 7.7}" text-anchor="middle" fill="${categoryColor}" font-size="2.2" font-weight="800" class="mono">2&gt; players</text>
  </g>

  <g filter="url(#titleLift)">
    <text x="${topX + 33}" y="${topY + 23}" text-anchor="middle" fill="${techieColor}" font-size="14.0" font-weight="900" letter-spacing="0.55" class="gaegu">TECHIE</text>
    <text x="${topX + 33}" y="${topY + 34.8}" text-anchor="middle" fill="${tabooColor}" font-size="14.0" font-weight="900" letter-spacing="0.55" class="gaegu">TABOO</text>
  </g>

  <g fill="${techieColor}" font-size="3.1" text-anchor="middle" class="gaegu">
    ${descriptionLines.map((line, idx) => `<text x="${topX + 33}" y="${topY + 40 + (idx * 4.1)}">${line}</text>`).join("")}
  </g>

  <rect x="${topPillX}" y="${topY + 50}" width="${topPillWidth}" height="6.6" rx="3.3" fill="${categoryColor}" />
  <text x="${topPillTextX}" y="${topY + 54.3}" text-anchor="middle" fill="${categoryTextColor}" font-size="3.2" font-weight="800" class="mono">${topEditionName}</text>

  <g clip-path="url(#lidTopAndLongSidesClip)">
    ${sampleCardsMarkup.join("")}
  </g>
  <rect x="${palettePillX}" y="${topY + 87.2}" width="${palettePillWidth}" height="${palettePillHeight}" rx="2.1" fill="rgba(255,255,255,0.82)" />
  <g fill="${techieColor}" font-size="1.95" text-anchor="middle" class="gaegu">
    ${topPaletteLines.map((line, idx) => `<text x="${palettePillX + (palettePillWidth / 2)}" y="${topY + 89.4 + (idx * 2.45)}">${line}</text>`).join("")}
  </g>

  <g class="gaegu" transform="rotate(180 ${topX + (PACKAGING_PANEL_MM.shortSide.height / 2)} ${topSideY + (PACKAGING_PANEL_MM.shortSide.width / 2)})">
    <image href="./ragtech-logo-rectangle.png" x="${topX + 2}" y="${topSideY + 1}" width="14" height="5.3" preserveAspectRatio="xMidYMid meet" />
    <text x="${topX + 4}" y="${topSideY + 15.2}" fill="${techieColor}" font-size="11.0" font-weight="900">TECHIE</text>
    <text x="${topX + 4}" y="${topSideY + 24.4}" fill="${tabooColor}" font-size="11.0" font-weight="900">TABOO</text>
    <image href="./techybara/techybaras-playing-card-game.png" x="${topX + 38}" y="${topSideY + 0.4}" width="21" height="21" preserveAspectRatio="xMidYMid meet" />
    <rect x="${shortPillX}" y="${topSideY + 20.0}" width="${shortPillWidth}" height="${shortPillHeight}" rx="${shortPillHeight / 2}" fill="${categoryColor}" />
    <text x="${shortPillCenterX}" y="${topSideY + 22.1}" text-anchor="middle" fill="${categoryTextColor}" font-size="1.25" font-weight="800" class="mono">${topEditionName}</text>
    <rect x="${shortDescPillX}" y="${topSideY + 25.0}" width="${shortDescPillWidth}" height="3.6" rx="1.8" fill="rgba(255,255,255,0.82)" />
    <text x="${topX + (PACKAGING_PANEL_MM.shortSide.height / 2)}" y="${topSideY + 27.3}" text-anchor="middle" fill="${techieColor}" font-size="1.25" textLength="${shortDescPillWidth - 3}" lengthAdjust="spacingAndGlyphs" class="gaegu">${sideDescriptionText}</text>
  </g>

  <g class="gaegu">
    <image href="./ragtech-logo-rectangle.png" x="${topX + 2}" y="${bottomSideY + 1}" width="14" height="5.3" preserveAspectRatio="xMidYMid meet" />
    <text x="${topX + 4}" y="${bottomSideY + 14.5}" fill="${techieColor}" font-size="11.0" font-weight="900">TECHIE</text>
    <text x="${topX + 4}" y="${bottomSideY + 23.7}" fill="${tabooColor}" font-size="11.0" font-weight="900">TABOO</text>
    <image href="./techybara/techybaras-playing-card-game.png" x="${topX + 38}" y="${bottomSideY + 0.4}" width="21" height="21" preserveAspectRatio="xMidYMid meet" />
    <rect x="${shortPillX}" y="${bottomSideY + 20.0}" width="${shortPillWidth}" height="${shortPillHeight}" rx="${shortPillHeight / 2}" fill="${categoryColor}" />
    <text x="${shortPillCenterX}" y="${bottomSideY + 22.1}" text-anchor="middle" fill="${categoryTextColor}" font-size="1.25" font-weight="800" class="mono">${topEditionName}</text>
    <rect x="${shortDescPillX}" y="${bottomSideY + 25.0}" width="${shortDescPillWidth}" height="3.6" rx="1.8" fill="rgba(255,255,255,0.82)" />
    <text x="${topX + (PACKAGING_PANEL_MM.shortSide.height / 2)}" y="${bottomSideY + 27.3}" text-anchor="middle" fill="${techieColor}" font-size="1.25" textLength="${shortDescPillWidth - 3}" lengthAdjust="spacingAndGlyphs" class="gaegu">${sideDescriptionText}</text>
  </g>

  <g clip-path="url(#leftLongSideClip)">
    ${longSideCardsMarkup[0]}
  </g>
  <g clip-path="url(#rightLongSideClip)">
    ${longSideCardsMarkup[1]}
  </g>

  <g clip-path="url(#leftLongSideClip)" class="gaegu" fill="${techieColor}">
    ${longSideCategoryLines.map((line, idx) => `<text x="${leftLongCenterX + 5}" y="${longSideLabelCenterY + ((idx - ((longSideCategoryLines.length - 1) / 2)) * 4.3)}" font-size="4.3" text-anchor="middle" transform="rotate(90 ${leftLongCenterX} ${longSideLabelCenterY})">${line}</text>`).join("")}
    <g transform="rotate(90 ${leftX + 1.8} ${longSideDescCenterY})">
      <rect x="${leftX - 8}" y="${longSideDescCenterY - 5.6}" width="59.2" height="5.2" rx="2.6" fill="rgba(255,255,255,0.82)" />
      <text x="${leftX + 20.8}" y="${longSideDescCenterY - 2.6}" text-anchor="middle" font-size="2.0" textLength="56.2" lengthAdjust="spacingAndGlyphs">${sideDescriptionText}</text>
    </g>
  </g>

  <g clip-path="url(#rightLongSideClip)" class="gaegu" fill="${techieColor}">
    ${longSideCategoryLines.map((line, idx) => `<text x="${rightLongCenterX - 5}" y="${longSideLabelCenterY + ((idx - ((longSideCategoryLines.length - 1) / 2)) * 4.3)}" font-size="4.3" text-anchor="middle" transform="rotate(-90 ${rightLongCenterX} ${longSideLabelCenterY})">${line}</text>`).join("")}
    <g transform="rotate(-90 ${rightX + (PACKAGING_PANEL_MM.longSide.height - 1.8)} ${longSideDescCenterY})">
      <rect x="${rightX + (PACKAGING_PANEL_MM.longSide.height - 51.4)}" y="${longSideDescCenterY - 5.6}" width="59.2" height="5.2" rx="2.6" fill="rgba(255,255,255,0.82)" />
      <text x="${rightX + (PACKAGING_PANEL_MM.longSide.height - 20.8)}" y="${longSideDescCenterY - 2.6}" text-anchor="middle" font-size="2.0" textLength="56.2" lengthAdjust="spacingAndGlyphs">${sideDescriptionText}</text>
    </g>
  </g>
</svg>`;
}
