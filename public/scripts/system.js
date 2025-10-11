// public/scripts/system.js
import { generateSystemSVG } from './lib/generateSystemSVG.js';
import { getIconNames, loadIcons } from './lib/icons.js';
import { systemSamples } from './data/systemSamples.js';

const FIXED_STROKE = '#17424A';

// Available categories used in editor and samples fallback
const CATEGORIES = ['Idea Card','Role Card','System Card','Challenge Card','Tool Card'];

let LAST_SVGS = [];

function iconOptions(selected) {
  const builtins = getIconNames();
  const fromSamples = new Set();
  try {
    const groups = Object.values(systemSamples || {});
    groups.forEach(arr => Array.isArray(arr) && arr.forEach(it => {
      [it.iconName, it.iconNameA, it.iconNameB].forEach(n => { if (n) fromSamples.add(n); });
    }));
  } catch (_) {}
  const merged = Array.from(new Set([...builtins, ...fromSamples]));
  const sorted = merged.slice().sort((a,b)=>String(a).localeCompare(String(b)));
  const list = [''].concat(sorted);
  return list.map(n => `<option value="${n}" ${n===selected?'selected':''}>${n||'— no icon —'}</option>`).join('');
}

function cardEditorItem(idx, card) {
  const catOptions = CATEGORIES.map(c => `<option ${c===card.category?'selected':''}>${c}</option>`).join('');
  return `
    <div class="row" data-card-index="${idx}" style="border:1px solid #ddd; padding:12px; border-radius:8px; margin-bottom:8px;">
      <div>
        <label>Title Word</label>
        <input class="card-title" type="text" value="${card.title || ''}" placeholder="e.g., Load Balancer" />
      </div>
      <div>
        <label>Category</label><br/>
        <select class="card-category">${catOptions}</select>
      </div>
      <div>
        <label>Graphic</label><br/>
        <select class="card-source">
          <option value="none" ${card.iconMode==='none'?'selected':''}>None</option>
          <option value="icon" ${!card.iconMode || card.iconMode==='icon'?'selected':''}>Icon</option>
          <option value="emoji" ${card.iconMode==='emoji'?'selected':''}>Emoji</option>
        </select>
      </div>
      <div>
        <label>No. of Graphics</label><br/>
        <select class="card-count">
          <option value="1" ${!card.twoUp?'selected':''}>1</option>
          <option value="2" ${card.twoUp?'selected':''}>2</option>
        </select>
      </div>
      <div class="wrap-icon-a">
        <label>Icon A</label><br/>
        <select class="card-icon-a">${iconOptions(card.iconNameA || card.iconName)}</select>
      </div>
      <div class="wrap-icon-b" style="display:${card.iconMode==='icon' && card.twoUp ? 'block' : 'none'};">
        <label>Icon B</label><br/>
        <select class="card-icon-b">${iconOptions(card.iconNameB)}</select>
      </div>
      <div class="wrap-emoji-a" style="display:${card.iconMode==='emoji' ? 'block' : 'none'};">
        <label>Emoji A</label><br/>
        <input class="card-emoji-a" type="text" value="${card.emojiA || ''}" placeholder="e.g., 🖥️" />
      </div>
      <div class="wrap-emoji-b" style="display:${card.iconMode==='emoji' && card.twoUp ? 'block' : 'none'};">
        <label>Emoji B</label><br/>
        <input class="card-emoji-b" type="text" value="${card.emojiB || ''}" placeholder="e.g., ☁️" />
      </div>
      <div style="flex-basis:100%;">
        <label>Card Description (free text)</label>
        <textarea class="card-desc" style="height:100px;">${card.desc || ''}</textarea>
      </div>
      <div style="flex-basis:100%;">
        <label>Effect (optional)</label>
        <textarea class="card-effect" style="height:70px;" placeholder="e.g., Prevent next hacking challenge or draw one extra card">${card.effect || ''}</textarea>
      </div>
      <div style="flex-basis:100%; text-align:right;">
        <button class="btn-remove-card">🗑️ Remove</button>
      </div>
    </div>`;
}

function readCardsFromEditor() {
  const items = Array.from(document.querySelectorAll('#cards-editor [data-card-index]'));
  return items.map(it => {
    const title = it.querySelector('.card-title')?.value?.trim() || '';
    const desc = it.querySelector('.card-desc')?.value || '';
    const effect = it.querySelector('.card-effect')?.value || '';
    const category = it.querySelector('.card-category')?.value || 'System Card';
    const iconMode = it.querySelector('.card-source')?.value || 'icon';
    const twoUp = (it.querySelector('.card-count')?.value || '1') === '2';
    const iconNameA = it.querySelector('.card-icon-a')?.value || undefined;
    const iconNameB = it.querySelector('.card-icon-b')?.value || undefined;
    const emojiA = it.querySelector('.card-emoji-a')?.value || '';
    const emojiB = it.querySelector('.card-emoji-b')?.value || '';
    return { title, desc, effect, category, iconMode, twoUp, iconNameA, iconNameB, emojiA, emojiB };
  });
}

function renderEditor(cards) {
  const host = document.getElementById('cards-editor');
  if (!host) return;
  host.innerHTML = cards.map((c,i) => cardEditorItem(i,c)).join('');

  // Remove buttons: enabled only if more than one card exists
  const removeButtons = Array.from(host.querySelectorAll('.btn-remove-card'));
  const canRemove = cards.length > 1;
  removeButtons.forEach((btn, i) => {
    btn.disabled = !canRemove;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!canRemove) return; // keep at least one row
      cards.splice(i, 1);
      renderEditor(cards);
      renderPreview(cards);
    });
  });

  // Live preview on edits
  host.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('input', () => renderPreview(readCardsFromEditor()));
    el.addEventListener('change', () => renderPreview(readCardsFromEditor()));
  });

  // Toggle visibility for Icon/Emoji groups per card row
  Array.from(host.querySelectorAll('[data-card-index]')).forEach(row => {
    const sourceSel = row.querySelector('.card-source');
    const countSel = row.querySelector('.card-count');
    const wrapIconA = row.querySelector('.wrap-icon-a');
    const wrapIconB = row.querySelector('.wrap-icon-b');
    const wrapEmojiA = row.querySelector('.wrap-emoji-a');
    const wrapEmojiB = row.querySelector('.wrap-emoji-b');
    function updateVisibility() {
      const mode = sourceSel?.value || 'icon';
      const isTwo = (countSel?.value || '1') === '2';
      if (wrapIconA) wrapIconA.style.display = (mode === 'icon') ? 'block' : 'none';
      if (wrapIconB) wrapIconB.style.display = (mode === 'icon' && isTwo) ? 'block' : 'none';
      if (wrapEmojiA) wrapEmojiA.style.display = (mode === 'emoji') ? 'block' : 'none';
      if (wrapEmojiB) wrapEmojiB.style.display = (mode === 'emoji' && isTwo) ? 'block' : 'none';
    }
    sourceSel?.addEventListener('change', updateVisibility);
    countSel?.addEventListener('change', updateVisibility);
    updateVisibility();
  });
}

async function renderPreview(cards) {
  const baseColor = document.getElementById('theme').value || FIXED_STROKE;
  const whiteBackground = document.getElementById('whiteBg').checked;
  // Preload any selected icons from Lucide
  try {
    const names = Array.from(new Set(cards.flatMap(c => [c.iconNameA, c.iconNameB]).filter(Boolean)));
    await loadIcons(names);
  } catch (e) { /* ignore */ }
  const svgs = cards.map(card => generateSystemSVG(card.title, card.desc, card.category, {
    baseColor,
    background: whiteBackground ? '#ffffff' : FIXED_STROKE,
    strokeColor: FIXED_STROKE,
    showBleed: false,
    strokeWidth: 10,
    iconMode: card.iconMode,
    // Only two-up when user chose 2 AND provided a second graphic for that mode
    twoUp: !!(card.twoUp && ((card.iconMode==='icon' && card.iconNameB) || (card.iconMode==='emoji' && card.emojiB))),
    iconNameA: card.iconNameA,
    iconNameB: card.iconNameB,
    emojiA: card.emojiA,
    emojiB: card.emojiB,
    effect: card.effect,
  }));
  const html = svgs.map(svg => {
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
  `;
  document.getElementById('preview').innerHTML = `<div style="${containerStyle}">${html}</div>`;
}
function setup() {
  // Default to GlobePay sample card on load
  let initialCards;
  try {
    const sample = (systemSamples && systemSamples['Idea Card'] && systemSamples['Idea Card'][0]) || null;
    if (sample) {
      initialCards = [{
        title: sample.title,
        desc: sample.desc,
        effect: sample.effect || '',
        category: sample.category || 'Idea Card',
        iconMode: sample.iconMode || (sample.emojiA || sample.emojiB ? 'emoji' : 'icon'),
        twoUp: !!(sample.twoUp || (sample.iconNameB || sample.emojiB)),
        iconNameA: sample.iconNameA || sample.iconName || '',
        iconNameB: sample.iconNameB || '',
        emojiA: sample.emojiA || '',
        emojiB: sample.emojiB || '',
      }];
    } else {
      initialCards = [{ title: '', desc: '', effect: '', category: 'System Card', iconMode: 'icon', twoUp: false, iconNameA: '', iconNameB: '', emojiA: '', emojiB: '' }];
    }
  } catch (_) {
    initialCards = [{ title: '', desc: '', category: 'System Card', iconMode: 'icon', twoUp: false, iconNameA: '', iconNameB: '', emojiA: '', emojiB: '' }];
  }
  renderEditor(initialCards);
  renderPreview(initialCards);

  // Samples: populate category and words
  const selCat = document.getElementById('sample-category');
  const selWord = document.getElementById('sample-word');
  try {
    const catKeys = Object.keys(systemSamples || {});
    const options = (catKeys.length ? catKeys : CATEGORIES);
    selCat.innerHTML = options.map(c => `<option>${c}</option>`).join('');
  } catch (e) {
    console.error('Failed to load samples:', e);
    selCat.innerHTML = CATEGORIES.map(c => `<option>${c}</option>`).join('');
  }

  function refreshWords() {
    const c = selCat.value;
    const items = (systemSamples && systemSamples[c]) ? systemSamples[c] : [];
    selWord.innerHTML = items.length
      ? items.map((it, i) => `<option value="${i}">${it.title}</option>`).join('')
      : '<option disabled>No samples</option>';
  }

  selCat.addEventListener('change', refreshWords);
  // Default selects: Idea Card / first item (GlobePay is index 0)
  try { selCat.value = 'Idea Card'; } catch (_) {}
  refreshWords();
  try { const first = selWord.querySelector('option'); if (first) selWord.value = first.value; } catch (_) {}

  document.getElementById('btn-add-sample').addEventListener('click', (e) => {
    e.preventDefault();
    const c = selCat.value;
    const idx = parseInt(selWord.value || '0', 10);
    const item = (systemSamples && systemSamples[c]) ? systemSamples[c][idx] : null;
    if (!item) return;
    const cards = readCardsFromEditor();
    if (cards.length >= 4) return;
    const payload = {
      title: item.title,
      desc: item.desc,
      effect: item.effect || '',
      category: item.category || 'Idea Card',
      iconMode: item.iconMode || (item.emojiA || item.emojiB ? 'emoji' : 'icon'),
      twoUp: !!(item.twoUp || (item.iconNameB || item.emojiB)),
      iconNameA: item.iconNameA || item.iconName || '',
      iconNameB: item.iconNameB || '',
      emojiA: item.emojiA || '',
      emojiB: item.emojiB || '',
    };
    cards.push(payload);
    renderEditor(cards);
    renderPreview(cards);
  });

  document.getElementById('btn-generate').addEventListener('click', () => {
    const cards = readCardsFromEditor();
    renderPreview(cards);
  });
  document.getElementById('theme').addEventListener('change', () => renderPreview(readCardsFromEditor()));
  document.getElementById('whiteBg').addEventListener('change', () => renderPreview(readCardsFromEditor()));

  document.getElementById('btn-save-svg').addEventListener('click', async () => {
    const { saveSvgsFromContainer } = await import('./lib/utils.js');
    await saveSvgsFromContainer('#preview', 'system-card.svg', 'system-cards-svg.zip');
  });
  document.getElementById('btn-save-png').addEventListener('click', async () => {
    const { savePngsFromContainer } = await import('./lib/utils.js');
    await savePngsFromContainer('#preview', 'system-card.png', 'system-cards-png.zip', 580, 890);
  });

  // Print (A4 2x2) with optional backing
  document.getElementById('btn-print').addEventListener('click', async () => {
    const baseColor = document.getElementById('theme').value || FIXED_STROKE;
    const whiteBackground = document.getElementById('whiteBg').checked;
    const includeBacking = !!(document.getElementById('sys-chk-backing') && document.getElementById('sys-chk-backing').checked);

    let cards = readCardsFromEditor().filter(c => c.title || c.desc);
    if (cards.length === 0) cards = [{ title: 'Title', desc: '', category: 'System Card' }];
    // repeat to fill to 4
    while (cards.length < 4) cards.push(cards[cards.length % Math.min(cards.length, 2)]);
    cards = cards.slice(0,4);

    // Preload any icons to reduce flicker; systemPrint will also load if needed
    try { await loadIcons(Array.from(new Set(cards.flatMap(c => [c.iconNameA, c.iconNameB]).filter(Boolean)))); } catch (_) {}

    const payload = { cards, baseColor, whiteBackground, strokeColor: FIXED_STROKE, includeBacking, createdAt: Date.now() };
    try { localStorage.setItem('sys_print_payload', JSON.stringify(payload)); } catch (_) {}
    window.open('./system-print.html', '_blank');
  });

  // initial render handled above
}

setup();
