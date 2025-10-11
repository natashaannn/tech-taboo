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
    descAsText = true,
    // optional effect text to show in a second box within the description area
    effect = undefined,
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
  const rawEffect = effect || "";
  // Trim leading whitespace/newlines to avoid an initial blank line
  const rawDescTrim = rawDesc.replace(/^\s+/, '');
  const rawEffectTrim = rawEffect.replace(/^\s+/, '');
  const safeDesc = rawDescTrim.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeEffect = rawEffectTrim.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeCat = (category || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Layout
  // Outer: 580x890, inner card at (40,40) size 500x810
  // Title near top, icon area below (approx 1/3 of inner height ~ 270px),
  // description box beneath, badge near bottom

  // Compute description/effect text layout (wrapped lines) outside of SVG template
  const hasEffect = !!rawEffectTrim.trim();
  const descArea = { x: 70, y: 455, width: 380, height: 230 };
  const lineHeight = 22;
  const maxChars = 32; // monospace approximation (halved)
  const effectBlockLines = hasEffect ? 3 : 0; // label + up to 2 lines
  const effectBlockHeight = hasEffect ? (lineHeight * (1 + 2)) + 6 : 0; // label + 2 lines + spacing
  const descMaxLines = Math.max(0, Math.floor((descArea.height - effectBlockHeight) / lineHeight));

  function wrapLines(text, maxLns) {
    const lines = [];
    const pushLine = (l) => { if (lines.length < maxLns) lines.push(l); };
    const pushWrapped = (segment) => {
      if (!segment) { pushLine(''); return; }
      const words = segment.split(/\s+/);
      let line = '';
      for (let w of words) {
        while (w.length > maxChars) {
          const part = w.slice(0, maxChars);
          w = w.slice(maxChars);
          if (line) { pushLine(line); line=''; }
          pushLine(part);
          if (lines.length >= maxLns) return;
        }
        const candidate = line ? line + ' ' + w : w;
        if (candidate.length > maxChars) {
          pushLine(line);
          line = w;
          if (lines.length >= maxLns) return;
        } else {
          line = candidate;
        }
      }
      if (line && lines.length < maxLns) pushLine(line);
    };
    text.split(/\r?\n/).forEach(seg => { if (lines.length < maxLns) pushWrapped(seg); });
    if (lines.length === maxLns && (text.split(/\r?\n/).join(' ').length > lines.join(' ').length)) {
      // ellipsis on last
      const last = lines[maxLns - 1] || '';
      lines[maxLns - 1] = last.length >= 1 ? (last.slice(0, Math.max(0, last.length - 1)) + '…') : '…';
    }
    return lines;
  }

  const descLines = wrapLines(rawDescTrim, descMaxLines);
  const descTextSvg = `<text x="${descArea.x}" y="${descArea.y}" font-family="sometype mono, monospace" font-size="20" fill="${baseColor}">`
    + descLines.map((ln,i)=>`<tspan x="${descArea.x}" dy="${i===0?0:lineHeight}">${ln.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</tspan>`).join('')
    + `</text>`;

  let effectTextSvg = '';
  if (hasEffect) {
    const effectLabelY = descArea.y + (Math.max(1, descLines.length) * lineHeight) + 10;
    const effectLines = wrapLines(rawEffectTrim, 2);
    effectTextSvg = `
      <text x="${descArea.x}" y="${effectLabelY}" font-family="sometype mono, monospace" font-size="20" fill="${baseColor}" font-weight="bold">Effect:</text>
      <text x="${descArea.x}" y="${effectLabelY + lineHeight}" font-family="sometype mono, monospace" font-size="20" fill="${baseColor}">`
      + effectLines.map((ln,i)=>`<tspan x="${descArea.x}" dy="${i===0?0:lineHeight}">${ln.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</tspan>`).join('')
      + `</text>`;
  }

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

        renderIconAt(boxX + 0, boxY, halfW, boxH, nameA, baseColor, 2) +
        renderIconAt(boxX + halfW + 20, boxY, halfW, boxH, nameB || nameA, baseColor, 2);
    } else {
      graphicMarkup = renderIconAt(boxX, boxY, boxW, boxH, nameA, baseColor, 2);
    }
  } else {
    // none: leave placeholder only
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="580" height="890" viewBox="0 0 580 890" version="1.1">
  <defs>
    ${rasterSafe ? '' : `<linearGradient id="binaryGradSys" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${gradTop}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${gradBottom}" stop-opacity="0.35"/>
    </linearGradient>`}
    ${rasterSafe ? '' : `<pattern id="binaryPatternSys" width="580" height="80" patternUnits="userSpaceOnUse">
      <text x="0" y="35" font-family="sometype mono, monospace" font-size="28" fill="url(#binaryGradSys)">0101010011101010001110101001010100111010100011101010010101001110101000111010100101010011101010001110101001</text>
      <text x="0" y="70" font-family="sometype mono, monospace" font-size="28" fill="url(#binaryGradSys)">1010100111010100011101010010101001110101000111010100101010011101010001110101001010100111010100011101010010</text>
    </pattern>`}
    ${rasterSafe ? '' : '<filter id="blurSys"><feGaussianBlur stdDeviation="0.8"/></filter>'}
  </defs>

  <rect x="0" y="0" width="580" height="890" fill="#062E35"/>
  <g transform="translate(40,40)">
    <rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="#FFFFFF"/>
    ${rasterSafe ? '' : `<rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="url(#binaryPatternSys)" ${rasterSafe ? '' : 'filter="url(#blurSys)"'}/>`}

    <!-- Title Word -->
    <text id="titleWordText" x="250" y="110" text-anchor="middle" font-family="sometype mono, monospace" font-size="${titleFontSize}" fill="${baseColor}" font-weight="bold">${titleWord || ''}</text>

    <!-- Icon Area (1/3 height ~ 270px) -->
    <g id="icon-area">
      <rect x="100" y="140" width="300" height="270" rx="20" ry="20" fill="none" stroke="${baseColor}" stroke-width="2" stroke-dasharray="8 6"/>
      ${graphicMarkup || `<text x="250" y="285" text-anchor="middle" font-family="sometype mono, monospace" font-size="18" fill="${baseColor}">Icon/Emoji area (optional)</text>`}

    <!-- Description Area (free text) -->
    <g id="description" transform="translate(0,0)">
      <rect x="50" y="430" width="400" height="250" rx="20" ry="20" fill="white" stroke="${baseColor}" stroke-width="3"/>
      ${descTextSvg}
      ${effectTextSvg}
    </g>

    <!-- Category Badge -->
    <g id="badge">
      <rect x="150" y="705" width="200" height="44" rx="22" ry="22" fill="${baseColor}" opacity="0.9"/>
      <text x="250" y="734" text-anchor="middle" font-family="sometype mono, monospace" font-size="18" fill="white">${safeCat}</text>
    </g>
  </g>
  ${showBleed ? `<rect x="0" y="0" width="580" height="890" fill="none" stroke="${bleedColor}" stroke-width="1" stroke-dasharray="6 4"/>` : ''}
  <rect x="${trimInset-40}" y="${trimInset-40}" width="${580 - 2*trimInset}" height="${890 - 2*trimInset}" rx="40" ry="40" fill="none" stroke="${trimColor}" stroke-width="1" stroke-dasharray="6 4"/>
</svg>`;
}
