// Migrated from public/scripts/lib/generateSVG.js
import type { TabooCard, CardGenerationOptions } from '../types/taboo'
import { getCategoryColor, getCategoryTextColor } from './categories'

const DEFAULT_OPTIONS: Required<CardGenerationOptions> = {
  baseColor: '#17424A',
  background: '#17424A',
  strokeColor: '#17424A',
  matchStrokeBackground: false,
  showBleed: false,
  category: undefined as string | undefined,
  teacherImage: undefined as string | undefined,
  peekOutImage: undefined as string | undefined
}

export function generateSVG(card: TabooCard, options: Partial<CardGenerationOptions> = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const { top, bottom } = card
  
  // Determine colors
  const textColor = getCategoryTextColor(opts.category)
  const stroke = opts.matchStrokeBackground ? opts.background : opts.strokeColor
  
  // Generate unique IDs
  const uniqueId = `svg_${Math.random().toString(36).substr(2, 9)}`
  const patternId = `binaryPattern_${uniqueId}`
  const blurId = `blur_${uniqueId}`
  
  // Helper to split and size text
  function splitAndSizeText(text: string, baseSize = 54, maxWidth = 490) {
    try {
      // Canvas measurement would require DOM, so we'll use simplified logic
      const words = text.split(' ')
      if (words.length >= 3) {
        const line1 = words.slice(0, 2).join(' ')
        const line2 = words.slice(2).join(' ')
        return { lines: [line1, line2], fontSize: 44 }
      }
      return { lines: [text], fontSize: baseSize }
    } catch (_) {
      return { lines: [text], fontSize: baseSize }
    }
  }
  
  const topTextInfo = splitAndSizeText(top.word)
  const bottomTextInfo = splitAndSizeText(bottom.word)
  
  // Resolve image sources
  const teacherImageHref = opts.teacherImage || '/assets/techybara/teacher.png'
  const peekOutImageHref = opts.peekOutImage || '/assets/techybara/peek out.png'
  
  // Calculate dimensions with bleed
  const width = opts.showBleed ? 650 : 610
  const height = opts.showBleed ? 950 : 910
  const bleed = opts.showBleed ? 20 : 0
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" version="1.1" shape-rendering="geometricPrecision" text-rendering="geometricPrecision">
  <defs>
    <style><![CDATA[
      @font-face {
        font-family: 'Monospace';
        src: url('/assets/fonts/monospace/Monospace.ttf') format('truetype');
        font-weight: 400;
        font-style: normal;
      }
      @font-face {
        font-family: 'Monospace';
        src: url('/assets/fonts/monospace/MonospaceBold.ttf') format('truetype');
        font-weight: 700;
        font-style: normal;
      }
      @font-face {
        font-family: 'Sometype Mono';
        src: url('/assets/fonts/Sometype_Mono/SometypeMono-VariableFont_wght.ttf') format('truetype');
        font-weight: 100 900;
        font-style: normal;
      }
    ]]></style>
    <pattern id="${patternId}" width="610" height="80" patternUnits="userSpaceOnUse">
      <text x="0" y="35" font-family="Monospace, 'Sometype Mono', monospace"
            font-size="28" fill="rgba(255, 255, 255, 0.18)">
        0101010011101010001110101001010100111010100011101010010101001110101000111010100101010011101010001110101001
      </text>
      <text x="0" y="70" font-family="Monospace, 'Sometype Mono', monospace"
            font-size="28" fill="rgba(255, 255, 255, 0.18)">
        1010100111010100011101010010101001110101000111010100101010011101010001110101001010100111010100011101010010
      </text>
    </pattern>
    <filter id="${blurId}"><feGaussianBlur stdDeviation="0.8"/></filter>
  </defs>
  <rect x="${bleed}" y="${bleed}" width="${width - bleed * 2}" height="${height - bleed * 2}" fill="${opts.background}"/>
  <g transform="translate(${55 + bleed},${50 + bleed})">
    <rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="${opts.baseColor}"/>
    <rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="url(#${patternId})" filter="url(#${blurId})"/>
    <rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="none" stroke="${stroke}" stroke-width="14"/>
    <line x1="0" y1="415" x2="500" y2="415" stroke="${stroke}" stroke-width="3" opacity="0.7"/>
    <g id="top-half">
      ${topTextInfo.lines.length === 1 
        ? `<text id="topWordText" x="250" y="90" text-anchor="middle"
              font-family="Monospace, 'Sometype Mono', monospace" font-size="${topTextInfo.fontSize}"
              fill="${textColor}" font-weight="bold">${topTextInfo.lines[0]}</text>`
        : `<text id="topWordText" x="250" y="65" text-anchor="middle"
              font-family="Monospace, 'Sometype Mono', monospace" font-size="${topTextInfo.fontSize}"
              fill="${textColor}" font-weight="bold">${topTextInfo.lines[0]}</text>
           <text x="250" y="110" text-anchor="middle"
              font-family="Monospace, 'Sometype Mono', monospace" font-size="${topTextInfo.fontSize}"
              fill="${textColor}" font-weight="bold">${topTextInfo.lines[1]}</text>`
      }
      <rect x="50" y="140" width="400" height="250" rx="20" ry="20" fill="white" opacity="0.85"/>
      ${top.taboo.map((w,i) =>
        `<text x="250" y="${190+i*40}" text-anchor="middle" font-family="Monospace, 'Sometype Mono', monospace" font-size="28" fill="#062E35">${w}</text>`
      ).join("")}
      <image href="${teacherImageHref}" x="400" y="320" width="80" height="80"/>
    </g>
    <g id="bottom-half" transform="translate(500,810) rotate(180)">
      ${bottomTextInfo.lines.length === 1 
        ? `<text id="bottomWordText" x="250" y="90" text-anchor="middle"
              font-family="Monospace, 'Sometype Mono', monospace" font-size="${bottomTextInfo.fontSize}"
              fill="${textColor}" font-weight="bold">${bottomTextInfo.lines[0]}</text>`
        : `<text id="bottomWordText" x="250" y="65" text-anchor="middle"
              font-family="Monospace, 'Sometype Mono', monospace" font-size="${bottomTextInfo.fontSize}"
              fill="${textColor}" font-weight="bold">${bottomTextInfo.lines[0]}</text>
           <text x="250" y="110" text-anchor="middle"
              font-family="Monospace, 'Sometype Mono', monospace" font-size="${bottomTextInfo.fontSize}"
              fill="${textColor}" font-weight="bold">${bottomTextInfo.lines[1]}</text>`
      }
      <rect x="50" y="140" width="400" height="250" rx="20" ry="20" fill="white" opacity="0.85"/>
      ${bottom.taboo.map((w,i) =>
        `<text x="250" y="${190+i*40}" text-anchor="middle" font-family="Monospace, 'Sometype Mono', monospace" font-size="28" fill="#062E35">${w}</text>`
      ).join("")}
      <image href="${peekOutImageHref}" x="420" y="280" width="90" height="70"/>
    </g>
  </g>
</svg>`
}

export function generateMultipleSVGs(cards: TabooCard[], options: Partial<CardGenerationOptions> = {}): string[] {
  return cards.map(card => generateSVG(card, options))
}
