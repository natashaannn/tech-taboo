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
  const { cards, baseColor, whiteBackground, strokeColor } = payload || fallback;
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

  // Slightly scale down the whole page to avoid second-page spill
  const page = document.querySelector('.page');
  page.style.transform = 'scale(0.97)';
  page.style.transformOrigin = 'top left';
}

render2x2();

setTimeout(() => window.print(), 500);
