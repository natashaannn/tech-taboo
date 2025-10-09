// public/scripts/lib/exporters.js
export function saveSVG(svgMarkup, filename = "taboo-card.svg") {
  const blob = new Blob([svgMarkup], { type: "image/svg+xml" });
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
  svgs.forEach(({ name, markup }, i) => {
    const filename = name || `card-${i + 1}.svg`;
    zip.file(filename, markup);
  });
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

export async function savePNGsAsZip(svgs, zipName = "taboo-cards-png.zip", width = 580, height = 890) {
  // svgs: array of { name: string, markup: string }
  const JSZip = await ensureJSZip();
  const zip = new JSZip();

  async function svgToPngBlob(markup) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const svgBlob = new Blob([markup], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
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
    const blob = await svgToPngBlob(markup);
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

export function savePNGFromSVG(svgMarkup, filename = "taboo-card.png", width = 580, height = 890) {
  const img = new Image();
  const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  img.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
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
}
