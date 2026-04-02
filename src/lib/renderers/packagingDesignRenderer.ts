import { tabooList } from "../data/tabooList";
import {
  CATEGORY_COLORS,
  CATEGORY_TEXT_COLORS,
  CATEGORY_DESCRIPTIONS,
} from "../constants/categories";
import { generateCardSVG } from "./cardRenderer";
import {
  PACKAGING_EDITIONS,
  VERSION_DEFINITIONS,
  getEditionCounts,
  getEditionLabel,
  DEFAULT_EDITION_ID,
} from "../constants/editions";
import {
  PACKAGING_PANEL_MM,
  PACKAGING_SELECTIONS,
} from "../constants/packaging";

// Re-export for backward compatibility
export {
  CATEGORY_DESCRIPTIONS,
  PACKAGING_EDITIONS as PACKAGING_VERSIONS,
  PACKAGING_PANEL_MM,
  PACKAGING_SELECTIONS,
  VERSION_DEFINITIONS,
  getEditionCounts as getVersionCounts,
  getEditionLabel as getVersionLabel,
  DEFAULT_EDITION_ID as DEFAULT_VERSION_ID,
  createPackagingSVG as createPackagingSvg,
};

function getEvenSamplesFromCategory(category: string, targetCount: number) {
  const pool = tabooList.filter((item) => item.category === category);
  if (pool.length === 0) return [];

  let count = Math.min(targetCount, pool.length);

  // For odd counts, just take the count as-is (we need 1 card sometimes)
  if (count < 1) return pool.length > 0 ? [pool[0]] : [];

  const step = Math.max(1, Math.floor(pool.length / count));
  const picked = [];
  let idx = 0;
  while (picked.length < count) {
    picked.push(pool[idx % pool.length]);
    idx += step;
  }
  return picked;
}

function buildCategorySamples(categories: string[]) {
  const targetCategories = Array.isArray(categories)
    ? categories
    : [categories];

  // Always return exactly 4 cards
  if (targetCategories.length === 1) {
    // Single category - get 4 cards from that category
    return getEvenSamplesFromCategory(targetCategories[0], 4);
  } else if (targetCategories.length === 2) {
    // Two categories - get 2 cards from each
    return [
      ...getEvenSamplesFromCategory(targetCategories[0], 2),
      ...getEvenSamplesFromCategory(targetCategories[1], 2),
    ];
  } else if (targetCategories.length === 3) {
    // Three categories - get 2 from first, 1 from second, 1 from third
    return [
      ...getEvenSamplesFromCategory(targetCategories[0], 2),
      ...getEvenSamplesFromCategory(targetCategories[1], 1),
      ...getEvenSamplesFromCategory(targetCategories[2], 1),
    ];
  } else if (targetCategories.length >= 4) {
    // Four or more categories - get 1 from first 4 categories
    return [
      ...getEvenSamplesFromCategory(targetCategories[0], 1),
      ...getEvenSamplesFromCategory(targetCategories[1], 1),
      ...getEvenSamplesFromCategory(targetCategories[2], 1),
      ...getEvenSamplesFromCategory(targetCategories[3], 1),
    ];
  }

  // Fallback
  return getEvenSamplesFromCategory(targetCategories[0], 4);
}

function buildArcPositions(cardCount: number, topX: number, topY: number) {
  if (cardCount <= 0) return [];

  const centerX = topX + PACKAGING_PANEL_MM.lidTop.width / 2;
  const spacing = 13;
  const startX = centerX - ((cardCount - 1) * spacing) / 2;
  const baseY = topY + 60;

  return Array.from({ length: cardCount }).map((_, idx) => {
    const t = cardCount === 1 ? 0 : (idx / (cardCount - 1)) * 2 - 1;
    return {
      x: startX + idx * spacing - 17.5,
      y: baseY + Math.abs(t) * 10,
      rotate: t * 36,
    };
  });
}

function resolveAssetUrl(url: string): string {
  if (typeof window === "undefined") return url;
  try {
    return new URL(url, window.location.href).href;
  } catch (_) {
    return url;
  }
}

async function createCardThumbnailDataUri(
  item: (typeof tabooList)[0] | null,
  fallbackCategory: string,
  fallbackColor: string,
) {
  try {
    const itemCategory = item?.category || fallbackCategory;
    const categoryColor =
      CATEGORY_COLORS[itemCategory as keyof typeof CATEGORY_COLORS] ||
      fallbackColor;
    const word = String(item?.word || "").trim() || itemCategory;
    const taboos =
      Array.isArray(item?.taboo) && item.taboo.length > 0
        ? item.taboo.slice(0, 5)
        : ["Code", "Cloud", "Deploy", "Scale", "Debug"];

    // Use the actual card renderer to generate the card
    const cardSvg = await generateCardSVG(
      {
        id: "",
        top: {
          index: -1,
          word: word,
          taboo: taboos,
          explanation: "",
          category: itemCategory,
        },
        bottom: {
          index: -1,
          word: word,
          taboo: taboos,
          explanation: "",
          category: itemCategory,
        },
        createdAt: new Date(),
      },
      {
        baseColor: categoryColor,
        background: categoryColor,
        strokeColor: categoryColor,
        category: itemCategory,
      },
    );

    // Convert SVG to data URI
    return `data:image/svg+xml;utf8,${encodeURIComponent(cardSvg)}`;
  } catch (error) {
    console.error("Error in createCardThumbnailDataUri:", error);
    // Return a simple fallback SVG
    return `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="${fallbackColor}"/></svg>`)}`;
  }
}

async function buildCardSampleMarkup(
  item: (typeof tabooList)[0] | null,
  x: number,
  y: number,
  rotate: number,
  width: number,
  height: number,
  category: string,
  color: string,
) {
  const dataUri = await createCardThumbnailDataUri(item, category, color);
  return `<image x="${x}" y="${y}" width="${width}" height="${height}" transform="rotate(${rotate} ${x + width / 2} ${y + height / 2})" href="${dataUri}" />`;
}

function wrapWords(text: string, maxCharsPerLine: number, maxLines = 3) {
  const words = String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
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
  trimmed[maxLines - 1] =
    last.length > maxCharsPerLine - 3
      ? `${last.slice(0, Math.max(0, maxCharsPerLine - 3))}...`
      : `${last}...`;
  return trimmed;
}

async function ensurePackagingImages() {
  const images = {
    ragtechLogo: null as string | null,
    techybaraPlaying: null as string | null,
  };

  if (!images.ragtechLogo) {
    images.ragtechLogo = await fetchImageAsDataUri(
      "./ragtech-logo-rectangle.png",
    );
  }
  if (!images.techybaraPlaying) {
    images.techybaraPlaying = await fetchImageAsDataUri(
      "./techybara/techybaras-playing-card-game.png",
    );
  }

  return images;
}

async function fetchImageAsDataUri(path: string): Promise<string> {
  const absoluteUrl = resolveAssetUrl(path);
  const response = await fetch(absoluteUrl, { cache: "force-cache" });
  if (!response.ok) throw new Error(`Failed to fetch asset: ${absoluteUrl}`);
  const blob = await response.blob();
  return blobToDataUri(blob);
}

function blobToDataUri(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function createPackagingSVG(
  editionKey: string,
  options: {
    includeBorders?: boolean;
    useSystemFonts?: boolean; // Add option for PNG export
  } = {},
): Promise<string> {
  const { includeBorders = true, useSystemFonts = false } = options;
  const edition =
    PACKAGING_EDITIONS[editionKey as keyof typeof PACKAGING_EDITIONS];
  if (!edition) throw new Error(`Unknown edition: ${editionKey}`);

  const activeCategories = edition.categories;
  const primaryCategory = activeCategories[0];
  const editionLabel = edition.label;
  const editionName = editionLabel.toUpperCase();
  const topEditionName = editionLabel;
  const categoryColor =
    CATEGORY_COLORS[primaryCategory as keyof typeof CATEGORY_COLORS] ||
    "#DCECF0";
  const categoryTextColor =
    CATEGORY_TEXT_COLORS[
      primaryCategory as keyof typeof CATEGORY_TEXT_COLORS
    ] || "#23555F";
  const background = "#fff3c2";
  const techieColor = "#9f7e5f";
  const tabooColor = "#8dbbb6";
  const badgeBgColor =
    editionKey === "VARIETY_PACK" ? "#93bcb8" : categoryTextColor;
  const badgeTextColor =
    editionKey === "VARIETY_PACK" ? "#0A1F33" : categoryColor;
  const defaultDescription =
    edition.description ||
    CATEGORY_DESCRIPTIONS[
      primaryCategory as keyof typeof CATEGORY_DESCRIPTIONS
    ];
  const desc = (defaultDescription || "").toUpperCase();

  const sidePanelWidth = PACKAGING_PANEL_MM.shortSide.width;
  const sidePanelHeight = PACKAGING_PANEL_MM.longSide.height;
  const totalWidth = PACKAGING_PANEL_MM.lidTop.width + sidePanelWidth * 2;
  const totalHeight = PACKAGING_PANEL_MM.lidTop.height + sidePanelHeight * 2;
  const topX = sidePanelWidth;
  const topY = sidePanelHeight;
  const leftX = 0;
  const rightX = topX + PACKAGING_PANEL_MM.lidTop.width;
  const topSideY = 0;
  const bottomSideY = topY + PACKAGING_PANEL_MM.lidTop.height;

  const descriptionLines = wrapWords(desc, 30, 3);
  const longSideCategoryLines = wrapWords(editionName, 8, 4);
  const sideDescriptionText = (defaultDescription || "").trim();
  const longSideDescriptionLines = wrapWords(sideDescriptionText, 40, 3);

  const samples = buildCategorySamples(activeCategories);

  const cardPositions = buildArcPositions(samples.length, topX, topY);

  // Use system fonts for reliable PNG export or embedded fonts for preview
  let embeddedFonts = null;
  if (!useSystemFonts) {
    // Import only when needed
    const { ensurePackagingFonts } = await import("../utils/fontUtils");
    embeddedFonts = await ensurePackagingFonts();
  }

  // Load and embed images
  const embeddedImages = await ensurePackagingImages();

  // Add a small delay to ensure images are fully loaded
  await new Promise((resolve) => setTimeout(resolve, 100));

  const sampleCardsMarkup = await Promise.all(
    cardPositions.map((pos, idx) =>
      buildCardSampleMarkup(
        samples[idx],
        pos.x,
        pos.y,
        pos.rotate,
        35,
        52.4,
        primaryCategory,
        categoryColor,
      ),
    ),
  );

  const longPool = tabooList.filter((item) =>
    activeCategories.includes(item.category),
  );
  const longSideLeftItem = longPool[0] || samples[0];
  const longSideRightItem =
    longPool[Math.floor(longPool.length / 2)] || samples[1] || samples[0];

  const longSideCardsMarkup = await Promise.all([
    buildCardSampleMarkup(
      longSideLeftItem,
      leftX - 11,
      topY + 1,
      -90,
      30,
      44,
      primaryCategory,
      categoryColor,
    ),
    buildCardSampleMarkup(
      longSideRightItem,
      rightX + 10,
      topY + 1,
      90,
      30,
      44,
      primaryCategory,
      categoryColor,
    ),
  ]);

  const leftLongCenterX = leftX + PACKAGING_PANEL_MM.longSide.height / 2;
  const rightLongCenterX = rightX + PACKAGING_PANEL_MM.longSide.height / 2;
  const longSideCenterY = topY + PACKAGING_PANEL_MM.longSide.width / 2;
  const longSideDescCenterY = longSideCenterY;
  const longSideLabelCenterY = topY + 55;
  const topPillWidth = Math.max(16, topEditionName.length * 1.8 + 8);
  const topPillX = topX + (PACKAGING_PANEL_MM.lidTop.width - topPillWidth) / 2;
  const topPillTextX = topPillX + topPillWidth / 2;
  const shortPillCenterX = topX + 49;
  const shortPillBaseWidth = Math.max(16, topEditionName.length * 1.45 + 6);
  const shortPillWidth = Math.max(8, shortPillBaseWidth / 2);
  const shortPillX = shortPillCenterX - shortPillWidth / 2;
  const shortPillHeight = 3.05;

  const panelAttrs = includeBorders ? 'class="panel-stroke"' : 'stroke="none"';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}mm" height="${totalHeight}mm" viewBox="0 0 ${totalWidth} ${totalHeight}" shape-rendering="geometricPrecision" text-rendering="geometricPrecision">
  <defs>
    <style><![CDATA[
      ${
        useSystemFonts
          ? ""
          : `
      @font-face {
        font-family: 'Gaegu';
        src: url('${embeddedFonts?.gaegu || resolveAssetUrl("/assets/fonts/Gaegu/Gaegu-Bold.ttf")}') format('truetype');
        font-style: normal;
        font-weight: 700;
      }
      @font-face {
        font-family: 'Monospace';
        src: url('${embeddedFonts?.mono || resolveAssetUrl("/assets/fonts/monospace/Monospace.ttf")}') format('truetype');
        font-style: normal;
        font-weight: 400;
      }
      @font-face {
        font-family: 'Monospace';
        src: url('${embeddedFonts?.monoBold || embeddedFonts?.mono || resolveAssetUrl("/assets/fonts/monospace/MonospaceBold.ttf")}') format('truetype');
        font-style: normal;
        font-weight: 700;
      }
      `
      }
      .gaegu { font-family: ${useSystemFonts ? "'Comic Sans MS', 'Marker Felt', cursive, sans-serif" : "'Gaegu', cursive"}; }
      .mono { font-family: ${useSystemFonts ? "'Courier New', 'Monaco', monospace" : "'Monospace', monospace"}; }
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
  
  <image href="${embeddedImages.ragtechLogo}" x="${topX + 2}" y="${topY + 2}" width="16" height="6" preserveAspectRatio="xMidYMid meet" />
  <text x="${topX + 34}" y="${topY + 6.9}" text-anchor="middle" fill="${techieColor}" font-size="2.5" class="gaegu">Great for parties and events!</text>
  
  <g transform="rotate(25 ${topX + 55} ${topY + 6.9})">
    <rect x="${topX + 50}" y="${topY + 4}" width="15.5" height="5.8" rx="2.9" fill="${badgeBgColor}" />
    <text x="${topX + 57.5}" y="${topY + 7.7}" text-anchor="middle" fill="${badgeTextColor}" font-size="2.2" font-weight="800" class="mono">2+ players</text>
  </g>

  <g filter="url(#titleLift)">
    <text x="${topX + 33}" y="${topY + 23}" text-anchor="middle" fill="${techieColor}" font-size="14.0" font-weight="900" letter-spacing="0.55" class="gaegu">TECHIE</text>
    <text x="${topX + 33}" y="${topY + 34.8}" text-anchor="middle" fill="${tabooColor}" font-size="14.0" font-weight="900" letter-spacing="0.55" class="gaegu">TABOO</text>
  </g>

  <g fill="${techieColor}" font-size="3.1" text-anchor="middle" class="gaegu">
    ${descriptionLines.map((line, idx) => `<text x="${topX + 33}" y="${topY + 40 + idx * 4.1}">${line}</text>`).join("")}
  </g>

  <rect x="${topPillX}" y="${topY + 50}" width="${topPillWidth}" height="6.6" rx="3.3" fill="${categoryColor}" />
  <text x="${topPillTextX}" y="${topY + 54.3}" text-anchor="middle" fill="${categoryTextColor}" font-size="3.2" font-weight="800" class="mono">${topEditionName}</text>
  
  <g clip-path="url(#lidTopAndLongSidesClip)">
    ${sampleCardsMarkup.join("")}
  </g>

  <g class="gaegu" transform="rotate(180 ${topX + PACKAGING_PANEL_MM.shortSide.height / 2} ${topSideY + PACKAGING_PANEL_MM.shortSide.width / 2})">
    <image href="${embeddedImages.ragtechLogo}" x="${topX + 2}" y="${topSideY + 1}" width="14" height="5.3" preserveAspectRatio="xMidYMid meet" />
    <text x="${topX + 4}" y="${topSideY + 15.2}" fill="${techieColor}" font-size="11.0" font-weight="900">TECHIE</text>
    <text x="${topX + 4}" y="${topSideY + 24.4}" fill="${tabooColor}" font-size="11.0" font-weight="900">TABOO</text>
    <image href="${embeddedImages.techybaraPlaying}" x="${topX + 38}" y="${topSideY + 0.4}" width="21" height="21" preserveAspectRatio="xMidYMid meet" />
    <rect x="${shortPillX}" y="${topSideY + 20.0}" width="${shortPillWidth}" height="${shortPillHeight}" rx="${shortPillHeight / 2}" fill="${categoryColor}" />
    <text x="${shortPillCenterX}" y="${topSideY + 22.1}" text-anchor="middle" fill="${categoryTextColor}" font-size="1.25" font-weight="800" class="mono">${topEditionName}</text>
  </g>

  <g class="gaegu">
    <image href="${embeddedImages.ragtechLogo}" x="${topX + 2}" y="${bottomSideY + 1}" width="14" height="5.3" preserveAspectRatio="xMidYMid meet" />
    <text x="${topX + 4}" y="${bottomSideY + 14.5}" fill="${techieColor}" font-size="11.0" font-weight="900">TECHIE</text>
    <text x="${topX + 4}" y="${bottomSideY + 23.7}" fill="${tabooColor}" font-size="11.0" font-weight="900">TABOO</text>
    <image href="${embeddedImages.techybaraPlaying}" x="${topX + 38}" y="${bottomSideY + 0.4}" width="21" height="21" preserveAspectRatio="xMidYMid meet" />
    <rect x="${shortPillX}" y="${bottomSideY + 20.0}" width="${shortPillWidth}" height="${shortPillHeight}" rx="${shortPillHeight / 2}" fill="${categoryColor}" />
    <text x="${shortPillCenterX}" y="${bottomSideY + 22.1}" text-anchor="middle" fill="${categoryTextColor}" font-size="1.25" font-weight="800" class="mono">${topEditionName}</text>
  </g>

  <g clip-path="url(#leftLongSideClip)">
    ${longSideCardsMarkup[0]}
  </g>
  <g clip-path="url(#rightLongSideClip)">
    ${longSideCardsMarkup[1]}
  </g>

  <g clip-path="url(#leftLongSideClip)" class="gaegu" fill="${techieColor}">
    ${longSideCategoryLines.map((line, idx) => `<text x="${leftLongCenterX + 5}" y="${longSideLabelCenterY + (idx - (longSideCategoryLines.length - 1) / 2) * 4.3 - 5}" font-size="4.3" text-anchor="middle" transform="rotate(90 ${leftLongCenterX} ${longSideLabelCenterY})">${line}</text>`).join("")}
    <g transform="rotate(90 ${leftX + 4} ${longSideDescCenterY + 3})">
      <rect x="${leftX - 8}" y="${longSideDescCenterY - 6.5}" width="59.2" height="${longSideDescriptionLines.length * 2.8 + 2}" rx="${(longSideDescriptionLines.length * 2.8 + 2) / 2}" fill="rgba(255,255,255,0.82)" />
      ${longSideDescriptionLines.map((line, idx) => `<text x="${leftX + 20.8}" y="${longSideDescCenterY - 5.2 + idx * 2.8 + 2.2}" text-anchor="middle" font-size="2.2" class="gaegu">${line}</text>`).join("")}
    </g>
  </g>

  <g clip-path="url(#rightLongSideClip)" class="gaegu" fill="${techieColor}">
    ${longSideCategoryLines.map((line, idx) => `<text x="${rightLongCenterX - 5}" y="${longSideLabelCenterY + (idx - (longSideCategoryLines.length - 1) / 2) * 4.3 - 5}" font-size="4.3" text-anchor="middle" transform="rotate(-90 ${rightLongCenterX} ${longSideLabelCenterY})">${line}</text>`).join("")}
    <g transform="rotate(-90 ${rightX + (PACKAGING_PANEL_MM.longSide.height - 4)} ${longSideDescCenterY + 3})">
      <rect x="${rightX + (PACKAGING_PANEL_MM.longSide.height - 51.4)}" y="${longSideDescCenterY - 6.5}" width="59.2" height="${longSideDescriptionLines.length * 2.8 + 2}" rx="${(longSideDescriptionLines.length * 2.8 + 2) / 2}" fill="rgba(255,255,255,0.82)" />
      ${longSideDescriptionLines.map((line, idx) => `<text x="${rightX + (PACKAGING_PANEL_MM.longSide.height - 20.8)}" y="${longSideDescCenterY - 5.2 + idx * 2.8 + 2.2}" text-anchor="middle" font-size="2.2" class="gaegu">${line}</text>`).join("")}
    </g>
  </g>
</svg>`;
}
