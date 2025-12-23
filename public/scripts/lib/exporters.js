// public/scripts/lib/exporters.js
async function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read blob'));
    reader.readAsDataURL(blob);
  });
}

async function inlineSvgImages(svgMarkup) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(String(svgMarkup), 'image/svg+xml');
    const images = Array.from(doc.querySelectorAll('image'));

    for (const img of images) {
      const rawHref = img.getAttribute('href') || img.getAttribute('xlink:href') || '';
      const href = String(rawHref).trim();
      if (!href || href.startsWith('data:')) continue;

      let absolute;
      try {
        absolute = new URL(href, window.location.href).href;
      } catch (_) {
        continue;
      }

      let res;
      try {
        res = await fetch(absolute, { cache: 'force-cache' });
      } catch (_) {
        continue;
      }
      if (!res || !res.ok) continue;

      let blob;
      try {
        blob = await res.blob();
      } catch (_) {
        continue;
      }

      let dataUrl;
      try {
        dataUrl = await blobToDataURL(blob);
      } catch (_) {
        continue;
      }

      if (!dataUrl || !dataUrl.startsWith('data:')) continue;
      img.setAttribute('href', dataUrl);
      img.removeAttribute('xlink:href');
    }

    return new XMLSerializer().serializeToString(doc.documentElement);
  } catch (_) {
    return String(svgMarkup);
  }
}

export async function saveSVG(svgMarkup, filename = "taboo-card.svg") {
  let markup = String(svgMarkup);
  try {
    markup = await inlineSvgImages(markup);
  } catch (_) {
    markup = String(svgMarkup);
  }
  const blob = new Blob([markup], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Lazy-load JSZip from CDN if not already loaded
async function ensureJSZip() {
  if (window.JSZip) return window.JSZip;
  await new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js";
    s.onload = resolve;
    s.onerror = () => reject(new Error("Failed to load JSZip"));
    document.head.appendChild(s);
  });
  return window.JSZip;
}

export async function saveSVGsAsZip(svgs, zipName = "taboo-cards-svg.zip") {
  // svgs: array of { name: string, markup: string }
  const JSZip = await ensureJSZip();
  const zip = new JSZip();
  for (let i = 0; i < svgs.length; i++) {
    const { name, markup } = svgs[i];
    const filename = name || `card-${i + 1}.svg`;
    let inlined = String(markup);
    try {
      inlined = await inlineSvgImages(inlined);
    } catch (_) {
      inlined = String(markup);
    }
    zip.file(filename, inlined);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = zipName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function savePNGsAsZip(svgs, zipName = "taboo-cards-png.zip", width = 610, height = 910) {
  // svgs: array of { name: string, markup: string }
  const JSZip = await ensureJSZip();
  const zip = new JSZip();

  function sanitizeForCanvas(markup) {
    // Remove foreignObject blocks to avoid tainting the canvas when drawing the SVG image
    return String(markup).replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '');
  }

  async function svgToPngBlob(markup) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const safe = sanitizeForCanvas(markup);
      const svgBlob = new Blob([safe], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const scale = 300 / 96; // scale to approximate 300 DPI from default 96 DPI
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);
        const ctx = canvas.getContext("2d");
        ctx.scale(scale, scale);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url);
          if (blob) resolve(blob); else reject(new Error("toBlob failed"));
        }, "image/png");
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error("PNG export failed for one of the SVGs"));
      };
      img.src = url;
    });
  }

  for (let i = 0; i < svgs.length; i++) {
    const { name, markup } = svgs[i];
    const filename = (name || `card-${i + 1}.png`).replace(/\.svg$/i, ".png");
    let inlined = String(markup);
    try {
      inlined = await inlineSvgImages(inlined);
    } catch (_) {
      inlined = String(markup);
    }
    const blob = await svgToPngBlob(inlined);
    zip.file(filename, blob);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = zipName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function savePNGFromSVG(svgMarkup, filename = "taboo-card.png", width = 610, height = 910) {
  (async () => {
    const img = new Image();
    let markup = String(svgMarkup);
    try {
      markup = await inlineSvgImages(markup);
    } catch (_) {
      markup = String(svgMarkup);
    }
    const safe = String(markup).replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '');
    const svgBlob = new Blob([safe], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const scale = 300 / 96; // scale to approximate 300 DPI from default 96 DPI
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const ctx = canvas.getContext("2d");
      ctx.scale(scale, scale);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(function (blob) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, "image/png");
      URL.revokeObjectURL(url);
    };
    img.onerror = function () {
      alert("PNG export failed. Try a different browser.");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  })();
}
