// Shared SVG utilities for card generation and packaging

export async function svgToPng(
  svgString: string,
  width: number,
  height: number,
  _dpi: number = 96,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Set DPI for canvas
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Draw at higher resolution
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Could not convert canvas to blob"));
          }
        },
        "image/png",
        1.0,
      );
    };
    img.onerror = reject;
    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgString)));
  });
}

export async function svgStringToImageElement(
  svgString: string,
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgString)));
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function svgToDataUrl(svgString: string): string {
  return (
    "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgString)))
  );
}

function setSvgPixelDimensions(
  svgMarkup: string,
  widthPx: number,
  heightPx: number,
  viewBox: string,
): string {
  const source = String(svgMarkup);
  const match = source.match(/<svg\b[^>]*>/i);
  if (!match || !match[0]) return source;

  const originalTag = match[0];
  let newTag = originalTag
    .replace(/\swidth\s*=\s*"[^"]*"/i, "")
    .replace(/\sheight\s*=\s*"[^"]*"/i, "")
    .replace(/\sviewBox\s*=\s*"[^"]*"/i, "")
    .replace(/\sviewbox\s*=\s*"[^"]*"/i, "");

  const insertPos = newTag.lastIndexOf(">");
  if (insertPos === -1) return source;
  newTag = `${newTag.substring(0, insertPos)} width="${widthPx}" height="${heightPx}" viewBox="${viewBox}"${newTag.substring(insertPos)}`;

  return source.replace(originalTag, newTag);
}

export async function inlineSvgImages(svgMarkup: string): Promise<string> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgMarkup, "image/svg+xml");
  const images = Array.from(doc.querySelectorAll("image"));

  for (const img of images) {
    const href = (
      img.getAttribute("href") ||
      img.getAttribute("xlink:href") ||
      ""
    ).trim();
    if (!href || href.startsWith("data:")) continue;

    let absUrl: string;
    try {
      absUrl = new URL(href, window.location.href).href;
    } catch (_) {
      continue;
    }

    let res: Response;
    try {
      res = await fetch(absUrl, { cache: "force-cache" });
    } catch (_) {
      continue;
    }
    if (!res.ok) continue;

    let blob: Blob;
    try {
      blob = await res.blob();
    } catch (_) {
      continue;
    }

    let dataUrl: string;
    try {
      dataUrl = await blobToDataUrl(blob);
    } catch (_) {
      continue;
    }

    img.setAttribute("href", dataUrl);
    img.removeAttribute("xlink:href");
  }

  return new XMLSerializer().serializeToString(doc.documentElement);
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function svgToPngPrint(
  svgMarkup: string,
  widthMm: number,
  heightMm: number,
  dpi = 300,
): Promise<Blob> {
  const pxAt96 = 96 / 25.4;
  const scale = dpi / 96;
  const widthPx96 = Math.round(widthMm * pxAt96);
  const heightPx96 = Math.round(heightMm * pxAt96);
  const targetWidth = Math.round(widthPx96 * scale);
  const targetHeight = Math.round(heightPx96 * scale);

  let inlinedMarkup = String(svgMarkup);
  try {
    inlinedMarkup = await inlineSvgImages(inlinedMarkup);
  } catch (_) {
    inlinedMarkup = String(svgMarkup);
  }

  const sanitizedMarkup = inlinedMarkup.replace(
    /<foreignObject[\s\S]*?<\/foreignObject>/gi,
    "",
  );
  const normalizedSvg = setSvgPixelDimensions(
    sanitizedMarkup,
    targetWidth,
    targetHeight,
    `0 0 ${widthMm} ${heightMm}`,
  );

  return new Promise((resolve, reject) => {
    const image = new Image();
    const svgBlob = new Blob([normalizedSvg], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Could not get canvas context"));
        return;
      }

      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      setTimeout(() => {
        ctx.drawImage(image, 0, 0);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) resolve(blob);
            else reject(new Error("Could not convert canvas to blob"));
          },
          "image/png",
          1.0,
        );
      }, 120);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load SVG image"));
    };

    image.src = url;
  });
}
