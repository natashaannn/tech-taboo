// scripts/lib/generateSVG.js
export function generateSVG(topWord, topTaboos, bottomWord, bottomTaboos) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="580" height="890" viewBox="0 0 580 890" version="1.1">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0A1F33"/>
      <stop offset="100%" stop-color="#17424A"/>
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
  <rect x="0" y="0" width="580" height="890" fill="#17424A"/>
  <g transform="translate(40,40)">
    <rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="url(#bgGrad)"/>
    <rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="url(#binaryPattern)" filter="url(#blur)"/>
    <rect x="0" y="0" width="500" height="810" rx="40" ry="40" fill="none" stroke="#17424A" stroke-width="14"/>
    <line x1="0" y1="415" x2="500" y2="415" stroke="#17424A" stroke-width="3" opacity="0.7"/>
    <g id="top-half">
      <text id="topWordText" x="250" y="110" text-anchor="middle"
            font-family="sometype mono, monospace" font-size="56"
            fill="white" font-weight="bold">${topWord}</text>
      <rect x="50" y="140" width="400" height="250" rx="20" ry="20" fill="white" opacity="0.85"/>
      ${topTaboos.map((w,i) =>
        `<text x="250" y="${190+i*40}" text-anchor="middle"
              font-family="sometype mono, monospace" font-size="28"
              fill="#062E35">${w}</text>`
      ).join("")}
    </g>
    <g id="bottom-half" transform="translate(500,810) rotate(180)">
      <text id="bottomWordText" x="250" y="110" text-anchor="middle"
            font-family="sometype mono, monospace" font-size="56"
            fill="white" font-weight="bold">${bottomWord}</text>
      <rect x="50" y="140" width="400" height="250" rx="20" ry="20" fill="white" opacity="0.85"/>
      ${bottomTaboos.map((w,i) =>
        `<text x="250" y="${190+i*40}" text-anchor="middle"
              font-family="sometype mono, monospace" font-size="28"
              fill="#062E35">${w}</text>`
      ).join("")}
    </g>
  </g>
  <rect x="0" y="0" width="580" height="890" fill="none" stroke="red" stroke-width="1" stroke-dasharray="6 4"/>
  <rect x="40" y="40" width="500" height="810" rx="40" ry="40"
        fill="none" stroke="blue" stroke-width="1" stroke-dasharray="6 4"/>
</svg>`;
}
