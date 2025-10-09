// public/scripts/lib/generateSVG.js
export function generateSVG(topWord, topTaboos, bottomWord, bottomTaboos, options = {}) {
  const {
    baseColor = "#17424A",           // used to derive gradient
    background = "#17424A",          // canvas background
    strokeColor = "#17424A",         // card border stroke
    matchStrokeBackground = false,    // if true, stroke = background
    showBleed = false,                // bleed guides visibility
    bleedColor = "red",              // bleed guides color
    trimColor = "blue",              // trim guides color
    strokeWidth = 14,                 // outer card border width
    dividerWidth = 3,                 // middle divider line width
    trimInset = 30,                   // distance of trim guide from the page edge (was 40)
  } = options;

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

  // derive gradient from baseColor (slightly darker top, slightly lighter bottom)
  const gradTop = adjust(baseColor, -30);
  const gradBottom = adjust(baseColor, +15);
  const stroke = matchStrokeBackground ? background : strokeColor;

  // Auto-fit word font sizes to max width using canvas measurement
  function computeFontSize(text, baseSize = 56, maxWidth = 490) {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.font = `bold ${baseSize}px sometype mono, monospace`;
      const w = ctx.measureText(text).width;
      if (w <= maxWidth) return baseSize;
      const ratio = maxWidth / w;
      return Math.max(24, Math.floor(baseSize * ratio));
    } catch (_) {
      // Fallback if canvas is unavailable
      return baseSize;
    }
  }
  const topFontSize = computeFontSize(topWord);
  const bottomFontSize = computeFontSize(bottomWord);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="580" height="890" viewBox="0 0 580 890" version="1.1">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${gradTop}"/>
      <stop offset="100%" stop-color="${gradBottom}"/>
    </linearGradient>
    <pattern id="binaryPattern" width="580" height="80" patternUnits="userSpaceOnUse">
      <text x="0" y="35" font-family="sometype mono, monospace"
            font-size="28" fill="rgba(200,220,255,0.18)">
        0101010011101010001110101001010100111010100011101010010101001110101000111010100101010011101010001110101001
      </text>
      <text x="0" y="70" font-family="sometype mono, monospace"
            font-size="28" fill="rgba(200,220,255,0.18)">
        1010100111010100011101010010101001110101000111010100101010011101010001110101001010100111010100011101010010
      </text>
    </pattern>
    <filter id="blur"><feGaussianBlur stdDeviation="0.8"/></filter>
  </defs>
  <rect x="0" y="0" width="580" height="890" fill="${background}"/>
  <g transform="translate(40,40)">
    <rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="url(#bgGrad)"/>
    <rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="url(#binaryPattern)" filter="url(#blur)"/>
    <rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"/>
    <line x1="0" y1="415" x2="500" y2="415" stroke="${stroke}" stroke-width="${dividerWidth}" opacity="0.7"/>
    <g id="top-half">
      <text id="topWordText" x="250" y="110" text-anchor="middle"
            font-family="sometype mono, monospace" font-size="${topFontSize}"
            fill="white" font-weight="bold">${topWord}</text>
      <rect x="50" y="140" width="400" height="250" rx="20" ry="20" fill="white" opacity="0.85"/>
      ${topTaboos.map((w,i) =>
        `<text x=\"250\" y=\"${190+i*40}\" text-anchor=\"middle\" font-family=\"sometype mono, monospace\" font-size=\"28\" fill=\"#062E35\">${w}</text>`
      ).join("")}
    </g>
    <g id="bottom-half" transform="translate(500,810) rotate(180)">
      <text id="bottomWordText" x="250" y="110" text-anchor="middle"
            font-family="sometype mono, monospace" font-size="${bottomFontSize}"
            fill="white" font-weight="bold">${bottomWord}</text>
      <rect x="50" y="140" width="400" height="250" rx="20" ry="20" fill="white" opacity="0.85"/>
      ${bottomTaboos.map((w,i) =>
        `<text x=\"250\" y=\"${190+i*40}\" text-anchor=\"middle\" font-family=\"sometype mono, monospace\" font-size=\"28\" fill=\"#062E35\">${w}</text>`
      ).join("")}
    </g>
  </g>
  ${showBleed ? `<rect x="0" y="0" width="580" height="890" fill="none" stroke="${bleedColor}" stroke-width="1" stroke-dasharray="6 4"/>` : ''}
  <rect x="${trimInset}" y="${trimInset}" width="${580 - 2*trimInset}" height="${890 - 2*trimInset}" rx="40" ry="40" fill="none" stroke="${trimColor}" stroke-width="1" stroke-dasharray="6 4"/>
</svg>`;
}
