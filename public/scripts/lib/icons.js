// public/scripts/lib/icons.js
// Minimal Lucide-like icon registry: viewBox 24x24, stroke-based paths
// Source paths approximated; for production, consider importing from lucide directly.

// Built-in minimal icons (fallback if CDN fetch fails)
export const ICONS = {
  server: {
    name: 'server', viewBox: '0 0 24 24',
    paths: [
      'M4 6h16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z',
      'M4 14h16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z',
      'M6 8h.01', 'M6 16h.01'
    ],
  },
  database: {
    name: 'database', viewBox: '0 0 24 24',
    paths: [
      'M4 6c0-2.21 4.03-4 8-4s8 1.79 8 4-4.03 4-8 4-8-1.79-8-4z',
      'M4 6v6c0 2.21 4.03 4 8 4s8-1.79 8-4V6',
      'M4 12v6c0 2.21 4.03 4 8 4s8-1.79 8-4v-6'
    ],
  },
  cpu: {
    name: 'cpu', viewBox: '0 0 24 24',
    paths: [
      'M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8z',
      'M9 9h6v6H9z',
      'M9 1v3', 'M15 1v3', 'M9 20v3', 'M15 20v3',
      'M1 9h3', 'M1 15h3', 'M20 9h3', 'M20 15h3'
    ],
  },
  cloud: {
    name: 'cloud', viewBox: '0 0 24 24',
    paths: [
      'M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.31 1.64A4 4 0 0 0 6 19z'
    ],
  },
  boxes: {
    name: 'boxes', viewBox: '0 0 24 24',
    paths: [
      'M3 7l6-3 6 3-6 3-6-3z', 'M9 10l6-3 6 3-6 3-6-3z', 'M3 13l6-3 6 3-6 3-6-3z'
    ],
  },
  user: {
    name: 'user', viewBox: '0 0 24 24',
    paths: ['M20 21a8 8 0 1 0-16 0', 'M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8z'],
  },
  bot: {
    name: 'bot', viewBox: '0 0 24 24',
    paths: [
      'M12 2v4', 'M4 9a8 8 0 0 1 16 0v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9z',
      'M8 13h.01', 'M16 13h.01'
    ],
  },
  shield: {
    name: 'shield', viewBox: '0 0 24 24',
    paths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  },
  zap: {
    name: 'zap', viewBox: '0 0 24 24',
    paths: ['M13 2L3 14h7l-1 8 10-12h-7l1-8z'],
  },
  workflow: {
    name: 'workflow', viewBox: '0 0 24 24',
    paths: [
      'M3 6h6v6H3z', 'M15 12h6v6h-6z', 'M9 9h6', 'M12 12v3'
    ],
  },
};

export function getIconNames() { return Object.keys(ICONS); }

// Lucide CDN cache
const ICON_CACHE = {}; // name -> inner SVG markup (no outer <svg>)

export async function loadIcons(names = []) {
  const base = 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons';
  const toLoad = names.filter(n => n && !ICON_CACHE[n]);
  await Promise.all(toLoad.map(async (name) => {
    try {
      const res = await fetch(`${base}/${name}.svg`);
      if (!res.ok) throw new Error('fetch failed');
      const text = await res.text();
      // Extract inner markup by stripping outer <svg ...> ... </svg>
      const inner = text.replace(/^[\s\S]*?<svg[^>]*>/i, '').replace(/<\/svg>[\s\S]*$/i, '');
      ICON_CACHE[name] = inner;
    } catch (_) {
      // leave undefined; will fallback to built-in
    }
  }));
}

function renderFromCache(iconName, stroke = '#FFFFFF', strokeWidth = 2) {
  const inner = ICON_CACHE[iconName];
  if (!inner) return '';
  const targetW = 300, targetH = 270; // icon area
  const base = 24;
  const scale = Math.min(targetW / base, targetH / base) * 0.85;
  const tx = (targetW - base * scale) / 2;
  const ty = (targetH - base * scale) / 2;
  // Lucide uses stroke="currentColor"; enforce our stroke and width at group level
  return `
    <g transform="translate(${100 + tx}, ${140 + ty}) scale(${scale})" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${inner}</g>
  `;
}

export function renderIconSVG(iconName, stroke = '#FFFFFF', strokeWidth = 2) {
  if (ICON_CACHE[iconName]) {
    return renderFromCache(iconName, stroke, strokeWidth);
  }
  const def = ICONS[iconName];
  if (!def) return '';
  const targetW = 300, targetH = 270;
  const base = 24; // icon viewbox dimension
  const scale = Math.min(targetW / base, targetH / base) * 0.85;
  const tx = (targetW - base * scale) / 2;
  const ty = (targetH - base * scale) / 2;
  const paths = def.paths.map(d => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  return `
    <g transform="translate(${100 + tx}, ${140 + ty}) scale(${scale})">
      <rect x="0" y="0" width="0.001" height="0.001" fill="none"/>
      ${paths}
    </g>
  `;
}

export function renderIconAt(x, y, w, h, iconName, stroke = '#FFFFFF', strokeWidth = 2) {
  if (!iconName) return '';
  const base = 24;
  const scale = Math.min(w / base, h / base) * 0.85;
  const tx = x + (w - base * scale) / 2;
  const ty = y + (h - base * scale) / 2;
  if (ICON_CACHE[iconName]) {
    const inner = ICON_CACHE[iconName];
    return `<g transform="translate(${tx}, ${ty}) scale(${scale})" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`;
  }
  const def = ICONS[iconName];
  if (!def) return '';
  const paths = def.paths.map(d => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  return `<g transform="translate(${tx}, ${ty}) scale(${scale})">${paths}</g>`;
}
