// public/scripts/ui/selector.js
import { CATEGORIES, buildCategoryMaps } from "../lib/categories.js";

export function setupSelector({ tabooList, onSelect }) {
  const selectorSpan = document.getElementById("selector");
  const wordsByCategory = buildCategoryMaps(tabooList);

  function updateWordSelects() {
    const cat = document.getElementById("selCat").value;
    const items = wordsByCategory[cat] || [];
    const options = items.map(({ index, word }) => `<option value="${index}">${word}</option>`).join("");
    const sel1 = document.getElementById("sel1");
    const sel2 = document.getElementById("sel2");
    sel1.innerHTML = options;
    sel2.innerHTML = options;
  }

  function showWordSelector() {
    const defaultCat = "AI";
    let html = '';
    html += '<br><div style="margin-top: 8px;">';
    html += '<div style="margin-bottom: 8px;">';
    html += '<label>Category: <select id="selCat">';
    html += CATEGORIES.map(c => `<option value="${c}" ${c===defaultCat?"selected":""}>${c}</option>`).join("");
    html += '</select></label>';
    html += '</div>';
    html += '<div style="margin-bottom: 8px;">';
    html += '<label>Word 1: <select id="sel1"></select></label>';
    html += '</div>';
    html += '<div style="margin-bottom: 8px;">';
    html += '<label>Word 2: <select id="sel2"></select></label>';
    html += '</div>';
    html += '<div>';
    html += '<button class="cta" id="btn-select-generate">✨Generate Selected Words</button> ';
    html += '<button id="btn-select-add">➕ Add word pair</button>';
    html += '</div>';
    html += '</div>';
    selectorSpan.innerHTML = html;

    // initial population
    updateWordSelects();

    // wire changes
    document.getElementById("selCat").addEventListener("change", updateWordSelects);

    document.getElementById("btn-select-generate").addEventListener("click", () => {
      const idx1 = parseInt(document.getElementById("sel1").value, 10);
      const idx2 = parseInt(document.getElementById("sel2").value, 10);
      onSelect(idx1, idx2);
    });

    document.getElementById("btn-select-add").addEventListener("click", () => {
      const idx1 = parseInt(document.getElementById("sel1").value, 10);
      const idx2 = parseInt(document.getElementById("sel2").value, 10);
      if (isNaN(idx1) || isNaN(idx2)) return;
      const w1 = tabooList[idx1];
      const w2 = tabooList[idx2];
      const ta = document.getElementById("input");
      const prefix = ta.value.trim().length ? "\n" : "";
      ta.value = `${ta.value}${prefix}${w1.word} | ${w1.taboo.join(", ")}\n${w2.word} | ${w2.taboo.join(", ")}`;
      // Trigger a re-render if the caller provided one via a custom event
      const ev = new Event('tt-input-updated');
      ta.dispatchEvent(ev);
    });
  }

  return { showWordSelector };
}
