// public/scripts/systemPrint.js
import { generateSystemSVG } from './lib/generateSystemSVG.js';
import { loadIcons } from './lib/icons.js';

function readPayload() {
  try {
    const raw = localStorage.getItem('sys_print_payload');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

function generateBackSVG({ baseColor = '#17424A', background = '#062E35', strokeColor = '#17424A' } = {}) {
  // Match system card: white background with binary gradient overlay driven by baseColor
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
  // Match card gradient stops
  const gradTop = adjust(baseColor, +60);
  const gradBottom = adjust(baseColor, +85);
  const stroke = strokeColor;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="610" height="910" viewBox="0 0 610 910" version="1.1">
  <defs>
    <linearGradient id="binaryGradBackSys" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${gradTop}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${gradBottom}" stop-opacity="0.35"/>
    </linearGradient>
    <pattern id="binaryPatternBackSys" width="610" height="80" patternUnits="userSpaceOnUse">
      <text x="0" y="35" font-family="sometype mono, monospace" font-size="28" fill="url(#binaryGradBackSys)">0101010011101010001110101001010100111010100011101010010101001110101000111010100101010011101010001110101001</text>
      <text x="0" y="70" font-family="sometype mono, monospace" font-size="28" fill="url(#binaryGradBackSys)">1010100111010100011101010010101001110101000111010100101010011101010001110101001010100111010100011101010010</text>
    </pattern>
    <filter id="blurBackSys"><feGaussianBlur stdDeviation="0.8"/></filter>
  </defs>
  <rect x="0" y="0" width="610" height="910" fill="#062E35"/>
  <g transform="translate(40,40)">
    <rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="#FFFFFF"/>
    <rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="url(#binaryPatternBackSys)" filter="url(#blurBackSys)"/>
    <rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="none" stroke="${stroke}" stroke-width="10"/>

    <!-- Centered branding for System Design backing -->
    <g id="brand-center">
      <text x="250" y="340" text-anchor="middle" font-family="sometype mono, monospace" font-size="72" fill="#0A1F33" font-weight="bold">ragTech</text>
      <text x="250" y="388" text-anchor="middle" font-family="sometype mono, monospace" font-size="28" fill="#0A1F33" opacity="0.9">tech stack</text>
    </g>
  </g>
</svg>`;
}

async function render2x2() {
  const payload = readPayload();
  const fallback = {
    cards: [
      { title: 'Load Balancer', desc: '', category: 'System Card' },
      { title: 'API Gateway', desc: '', category: 'System Card' },
      { title: 'Queue', desc: '', category: 'System Card' },
      { title: 'Cache', desc: '', category: 'System Card' },
    ],
    baseColor: '#17424A',
    whiteBackground: true,
    strokeColor: '#17424A',
    includeBacking: true,
  };
  const { cards, baseColor, whiteBackground, strokeColor, includeBacking } = payload || fallback;
  const background = whiteBackground ? '#ffffff' : strokeColor;

  // Preload any icons (both A and B) to ensure they render in this new tab
  try {
    const iconNames = Array.from(new Set((cards || []).flatMap(c => [c.iconNameA, c.iconNameB, c.iconName]).filter(Boolean)));
    await loadIcons(iconNames);
  } catch (_) {}

  const cellIds = ['c1','c2','c3','c4'];
  cellIds.forEach((id, i) => {
    const card = cards[i] || cards[0];
    const svg = generateSystemSVG(card.title, card.desc, card.category, {
      baseColor,
      background,
      strokeColor,
      showBleed: false,
      strokeWidth: 10,
      // graphics
      iconMode: card.iconMode || (card.emojiA || card.emojiB ? 'emoji' : 'icon'),
      twoUp: !!(card.twoUp && ((card.iconMode==='icon' && card.iconNameB) || (card.iconMode==='emoji' && card.emojiB))),
      iconNameA: card.iconNameA || card.iconName,
      iconNameB: card.iconNameB,
      emojiA: card.emojiA,
      emojiB: card.emojiB,
      effect: card.effect,
      descAsText: false,
    });
    const cell = document.getElementById(id);
    cell.innerHTML = svg;
  });

  if (includeBacking) {
    const backSheet = document.getElementById('back-sheet');
    const backPage = document.getElementById('back-page');
    if (backSheet) backSheet.style.display = 'flex';
    if (backPage) backPage.style.display = 'grid';

    const back = generateBackSVG({ baseColor, background: '#ffffff', strokeColor });
    ['b1','b2','b3','b4'].forEach(id => {
      const cell = document.getElementById(id);
      if (cell) cell.innerHTML = back;
    });
  }

  // Consistent scale/centering
  Array.from(document.querySelectorAll('.page')).forEach(p => {
    p.style.transform = 'scale(0.97)';
    p.style.transformOrigin = 'center center';
  });
}

render2x2();
setTimeout(() => window.print(), 500);
