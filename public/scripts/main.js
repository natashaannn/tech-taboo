// public/scripts/main.js
import { tabooList } from "./data/tabooList.js";
import { generateSVG } from "./lib/generateSVG.js";
import { saveSVG, savePNGFromSVG, saveSVGsAsZip, savePNGsAsZip } from "./lib/exporters.js";
import { setupSelector } from "./ui/selector.js";

function setSVGOutput(html) {
  document.getElementById("output").innerHTML = html;
}

// Fixed stroke color for the card border
const FIXED_STROKE = "#17424A";

// Color state: only base color and a white background toggle
const colorOptions = {
  baseColor: "#17424A",      // drives gradient
  whiteBackground: false,     // if true => background #fff, else background = FIXED_STROKE
};

function generate() {
  const rawLines = document.getElementById("input").value
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);
  const parseLine = (line) => {
    const [w, t] = line.split("|");
    if (!w || !t) return null;
    return {
      word: w.trim(),
      taboos: t.split(",").map(s => s.trim()).filter(Boolean)
    };
  };
  const pairs = [];
  for (let i = 0; i < rawLines.length; i += 2) {
    const top = parseLine(rawLines[i]);
    const bottom = parseLine(rawLines[i + 1] || rawLines[i]);
    if (top && bottom) pairs.push({ top, bottom });
  }
  if (pairs.length === 0) {
    setSVGOutput("");
    return;
  }
  const cards = pairs.map(({top, bottom}) => {
    const svg = generateSVG(top.word, top.taboos, bottom.word, bottom.taboos, {
      baseColor: colorOptions.baseColor,
      background: colorOptions.whiteBackground ? "#ffffff" : FIXED_STROKE,
      strokeColor: FIXED_STROKE,
      matchStrokeBackground: false,
      showBleed: false,
    });
    const aspectRatio = 580 / 890;
    return `
      <div style="
        width: min(90vw, 580px);
        aspect-ratio: ${aspectRatio};
        transform-origin: center;
      ">
        ${svg}
      </div>
    `;
  }).join('');
  
  const containerStyle = `
    display:flex;
    flex-wrap:wrap;
    gap:16px;
    justify-content:center;
    align-items:flex-start;
  `;  setSVGOutput(`<div style="${containerStyle}">${cards}</div>`);
}

function fillInputFromList(index1, index2) {
  if (index1 === undefined || index2 === undefined) return;
  const w1 = tabooList[index1];
  const w2 = tabooList[index2];
  document.getElementById("input").value = `${w1.word} | ${w1.taboo.join(", ")}\n${w2.word} | ${w2.taboo.join(", ")}`;
  generate();
}

function fillInputRandom() {
  let idx1 = Math.floor(Math.random() * tabooList.length);
  let idx2;
  do {
    idx2 = Math.floor(Math.random() * tabooList.length);
  } while (idx2 === idx1);
  fillInputFromList(idx1, idx2);
}

function fitTextToWidth(textSelector, maxWidth, minFontSize = 24) {
  const svgs = Array.from(document.getElementById("output").querySelectorAll("svg"));
  svgs.forEach(svg => {
    const textElem = svg.querySelector(textSelector);
    if (!textElem) return;
    let fontSize = parseInt(textElem.getAttribute("font-size"), 10) || 56;
    textElem.setAttribute("font-size", fontSize);
    let bbox = textElem.getBBox();
    while (bbox.width > maxWidth && fontSize > minFontSize) {
      fontSize -= 2;
      textElem.setAttribute("font-size", fontSize);
      bbox = textElem.getBBox();
    }
  });
}

// patch generate to fit
const originalGenerate = generate;
function patchedGenerate() {
  originalGenerate();
  fitTextToWidth("#topWordText", 490);
  fitTextToWidth("#bottomWordText", 490);
}

// wire UI
document.getElementById("btn-generate").addEventListener("click", patchedGenerate);
document.getElementById("btn-random").addEventListener("click", fillInputRandom);

const { showWordSelector } = setupSelector({
  tabooList,
  onSelect: (i1, i2) => fillInputFromList(i1, i2),
});
document.getElementById("btn-choose").addEventListener("click", showWordSelector);

// re-render when selector appends pairs
document.getElementById("input").addEventListener("tt-input-updated", patchedGenerate);

document.getElementById("btn-save-svg").addEventListener("click", async () => {
  const { saveSvgsFromContainer } = await import('./lib/utils.js');
  await saveSvgsFromContainer('#output', 'card.svg', 'taboo-cards-svg.zip');
});

document.getElementById("btn-save-png").addEventListener("click", async () => {
  const { savePngsFromContainer } = await import('./lib/utils.js');
  await savePngsFromContainer('#output', 'card.png', 'taboo-cards-png.zip', 580, 890);
});

// Open print view (A4 2x2)
function openPrint() {
  const rawLines = document.getElementById("input").value
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  // Parse a single line of the form: Word | taboo1, taboo2, ...
  const parseLine = (line) => {
    const [w, t] = line.split("|");
    if (!w || !t) return null;
    return {
      word: w.trim(),
      taboos: t.split(",").map(s => s.trim()).filter(Boolean)
    };
  };
  // Build cards from pairs of lines: [top, bottom]
  const pairs = [];
  for (let i = 0; i < Math.min(rawLines.length, 8); i += 2) {
    const top = parseLine(rawLines[i]);
    const bottom = parseLine(rawLines[i + 1] || rawLines[i]);
    if (top && bottom) pairs.push({ top, bottom });
  }

  if (pairs.length === 0) {
    alert("Please provide at least one line in the input area to print.");
    return;
  }
  while (pairs.length < 4) {
    pairs.push(pairs[pairs.length % Math.min(pairs.length, 2)]);
  }

  const payload = {
    cards: pairs.slice(0, 4), // [{top:{word,taboos}, bottom:{word,taboos}}]
    baseColor: colorOptions.baseColor,
    whiteBackground: !!colorOptions.whiteBackground,
    strokeColor: FIXED_STROKE,
    includeBacking: !!(document.getElementById("chk-backing") && document.getElementById("chk-backing").checked),
    createdAt: Date.now(),
  };
  try {
    localStorage.setItem("tt_print_payload", JSON.stringify(payload));
  } catch (_) {
    // ignore storage errors
  }
  window.open("./print.html", "_blank");
}

document.getElementById("btn-print").addEventListener("click", openPrint);

// Colors UI
function showColors() {
  const host = document.getElementById("colors");
  // Preset base color themes
  const themes = [
    { name: "Classic Teal", value: "#17424A" },
    { name: "Midnight Blue", value: "#0A1F33" },
    { name: "Indigo", value: "#3F51B5" },
    { name: "Emerald", value: "#2E7D32" },
    { name: "Purple", value: "#6A1B9A" },
    { name: "Orange", value: "#F57C00" },
    { name: "Blue", value: "#1976D2" },
    { name: "Teal", value: "#009688" },
    { name: "Violet", value: "#9C27B0" },
    { name: "Magenta", value: "#C2185B" },
    { name: "Deep Orange", value: "#E64A19" },
    { name: "Blue Grey", value: "#455A64" },
  ];
  const optionsHtml = themes
    .map(t => `<option value="${t.value}" ${t.value===colorOptions.baseColor?"selected":""}>${t.name}</option>`) 
    .join("");
  host.innerHTML = `
    <br><div style="margin-top: 8px;">
      <div style="margin-bottom: 8px;">
        <label>Theme 
          <select id="sel-base">
            ${optionsHtml}
          </select>
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" id="chk-white" ${colorOptions.whiteBackground?"checked":""}/> White background
        </label>
      </div>
    </div>
  `;

  const selBase = document.getElementById("sel-base");
  selBase.addEventListener("change", () => {
    colorOptions.baseColor = selBase.value;
    patchedGenerate();
  });

  const chkWhite = document.getElementById("chk-white");
  chkWhite.addEventListener("change", () => {
    colorOptions.whiteBackground = chkWhite.checked;
    patchedGenerate();
  });
}

document.getElementById("btn-colors").addEventListener("click", showColors);

// initial render
patchedGenerate();
