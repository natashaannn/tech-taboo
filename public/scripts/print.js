// public/scripts/print.js
import { generateSVG } from './lib/generateSVG.js';

function readPayload() {
  try {
    const raw = localStorage.getItem('tt_print_payload');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

function render2x2() {
  const payload = readPayload();
  const fallback = {
    cards: [
      { top: { word: 'CLOUD', taboos: ['Internet','Server','Storage','AWS','Azure'] }, bottom: { word: 'BLOCKCHAIN', taboos: ['Bitcoin','Ledger','Crypto','Token','Decentralized'] } },
      { top: { word: 'CLOUD', taboos: ['Internet','Server','Storage','AWS','Azure'] }, bottom: { word: 'BLOCKCHAIN', taboos: ['Bitcoin','Ledger','Crypto','Token','Decentralized'] } },
      { top: { word: 'CLOUD', taboos: ['Internet','Server','Storage','AWS','Azure'] }, bottom: { word: 'BLOCKCHAIN', taboos: ['Bitcoin','Ledger','Crypto','Token','Decentralized'] } },
      { top: { word: 'CLOUD', taboos: ['Internet','Server','Storage','AWS','Azure'] }, bottom: { word: 'BLOCKCHAIN', taboos: ['Bitcoin','Ledger','Crypto','Token','Decentralized'] } },
    ],
    baseColor: '#17424A',
    whiteBackground: false,
    strokeColor: '#17424A',
  };
  const { cards, baseColor, whiteBackground, strokeColor, includeBacking } = payload || fallback;
  const background = whiteBackground ? '#ffffff' : strokeColor;

  const cellIds = ['c1','c2','c3','c4'];
  cellIds.forEach((id, i) => {
    const card = cards[i] || cards[0];
    const svg = generateSVG(card.top.word, card.top.taboos, card.bottom.word, card.bottom.taboos, {
      baseColor,
      background,
      strokeColor,
      matchStrokeBackground: false,
      showBleed: false,
      strokeWidth: 10,
      dividerWidth: 2,
    });
    const cell = document.getElementById(id);
    cell.innerHTML = svg;
  });

  // Optionally render backs page
  if (includeBacking) {
    const backSheet = document.getElementById('back-sheet');
    const backPage = document.getElementById('back-page');
    if (backSheet) backSheet.style.display = 'flex';
    if (backPage) backPage.style.display = 'grid';

    const backIds = ['b1','b2','b3','b4'];
    const backSVG = generateBackSVG({ baseColor, background, strokeColor });
    backIds.forEach((id) => {
      const cell = document.getElementById(id);
      if (cell) cell.innerHTML = backSVG;
    });
  }

  // Slightly scale down all pages to avoid spill
  const pages = Array.from(document.querySelectorAll('.page'));
  pages.forEach((p) => {
    p.style.transform = 'scale(0.97)';
    p.style.transformOrigin = 'center center';
  });
}

render2x2();

setTimeout(() => window.print(), 500);

// Generate branded back SVG matching front size and style
function generateBackSVG({ baseColor = '#17424A', background = '#17424A', strokeColor = '#17424A' } = {}) {
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
  const gradTop = adjust(baseColor, -30);
  const gradBottom = adjust(baseColor, +15);
  const stroke = strokeColor;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="580" height="890" viewBox="0 0 580 890" version="1.1">
  <defs>
    <linearGradient id="bgGradBack" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${gradTop}"/>
      <stop offset="100%" stop-color="${gradBottom}"/>
    </linearGradient>
    <pattern id="binaryPatternBack" width="580" height="80" patternUnits="userSpaceOnUse">
      <text x="0" y="35" font-family="sometype mono, monospace"
            font-size="28" fill="rgba(200,220,255,0.18)">
        0101010011101010001110101001010100111010100011101010010101001110101000111010100101010011101010001110101001
      </text>
      <text x="0" y="70" font-family="sometype mono, monospace"
            font-size="28" fill="rgba(200,220,255,0.18)">
        1010100111010100011101010010101001110101000111010100101010011101010001110101001010100111010100011101010010
      </text>
    </pattern>
    <filter id="blurBack"><feGaussianBlur stdDeviation="0.8"/></filter>
  </defs>
  <rect x="0" y="0" width="580" height="890" fill="${background}"/>
  <g transform="translate(40,40)">
    <rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="url(#bgGradBack)"/>
    <rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="url(#binaryPatternBack)" filter="url(#blurBack)"/>
    <rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="none" stroke="${stroke}" stroke-width="10"/>

    <!-- Centered branding on both halves for symmetry when flipping -->
    <g id="brand-top">
      <text x="250" y="240" text-anchor="middle" font-family="sometype mono, monospace" font-size="72" fill="white" font-weight="bold">ragTech</text>
      <text x="250" y="290" text-anchor="middle" font-family="sometype mono, monospace" font-size="28" fill="white" opacity="0.9">tech taboo</text>
    </g>
    <g id="brand-bottom" transform="translate(500,810) rotate(180)">
      <text x="250" y="240" text-anchor="middle" font-family="sometype mono, monospace" font-size="72" fill="white" font-weight="bold">ragTech</text>
      <text x="250" y="290" text-anchor="middle" font-family="sometype mono, monospace" font-size="28" fill="white" opacity="0.9">tech taboo</text>
    </g>
  </g>
</svg>`;
}
