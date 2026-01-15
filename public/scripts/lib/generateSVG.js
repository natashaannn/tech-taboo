// public/scripts/lib/generateSVG.js
import { getCategoryTextColor } from './categories.js';

export function generateSVG(topWord, topTaboos, bottomWord, bottomTaboos, options = {}) {
  const {
    baseColor = "#17424A",           // used to derive gradient
    background = "#17424A",          // canvas background
    strokeColor = "#17424A",         // card border stroke
    matchStrokeBackground = false,    // if true, stroke = background           // trim guides color
    strokeWidth = 14,                 // outer card border width
    dividerWidth = 3,                 // middle divider line width
    category = null,                  // category for determining text color
    teacherImage = "./techybara/teacher.png",  // teacher image (can be data URI or path)
    peekOutImage = "./techybara/peek out.png", // peek out image (can be data URI or path)
  } = options;
  
  // Determine text color based on category
  const textColor = getCategoryTextColor(category);

  // Resolve image sources so they work when the SVG is loaded from a blob for PNG export
  function resolveImageSrc(src, fallbackPath) {
    const value = (src && String(src).trim()) || fallbackPath;
    if (!value) return '';
    // Data URI or absolute URL can be used as-is
    if (value.startsWith('data:') || /^https?:\/\//.test(value)) {
      return value;
    }
    // For relative or root-relative paths, build an absolute URL against the page origin
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
      try {
        if (value.startsWith('/')) {
          return new URL(value, window.location.origin).href;
        }
        return new URL(value, window.location.href).href;
      } catch (_) {
        return value;
      }
    }
    return value;
  }

  const teacherImageHref = resolveImageSrc(teacherImage, './techybara/teacher.png');
  const peekOutImageHref = resolveImageSrc(peekOutImage, './techybara/peek out.png');

  function resolveFontSrc(src) {
    const value = (src && String(src).trim()) || '';
    if (!value) return '';
    if (value.startsWith('data:') || /^https?:\/\//.test(value)) return value;
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
      try {
        if (value.startsWith('/')) return new URL(value, window.location.origin).href;
        return new URL(value, window.location.href).href;
      } catch (_) {
        return value;
      }
    }
    return value;
  }

  const fontFamily = 'Monospace, "Sometype Mono", monospace';
  const monospaceNormalSrc = resolveFontSrc('/fonts/monospace/Monospace.ttf');
  const monospaceBoldSrc = resolveFontSrc('/fonts/monospace/MonospaceBold.ttf');
  const monospaceObliqueSrc = resolveFontSrc('/fonts/monospace/MonospaceOblique.ttf');
  const sometypeMonoNormalSrc = resolveFontSrc('/fonts/Sometype_Mono/SometypeMono-VariableFont_wght.ttf');
  const sometypeMonoItalicSrc = resolveFontSrc('/fonts/Sometype_Mono/SometypeMono-Italic-VariableFont_wght.ttf');

  // helpers to adjust hex colors a bit lighter/darker
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function hexToRgb(hex) {
    const m = hex.replace('#','');
    const bigint = parseInt(m.length===3 ? m.split('').map(x=>x+x).join('') : m, 16);
    return { r: (bigint>>16)&255, g: (bigint>>8)&255, b: bigint&255 };
  }
  function rgbToHex(r,g,b){
    const toHex = (n)=> n.toString(16).padStart(2,'0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  function adjust(hex, amt){
    const {r,g,b} = hexToRgb(hex);
    return rgbToHex(
      clamp(r + amt, 0, 255),
      clamp(g + amt, 0, 255),
      clamp(b + amt, 0, 255)
    );
  }

  const stroke = matchStrokeBackground ? background : strokeColor;

  // Split long text into multiple lines and compute font size
  function splitAndSizeText(text, baseSize = 54, maxWidth = 490) {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.font = `bold ${baseSize}px ${fontFamily}`;
      const w = ctx.measureText(text).width;
      
      // First, check for special break points like parentheses
      // Note: Only use ' / ' with spaces, not '/' alone, to avoid splitting acronyms like CI/CD
      const specialBreaks = [' (', ') ', ' / ', ' - '];
      for (const bp of specialBreaks) {
        const idx = text.indexOf(bp);
        if (idx > 0 && idx < text.length - 1) {
          let line1, line2;
          if (bp === ' (') {
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
      const words = text.split(' ');
      if (words.length >= 3) {
        const line1 = words.slice(0, 2).join(' ');
        const line2 = words.slice(2).join(' ');
        
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
      return { lines: [text], fontSize: Math.max(24, Math.floor(baseSize * ratio)) };
    } catch (_) {
      return { lines: [text], fontSize: baseSize };
    }
  }
  
  const topTextInfo = splitAndSizeText(topWord);
  const bottomTextInfo = splitAndSizeText(bottomWord);
  
  // Generate unique IDs for this SVG to avoid conflicts when multiple SVGs are on the same page
  const uniqueId = `svg_${Math.random().toString(36).substr(2, 9)}`;
  const gradId = `bgGrad_${uniqueId}`;
  const patternId = `binaryPattern_${uniqueId}`;
  const blurId = `blur_${uniqueId}`;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="610" height="910" viewBox="0 0 610 910" version="1.1">
  <defs>
    <style><![CDATA[
      @font-face {
        font-family: 'Monospace';
        src: url('${monospaceNormalSrc}') format('truetype');
        font-weight: 400;
        font-style: normal;
      }
      @font-face {
        font-family: 'Monospace';
        src: url('${monospaceBoldSrc}') format('truetype');
        font-weight: 700;
        font-style: normal;
      }
      @font-face {
        font-family: 'Monospace';
        src: url('${monospaceObliqueSrc}') format('truetype');
        font-weight: 400;
        font-style: italic;
      }
      @font-face {
        font-family: 'Sometype Mono';
        src: url('${sometypeMonoNormalSrc}') format('truetype');
        font-weight: 100 900;
        font-style: normal;
      }
      @font-face {
        font-family: 'Sometype Mono';
        src: url('${sometypeMonoItalicSrc}') format('truetype');
        font-weight: 100 900;
        font-style: italic;
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
  <rect x="0" y="0" width="610" height="910" fill="${background}"/>
  <g transform="translate(55,50)">
    <rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="${baseColor}"/>
    <rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="url(#${patternId})" filter="url(#${blurId})"/>
    <rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"/>
    <line x1="0" y1="415" x2="500" y2="415" stroke="${stroke}" stroke-width="${dividerWidth}" opacity="0.7"/>
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
      ${topTaboos.map((w,i) =>
        `<text x=\"250\" y=\"${190+i*40}\" text-anchor=\"middle\" font-family=\"Monospace, 'Sometype Mono', monospace\" font-size=\"28\" fill=\"#062E35\">${w}</text>`
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
      ${bottomTaboos.map((w,i) =>
        `<text x=\"250\" y=\"${190+i*40}\" text-anchor=\"middle\" font-family=\"Monospace, 'Sometype Mono', monospace\" font-size=\"28\" fill=\"#062E35\">${w}</text>`
      ).join("")}
      <image href="${peekOutImageHref}" x="420" y="280" width="90" height="70"/>
    </g>
  </g>
</svg>`;
}
