// public/scripts/lib/generateSystemSVG.js
import { renderIconSVG, renderIconAt } from './icons.js';

export function generateSystemSVG(titleWord, descriptionText, category, options = {}) {
  const {
    baseColor = "#17424A",
    background = "#17424A",
    strokeColor = "#17424A",
    showBleed = false,
    bleedColor = "red",
    trimColor = "grey",
    strokeWidth = 10,
    trimInset = 30,
    // graphics options
    iconMode = 'icon', // 'none' | 'icon' | 'emoji'
    twoUp = false,
    iconName = undefined, // legacy single
    iconNameA = undefined,
    iconNameB = undefined,
    emojiA = undefined,
    emojiB = undefined,
    // description rendering control
    descAsText = false,
    // remove filters for better decoder compatibility during PNG export
    rasterSafe = false,
  } = options;

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
      return baseSize;
    }
  }

  // Very light gradient to keep the background close to white
  const gradTop = adjust(baseColor, +60);
  const gradBottom = adjust(baseColor, +85);
  const stroke = strokeColor;

  const titleFontSize = computeFontSize(titleWord || "");
  const rawDesc = descriptionText || "";
  const safeDesc = rawDesc.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeCat = (category || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Layout
  // Outer: 580x890, inner card at (40,40) size 500x810
  // Title near top, icon area below (approx 1/3 of inner height ~ 270px),
  // description box beneath, badge near bottom

  // Prepare icon/emoji markup for the icon area (x=100,y=140,w=300,h=270)
  function renderEmojiAt(x, y, w, h, txt, color = '#FFFFFF') {
    if (!txt) return '';
    // Fit emoji inside box with padding
    const base = 200; // reference font size
    const scale = Math.min(w / base, h / base) * 0.85;
    const fontSize = Math.round(200 * scale);
    const cx = x + w / 2;
    const cy = y + h / 2 + fontSize * 0.35; // adjust baseline
    return `<text x="${cx}" y="${cy}" text-anchor="middle" font-family="sometype mono, monospace" font-size="${fontSize}" fill="${color}">${txt}</text>`;
  }

  let graphicMarkup = '';
  const boxX = 100, boxY = 140, boxW = 300, boxH = 270;
  if (iconMode === 'emoji') {
    if (twoUp) {
      const halfW = Math.floor((boxW - 20) / 2);
      graphicMarkup =
        renderEmojiAt(boxX + 0, boxY, halfW, boxH, emojiA || emojiB || '') +
        renderEmojiAt(boxX + halfW + 20, boxY, halfW, boxH, emojiB || emojiA || '');
    } else {
      graphicMarkup = renderEmojiAt(boxX, boxY, boxW, boxH, emojiA || emojiB || '');
    }
  } else if (iconMode === 'icon') {
    const nameA = iconNameA || iconName || undefined;
    const nameB = iconNameB || undefined;
    if (twoUp) {
      const halfW = Math.floor((boxW - 20) / 2);
      graphicMarkup =
        renderIconAt(boxX + 0, boxY, halfW, boxH, nameA, '#FFFFFF', 2) +
        renderIconAt(boxX + halfW + 20, boxY, halfW, boxH, nameB || nameA, '#FFFFFF', 2);
    } else {
      graphicMarkup = renderIconAt(boxX, boxY, boxW, boxH, nameA, '#FFFFFF', 2);
    }
  } else {
    // none: leave placeholder only
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="580" height="890" viewBox="0 0 580 890" version="1.1">
  <defs>
    ${rasterSafe ? '' : `<linearGradient id="bgGradSys" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${gradTop}"/>
      <stop offset="100%" stop-color="${gradBottom}"/>
    </linearGradient>`}
    ${rasterSafe ? '' : `<pattern id="binaryPatternSys" width="580" height="80" patternUnits="userSpaceOnUse">
      <text x="0" y="35" font-family="sometype mono, monospace" font-size="28" fill="rgba(0,0,0,0.16)">0101010011101010001110101001010100111010100011101010010101001110101000111010100101010011101010001110101001</text>
      <text x="0" y="70" font-family="sometype mono, monospace" font-size="28" fill="rgba(0,0,0,0.16)">1010100111010100011101010010101001110101000111010100101010011101010001110101001010100111010100011101010010</text>
    </pattern>`}
    ${rasterSafe ? '' : '<filter id="blurSys"><feGaussianBlur stdDeviation="0.8"/></filter>'}
  </defs>

  <rect x="0" y="0" width="580" height="890" fill="#062E35"/>
  <g transform="translate(40,40)">
    <rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="${rasterSafe ? '#F7FAFC' : 'url(#bgGradSys)'}"/>
    ${rasterSafe ? '' : `<rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="url(#binaryPatternSys)" ${rasterSafe ? '' : 'filter="url(#blurSys)"'}/>`}

    <!-- Title Word -->
    <text id="titleWordText" x="250" y="110" text-anchor="middle" font-family="sometype mono, monospace" font-size="${titleFontSize}" fill="white" font-weight="bold">${titleWord || ''}</text>

    <!-- Icon Area (1/3 height ~ 270px) -->
    <g id="icon-area">
      <rect x="100" y="140" width="300" height="270" rx="20" ry="20" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" stroke-dasharray="8 6"/>
      ${graphicMarkup || `<text x="250" y="285" text-anchor="middle" font-family="sometype mono, monospace" font-size="18" fill="rgba(255,255,255,0.6)">Icon/Emoji area (optional)</text>`}

    <!-- Description Area (free text) -->
    <g id="description" transform="translate(0,0)">
      <rect x="50" y="430" width="400" height="250" rx="20" ry="20" fill="white" opacity="0.92"/>
      ${descAsText ? (() => {
        // Wrapping into tspans with constraints for box size (380x230) using monospace approximation
        const maxChars = 56; // ~380px / (avg 6.7px per char at 18px mono)
        const lineHeight = 22;
        const maxLines = Math.floor(230 / lineHeight); // ~10 lines
        const lines = [];

        const pushWrapped = (text) => {
          if (!text) { lines.push(''); return; }
          const words = text.split(/\s+/);
          let line = '';
          const pushLine = (l) => { if (lines.length < maxLines) lines.push(l); };
          const flushLine = () => { if (line) { pushLine(line); line=''; } };
          for (let w of words) {
            // Break very long words
            while (w.length > maxChars) {
              const part = w.slice(0, maxChars);
              w = w.slice(maxChars);
              if (line) { pushLine(line); line=''; }
              pushLine(part);
              if (lines.length >= maxLines) return;
            }
            const candidate = line ? line + ' ' + w : w;
            if (candidate.length > maxChars) {
              pushLine(line);
              line = w;
              if (lines.length >= maxLines) return;
            } else {
              line = candidate;
            }
          }
          if (lines.length < maxLines) flushLine();
        };

        rawDesc.split(/\r?\n/).forEach(seg => {
          if (lines.length < maxLines) pushWrapped(seg);
        });

        //Ellipsis if truncated
        let truncated = lines.length > maxLines;
        if (lines.length === maxLines && (rawDesc.split(/\r?\n/).join(' ').length > lines.join(' ').length)) truncated = true;
        if (truncated) {
          const last = lines[maxLines - 1] || '';
          lines[maxLines - 1] = last.length >= 1 ? (last.slice(0, Math.max(0, last.length - 1)) + '…') : '…';
        }

        const tspans = lines.slice(0, maxLines).map((ln, i) => `<tspan x="70" dy="${i===0?0:lineHeight}">${ln.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</tspan>`).join('');
        return `<text x="70" y="462" font-family="sometype mono, monospace" font-size="18" fill="#062E35" xml:space="preserve">${tspans}</text>`;
      })() : `
      <foreignObject x="60" y="440" width="380" height="230">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: sometype mono, monospace; font-size: 18px; color: #062E35; line-height: 1.3; white-space: pre-wrap; word-wrap: break-word;">${safeDesc}</div>
      </foreignObject>`}
    </g>

    <!-- Category Badge -->
    <g id="badge">
      <rect x="150" y="705" width="200" height="44" rx="22" ry="22" fill="${stroke}" opacity="0.9"/>
      <text x="250" y="734" text-anchor="middle" font-family="sometype mono, monospace" font-size="18" fill="white">${safeCat}</text>
    </g>
  </g>
  ${showBleed ? `<rect x="0" y="0" width="580" height="890" fill="none" stroke="${bleedColor}" stroke-width="1" stroke-dasharray="6 4"/>` : ''}
  <rect x="${trimInset-40}" y="${trimInset-40}" width="${580 - 2*trimInset}" height="${890 - 2*trimInset}" rx="40" ry="40" fill="none" stroke="${trimColor}" stroke-width="1" stroke-dasharray="6 4"/>
</svg>`;
}
