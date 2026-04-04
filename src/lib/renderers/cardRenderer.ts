import type { TabooCard, CardGenerationOptions } from "../../types/taboo";
import {
  getCategoryColor,
  getCategoryTextColor,
} from "../constants/categories";
import {
  ensureEmbeddedFonts,
  ensureEmbeddedTechybaraImages,
} from "../utils/fontUtils";

const DEFAULT_OPTIONS: CardGenerationOptions = {
  baseColor: "#17424A",
  background: "#17424A",
  strokeColor: "#17424A",
  matchStrokeBackground: false,
  category: undefined,
  teacherImage: undefined,
  peekOutImage: undefined,
};

function toFontSrc(fontData: string | undefined, fallbackPath: string): string {
  if (fontData && fontData.startsWith("data:")) return fontData;
  if (fontData && /^(https?:|\/)/i.test(fontData)) return fontData;
  if (fontData) return `data:font/truetype;base64,${fontData}`;
  return fallbackPath;
}

export async function generateCardSVG(
  card: TabooCard,
  options: Partial<CardGenerationOptions> = {},
): Promise<string> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const { top, bottom } = card;

  // Ensure fonts are cached
  const fonts = await ensureEmbeddedFonts();

  // Ensure techybara images are embedded
  const techybaraImages = await ensureEmbeddedTechybaraImages();

  const monoFontSrc = toFontSrc(
    fonts.mono,
    "/assets/fonts/monospace/Monospace.ttf",
  );
  const monoBoldFontSrc = toFontSrc(
    fonts.monoBold || fonts.mono,
    "/assets/fonts/monospace/MonospaceBold.ttf",
  );
  const sometypeFontSrc = toFontSrc(
    fonts.sometypeMono,
    "/assets/fonts/Sometype_Mono/SometypeMono-VariableFont_wght.ttf",
  );

  const fontFaceCSS = `
    @font-face {
      font-family: 'Monospace';
      src: url('${monoFontSrc}') format('truetype');
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: 'Monospace';
      src: url('${monoBoldFontSrc}') format('truetype');
      font-weight: 700;
      font-style: normal;
    }
    @font-face {
      font-family: 'Sometype Mono';
      src: url('${sometypeFontSrc}') format('truetype');
      font-weight: 100 900;
      font-style: normal;
    }
  `;

  // Determine colors based on category
  const categoryColor = opts.category ? getCategoryColor(opts.category) : null;
  const textColor = getCategoryTextColor(opts.category || "");

  // Use custom baseColor if provided (not default), otherwise use category color or default
  const baseColor =
    opts.baseColor !== DEFAULT_OPTIONS.baseColor
      ? opts.baseColor
      : categoryColor || opts.baseColor;
  const background =
    opts.background !== DEFAULT_OPTIONS.background
      ? opts.background
      : categoryColor || opts.background;

  // Helper to split and size text with proper wrapping
  function splitAndSizeText(text: string, baseSize = 54, maxWidth = 490) {
    try {
      const fontFamily = 'Monospace, "Sometype Mono", monospace';
      // Check if we're in a browser environment
      if (typeof window === "undefined" || typeof document === "undefined") {
        return { lines: [text], fontSize: baseSize };
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return { lines: [text], fontSize: baseSize };
      }

      ctx.font = `bold ${baseSize}px ${fontFamily}`;
      const w = ctx.measureText(text).width;

      // First, check for special break points like parentheses
      // Note: Only use ' / ' with spaces, not '/' alone, to avoid splitting acronyms like CI/CD
      const specialBreaks = [" (", ") ", " / ", " - "];
      for (const bp of specialBreaks) {
        const idx = text.indexOf(bp);
        if (idx > 0 && idx < text.length - 1) {
          let line1, line2;
          if (bp === " (") {
            // For ' (' keep everything before the space on line 1, start line 2 with '('
            line1 = text.substring(0, idx).trim();
            line2 = text.substring(idx + 1).trim(); // Skip the space, keep the '('
          } else {
            // For other breaks, split at the break point but keep the character
            line1 = text.substring(0, idx + bp.length).trim();
            line2 = text.substring(idx + bp.length).trim();
          }

          // Try 44px first, then 40px if needed
          for (const fontSize of [44, 40]) {
            ctx.font = `bold ${fontSize}px ${fontFamily}`;
            const w1 = ctx.measureText(line1).width;
            const w2 = ctx.measureText(line2).width;

            if (w1 <= maxWidth && w2 <= maxWidth) {
              return { lines: [line1, line2], fontSize };
            }
          }
        }
      }

      // Always split multi-word phrases (3+ words) after 2 words
      const words = text.split(" ");
      if (words.length >= 3) {
        const line1 = words.slice(0, 2).join(" ");
        const line2 = words.slice(2).join(" ");

        // Try 44px first, then 40px if needed
        for (const fontSize of [44, 40]) {
          ctx.font = `bold ${fontSize}px ${fontFamily}`;
          const w1 = ctx.measureText(line1).width;
          const w2 = ctx.measureText(line2).width;

          if (w1 <= maxWidth && w2 <= maxWidth) {
            return { lines: [line1, line2], fontSize };
          }
        }

        // If even at 40px it doesn't fit, try smaller sizes
        for (let fontSize = 38; fontSize >= 32; fontSize -= 2) {
          ctx.font = `bold ${fontSize}px ${fontFamily}`;
          const w1 = ctx.measureText(line1).width;
          const w2 = ctx.measureText(line2).width;

          if (w1 <= maxWidth && w2 <= maxWidth) {
            return { lines: [line1, line2], fontSize };
          }
        }
      }

      // If text fits on one line (1-2 words), return as-is
      if (w <= maxWidth) {
        return { lines: [text], fontSize: baseSize };
      }

      // Otherwise, shrink to fit on one line
      const ratio = maxWidth / w;
      return {
        lines: [text],
        fontSize: Math.max(24, Math.floor(baseSize * ratio)),
      };
    } catch (_) {
      return { lines: [text], fontSize: baseSize };
    }
  }

  // Calculate font size for taboo words to prevent overflow
  function getTabooFontSize(text: string, maxWidth = 380) {
    try {
      // Check if we're in a browser environment
      if (typeof window === "undefined" || typeof document === "undefined") {
        return 32;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return 32;
      }

      const baseFontSize = 32;
      ctx.font = `${baseFontSize}px sometype mono, monospace`;
      const w = ctx.measureText(text).width;

      if (w <= maxWidth) {
        return baseFontSize;
      }

      // Scale down to fit
      const ratio = maxWidth / w;
      return Math.max(24, Math.floor(baseFontSize * ratio));
    } catch (_) {
      return 32;
    }
  }

  const teacherImageHref =
    techybaraImages.teacher || "/assets/techybara/teacher.png";
  const peekOutImageHref =
    techybaraImages.peekOut || "/assets/techybara/peek out.png";

  const topTextInfo = splitAndSizeText(top.word);
  const bottomTextInfo = splitAndSizeText(bottom.word);
  const topTabooFontSize = getTabooFontSize(top.taboo.join(" "));
  const bottomTabooFontSize = getTabooFontSize(bottom.taboo.join(" "));

  // Generate unique IDs
  const uniqueId = `svg_${Math.random().toString(36).substr(2, 9)}`;
  const patternId = `binaryPattern_${uniqueId}`;
  const blurId = `blur_${uniqueId}`;

  // Generate the complete SVG markup
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="610" height="910" viewBox="0 0 610 910" version="1.1" shape-rendering="geometricPrecision" text-rendering="geometricPrecision">
  <defs>
    <style><![CDATA[
      ${fontFaceCSS}
    ]]></style>
    <pattern id="${patternId}" width="610" height="80" patternUnits="userSpaceOnUse">
      <text x="0" y="35" font-family="Monospace, 'Sometype Mono', monospace" font-size="28" fill="rgba(255, 255, 255, 0.18)">0101010011101010001110101001010100111010100011101010010101001110101000111010100101010011101010001110101001</text>
      <text x="0" y="70" font-family="Monospace, 'Sometype Mono', monospace" font-size="28" fill="rgba(255, 255, 255, 0.18)">1010100111010100011101010010101001110101000111010100101010011101010001110101001010100111010100011101010010</text>
    </pattern>
    <filter id="${blurId}"><feGaussianBlur stdDeviation="0.8"/></filter>
  </defs>
  <rect x="0" y="0" width="610" height="910" fill="${background}"/>
  <g transform="translate(55,50)">
    <rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="${baseColor}"/>
    <rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="url(#${patternId})" filter="url(#${blurId})"/>
    <g id="top-half">
      ${
        topTextInfo.lines.length === 1
          ? `<text id="topWordText" x="250" y="90" text-anchor="middle" font-family="Monospace, 'Sometype Mono', monospace" font-size="${topTextInfo.fontSize}" fill="${textColor}" font-weight="bold">${topTextInfo.lines[0]}</text>`
          : `<text id="topWordText" x="250" y="65" text-anchor="middle" font-family="Monospace, 'Sometype Mono', monospace" font-size="${topTextInfo.fontSize}" fill="${textColor}" font-weight="bold">${topTextInfo.lines[0]}</text>
           <text x="250" y="110" text-anchor="middle" font-family="Monospace, 'Sometype Mono', monospace" font-size="${topTextInfo.fontSize}" fill="${textColor}" font-weight="bold">${topTextInfo.lines[1]}</text>`
      }
      <rect x="50" y="140" width="400" height="250" rx="20" ry="20" fill="white" opacity="0.85"/>
      ${top.taboo
        .map(
          (w, i) =>
            `<text x="250" y="${190 + i * 40}" text-anchor="middle" font-family="Monospace, 'Sometype Mono', monospace" font-size="${topTabooFontSize}" fill="#062E35">${w}</text>`,
        )
        .join("")}
      <image href="${teacherImageHref}" x="400" y="320" width="80" height="80"/>
    </g>
    <g id="bottom-half" transform="translate(500,810) rotate(180)">
      ${
        bottomTextInfo.lines.length === 1
          ? `<text id="bottomWordText" x="250" y="90" text-anchor="middle" font-family="Monospace, 'Sometype Mono', monospace" font-size="${bottomTextInfo.fontSize}" fill="${textColor}" font-weight="bold">${bottomTextInfo.lines[0]}</text>`
          : `<text id="bottomWordText" x="250" y="65" text-anchor="middle" font-family="Monospace, 'Sometype Mono', monospace" font-size="${bottomTextInfo.fontSize}" fill="${textColor}" font-weight="bold">${bottomTextInfo.lines[0]}</text>
           <text x="250" y="110" text-anchor="middle" font-family="Monospace, 'Sometype Mono', monospace" font-size="${bottomTextInfo.fontSize}" fill="${textColor}" font-weight="bold">${bottomTextInfo.lines[1]}</text>`
      }
      <rect x="50" y="140" width="400" height="250" rx="20" ry="20" fill="white" opacity="0.85"/>
      ${bottom.taboo
        .map(
          (w, i) =>
            `<text x="250" y="${190 + i * 40}" text-anchor="middle" font-family="Monospace, 'Sometype Mono', monospace" font-size="${bottomTabooFontSize}" fill="#062E35">${w}</text>`,
        )
        .join("")}
      <image href="${peekOutImageHref}" x="420" y="280" width="90" height="70"/>
    </g>
  </g>
</svg>`;

  return svg;
}

export async function generateMultipleCardSVGs(
  cards: TabooCard[],
  options: Partial<CardGenerationOptions> = {},
): Promise<string[]> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Generate all SVGs in parallel
  const svgPromises = cards.map((card) => generateCardSVG(card, opts));
  return Promise.all(svgPromises);
}

// Backward compatibility exports
export const generateSVG = generateCardSVG;
export const generateMultipleSVGs = generateMultipleCardSVGs;
